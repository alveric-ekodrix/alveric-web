import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body can be empty
    }

    const path = body?.path;
    if (path) {
      revalidatePath(path);
      revalidatePath(path, 'page');
    }

    // Always revalidate /about and / by default
    revalidatePath('/about');
    revalidatePath('/about', 'page');
    revalidatePath('/');
    revalidatePath('/', 'page');

    return NextResponse.json({
      revalidated: true,
      path: path || '/about',
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { revalidated: false, error: err?.message || 'Revalidation failed' },
      { status: 500 }
    );
  }
}
