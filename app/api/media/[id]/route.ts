import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminRecord } = await supabase
      .from('admins')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!adminRecord) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get media record
    const { data: mediaRecord, error: fetchErr } = await supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !mediaRecord) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Delete from Cloudinary
    await deleteImageFromCloudinary(mediaRecord.public_id);

    // Delete from Supabase
    const { error: delErr } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (delErr) {
      return NextResponse.json({ error: 'Failed to delete from database' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete media API error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
