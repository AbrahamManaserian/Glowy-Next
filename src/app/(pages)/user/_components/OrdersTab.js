'use client';

import { Box, Typography, Button, TextField, Alert, Grid, Paper, Divider, Chip } from '@mui/material';
import Image from 'next/image';
import { ShoppingBag } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

export default function OrdersTab({
  user,
  orders,
  trackOrderId,
  setTrackOrderId,
  trackPhoneNumber,
  setTrackPhoneNumber,
  trackLoading,
  setTrackLoading,
  trackError,
  setTrackError,
  trackedOrder,
  setTrackedOrder,
}) {
  const router = useRouter();

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!trackOrderId || !trackPhoneNumber) {
      setTrackError('Please enter both Order ID and Phone Number');
      return;
    }

    setTrackLoading(true);
    setTrackError('');
    setTrackedOrder(null);

    try {
      const q = query(collection(db, 'orders'), where('orderNumber', '==', trackOrderId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setTrackError('Order not found. Please check your Order ID.');
        setTrackLoading(false);
        return;
      }

      const orderDoc = querySnapshot.docs[0];
      const orderData = orderDoc.data();

      if (orderData.customer.phoneNumber !== trackPhoneNumber) {
        setTrackError('Phone number does not match this order.');
        setTrackLoading(false);
        return;
      }

      setTrackedOrder({ id: orderDoc.id, ...orderData });
    } catch (err) {
      console.error(err);
      setTrackError('Failed to fetch order details. Please try again.');
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 4 }}>
      {!user && (
        <>
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
            Track Your Order
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Enter your order ID and phone number to see the status and details of your purchase.
          </Typography>
          <Box
            component="form"
            onSubmit={handleTrackOrder}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Order ID"
                  placeholder="e.g. 0000001"
                  value={trackOrderId}
                  onChange={(e) => setTrackOrderId(e.target.value)}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number"
                  placeholder="e.g. 5551234567"
                  value={trackPhoneNumber}
                  onChange={(e) => setTrackPhoneNumber(e.target.value)}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  type="tel"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              disabled={trackLoading}
              sx={{
                bgcolor: '#E57373',
                borderRadius: '12px',
                textTransform: 'none',
                px: 4,
                '&:hover': { bgcolor: '#EF5350' },
              }}
            >
              {trackLoading ? 'Tracking...' : 'Track'}
            </Button>
          </Box>
        </>
      )}

      {trackError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {trackError}
        </Alert>
      )}

      {trackedOrder && (
        <Paper sx={{ p: 3, border: '1px solid #E0E0E0', borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Order #{trackedOrder.id}
            </Typography>
            <Chip
              label={trackedOrder.status || 'Processing'}
              color={
                trackedOrder.status === 'Delivered'
                  ? 'success'
                  : trackedOrder.status === 'Shipped'
                  ? 'primary'
                  : trackedOrder.status === 'Cancelled'
                  ? 'error'
                  : 'default'
              }
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Date:{' '}
            {trackedOrder.createdAt?.toDate
              ? trackedOrder.createdAt.toDate().toLocaleDateString()
              : new Date(trackedOrder.createdAt).toLocaleDateString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Items
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {trackedOrder.items?.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #eee',
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={item.img || '/images/cosmetic/placeholder.jpg'}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight="500">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Qty: {item.quantity} x ${item.price}
                  </Typography>
                  {item.selectedColor && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      Color: {item.selectedColor.name}
                    </Typography>
                  )}
                  {item.selectedSize && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      Size: {item.selectedSize}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Total Amount
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              ${trackedOrder.totalAmount?.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* For signed-in users, show their orders as trackable cards */}
      {user && orders.length > 0 && !trackedOrder && (
        <>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            My Orders
          </Typography>
          <Grid container spacing={2}>
            {orders.map((order) => (
              <Grid size={{ xs: 12 }} key={order.id}>
                <Paper sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Order #{order.id.slice(0, 12)}
                    </Typography>
                    <Chip
                      label={order.status || 'Processing'}
                      color={
                        order.status === 'Delivered'
                          ? 'success'
                          : order.status === 'Shipped'
                          ? 'primary'
                          : order.status === 'Cancelled'
                          ? 'error'
                          : 'default'
                      }
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Date:{' '}
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleDateString()
                      : new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Items
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {order.items?.map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            position: 'relative',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #eee',
                            flexShrink: 0,
                          }}
                        >
                          <Image
                            src={item.img || '/images/cosmetic/placeholder.jpg'}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body1" fontWeight="500">
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.quantity} x ${item.price}
                          </Typography>
                          {item.selectedColor && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              Color: {item.selectedColor.name}
                            </Typography>
                          )}
                          {item.selectedSize && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              Size: {item.selectedSize}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total Amount
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      ${order.totalAmount?.toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {user && orders.length === 0 && !trackedOrder && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <ShoppingBag sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
          <Typography>No orders found yet.</Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2, borderRadius: '12px', color: '#E57373', borderColor: '#E57373' }}
            onClick={() => router.push('/')}
          >
            Start Shopping
          </Button>
        </Box>
      )}
    </Box>
  );
}
