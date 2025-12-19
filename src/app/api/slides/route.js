import { NextResponse } from 'next/server';
import { getCachedSlides } from '@/_lib/firebase/getCachedSlides';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slides = await getCachedSlides();

    return NextResponse.json(slides, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Error fetching slides:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
