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

    const singlePath = body?.path;
    const multiPaths: string[] = Array.isArray(body?.paths) ? body.paths : [];
    const allPathsToRevalidate = new Set<string>();

    if (singlePath && typeof singlePath === 'string') {
      allPathsToRevalidate.add(singlePath);
    }
    for (const p of multiPaths) {
      if (p && typeof p === 'string') {
        allPathsToRevalidate.add(p);
      }
    }

    // Always revalidate homepage and default paths
    allPathsToRevalidate.add('/');

    for (const p of allPathsToRevalidate) {
      try {
        revalidatePath(p);
        revalidatePath(p, 'page');
        revalidatePath(p, 'layout');
      } catch (err) {
        console.warn(`Could not revalidate path ${p}:`, err);
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths: Array.from(allPathsToRevalidate),
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { revalidated: false, error: err?.message || 'Revalidation failed' },
      { status: 500 }
    );
  }
}
