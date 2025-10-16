import { getSuppliers } from '@/app/lib/firebase/getSuppliers';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const suppliers = await getSuppliers();
    // Check if the request is from admin pages
    const isAdmin = url.pathname.includes('/admin'); // true if URL contains /admin
    const cacheSeconds = isAdmin ? 0 : 3600; // 0 for admin, 1h for public

    return new Response(JSON.stringify(suppliers), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control':
          cacheSeconds > 0
            ? `public, max-age=${cacheSeconds}, s-maxage=${
                cacheSeconds * 2
              }, stale-while-revalidate=${cacheSeconds}`
            : 'no-store', // no caching for admin
      },
    });
  } catch (error) {
    console.error('API fetch error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
