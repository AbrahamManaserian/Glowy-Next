import { Box, Typography } from '@mui/material';
import AdminOrdersPageUI from './_components/AdminOrdersPageUI';

export default async function AdminOrdersPage({ searchParams }) {
  const url = await searchParams;
  // allow only safe keys from incoming searchParams
  const allowedKeys = ['status', 'limit', 'after'];
  const safeParams = Object.fromEntries(Object.entries(url || {}).map(([k, v]) => [String(k), String(v)]));
  const filteredParams = Object.fromEntries(
    Object.entries(safeParams).filter(([key]) => allowedKeys.includes(key))
  );

  const queryString = new URLSearchParams(filteredParams).toString();
  const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://glowy-store-next.netlify.app';

  // Fetch server-side with error handling
  let data = null;
  let counts = null;
  try {
    const res = await fetch(`${baseUrl}/api/admin/orders?${queryString}`, { cache: 'no-store' });

    const resCount = await fetch(`${baseUrl}/api/admin/orders/counts`, { cache: 'no-store' });
    //       if (!response.ok) throw new Error('Failed to fetch counts');
    //       const data = await response.json();

    if (!res.ok || !resCount.ok) {
      const body = await res.text().catch(() => '');
      console.error('Server error fetching orders:', res.status, body);
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" color="error">
            Failed to load orders (status: {res.status})
          </Typography>
          {body && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {body}
            </Typography>
          )}
        </Box>
      );
    }

    data = await res.json();
    counts = await resCount.json();

    // console.log(data);
  } catch (err) {
    console.error('Network error fetching orders:', err);
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Error loading orders
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {err?.message ?? 'Unknown error'}
        </Typography>
      </Box>
    );
  }
  return <AdminOrdersPageUI initialLoading={false} counts={counts} initialOrders={data} searchParams={url} />;
}
