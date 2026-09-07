import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadImageToCloudinary, uploadBufferToCloudinary } from '@/lib/cloudinary/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is in admins table
    const { data: adminRecord } = await supabase
      .from('admins')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!adminRecord) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'alveric';
    const altText = (formData.get('alt_text') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to Buffer for direct stream upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Primary: Direct binary stream upload
    let cloudRes = await uploadBufferToCloudinary(buffer, folder);

    // 2. Secondary fallback: Base64 data URI upload
    if (!cloudRes.success || !cloudRes.secure_url) {
      const mime = file.type || 'image/jpeg';
      const base64DataUri = `data:${mime};base64,${buffer.toString('base64')}`;
      cloudRes = await uploadImageToCloudinary(base64DataUri, folder);
    }

    if (!cloudRes.success || !cloudRes.secure_url || !cloudRes.public_id) {
      return NextResponse.json(
        { error: cloudRes.error || 'Cloudinary upload failed' },
        { status: 500 }
      );
    }

    // Save record to Supabase media table
    const { data: mediaRecord, error: dbError } = await supabase
      .from('media')
      .insert({
        public_id: cloudRes.public_id,
        secure_url: cloudRes.secure_url,
        resource_type: cloudRes.resource_type || 'image',
        width: cloudRes.width || null,
        height: cloudRes.height || null,
        folder,
        alt_text: altText || file.name,
      })
      .select('*')
      .single();

    if (dbError || !mediaRecord) {
      console.warn('Database record creation warning for media, using direct media object:', dbError);
      return NextResponse.json({
        success: true,
        media: {
          id: cloudRes.public_id,
          public_id: cloudRes.public_id,
          secure_url: cloudRes.secure_url,
          resource_type: cloudRes.resource_type || 'image',
          width: cloudRes.width || null,
          height: cloudRes.height || null,
          folder,
          alt_text: altText || file.name,
        },
      });
    }

    return NextResponse.json({ success: true, media: mediaRecord });
  } catch (err: any) {
    console.error('Media upload API error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
