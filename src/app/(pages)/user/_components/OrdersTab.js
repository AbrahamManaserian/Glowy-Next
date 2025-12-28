'use client';

import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  Collapse,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import Image from 'next/image';
import { useGlobalContext } from '@/app/GlobalContext';

export default function OrdersTab({ orders }) {
  const { user } = useGlobalContext();
  const [openItems, setOpenItems] = React.useState({});
  const [tabValue, setTabValue] = React.useState(0); // 0: pending, 1: delivered
  const [deliveredOrders, setDeliveredOrders] = React.useState([]);
  const [loadingDelivered, setLoadingDelivered] = React.useState(false);

  const handleToggle = (orderId) => {
    setOpenItems((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const fetchDeliveredOrders = async () => {
    if (deliveredOrders.length > 0 || !user) return; // already fetched or not signed in

    setLoadingDelivered(true);
    const url = `/api/orders/delivered?userId=${user.uid}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDeliveredOrders(data);
      }
    } catch (error) {
      console.error('Error fetching delivered orders:', error);
    } finally {
      setLoadingDelivered(false);
    }
  };

  const handleTabChange = async (event, newValue) => {
    if (newValue === 1) {
      await fetchDeliveredOrders();
      setTabValue(newValue);
    } else {
      setTabValue(newValue);
    }
  };

  const displayOrders = tabValue === 0 ? orders : deliveredOrders;

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1.05rem' }}>
          My Orders
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Pending Orders" />
          <Tab label="Delivered Orders" />
        </Tabs>
        <Grid sx={{ position: 'relative' }} container spacing={1.2}>
          {loadingDelivered && (
            <CircularProgress
              sx={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                // transform: 'translate(-50%, -50%)',
                zIndex: 9999,
              }}
            />
          )}
          {displayOrders.map((order) => (
            <Grid size={{ xs: 12 }} key={order.id}>
              <Paper
                sx={{
                  p: 0.7,
                  borderTop: '1px solid #E0E0E0',
                  borderBottom: '1px solid #E0E0E0',
                  borderLeft: '1px solid #E0E0E0',
                  borderRight: '1px solid #E0E0E0',
                  boxShadow: 'none',
                  borderRadius: 2,
                }}
              >
                {/* ...existing code for order card... */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.1 }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.98rem' }}>
                    Order #{order.id.slice(0, 12)}
                  </Typography>
                  <Chip
                    label={order.status || 'Processing'}
                    color={
                      order.status === 'delivered'
                        ? 'success'
                        : order.status === 'inTransit'
                        ? 'primary'
                        : order.status === 'cancelled'
                        ? 'error'
                        : 'error'
                    }
                    sx={{ fontWeight: 600, fontSize: '0.78rem', height: 22 }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: '0.82rem', mb: 0.5 }}
                >
                  Date:{' '}
                  {new Date(order.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </Typography>
                <Divider sx={{ my: 1.1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.93rem' }} gutterBottom>
                    Items
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleToggle(order.id)}
                    sx={{
                      ml: 0.5,
                      transform: openItems[order.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      p: 0.5,
                    }}
                    aria-label={openItems[order.id] ? 'Collapse items' : 'Expand items'}
                  >
                    <ExpandMoreIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Collapse in={!!openItems[order.id]} timeout="auto" unmountOnExit>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7 }}>
                    {order.items?.map((item, idx) => (
                      <Link
                        key={idx}
                        href={`/item/${item.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        passHref
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 0.7,
                            py: 0.2,
                            cursor: 'pointer',
                            '&:hover': { background: '#f5f5f5' },
                          }}
                        >
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              position: 'relative',
                              borderRadius: '5px',
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
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{ fontSize: { xs: '0.72rem', sm: '0.85rem' }, lineHeight: 1.18 }}
                            >
                              {item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                              Qty: {item.quantity} x ${item.price}
                            </Typography>
                            {item.selectedColor && (
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                                sx={{ fontSize: '0.66rem' }}
                              >
                                Color: {item.selectedColor.name}
                              </Typography>
                            )}
                            {item.selectedSize && (
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                                sx={{ fontSize: '0.66rem' }}
                              >
                                Size: {item.selectedSize}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Link>
                    ))}
                    {/* Subtotal above Total Savings section inside the same collapse */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={500}
                        sx={{ fontSize: '0.93rem', color: '#666' }}
                      >
                        Subtotal
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        fontWeight={500}
                        sx={{ color: '#666', fontSize: '0.96rem', letterSpacing: 0.2 }}
                      >
                        {order.financials?.subtotal?.toLocaleString('en-US')} ֏
                      </Typography>
                    </Box>
                    {order.financials?.shippingCost > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={400}
                          sx={{ fontSize: '0.88rem', color: '#666' }}
                        >
                          Shipping
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          fontWeight={400}
                          sx={{ color: '#666', fontSize: '0.91rem', letterSpacing: 0.2 }}
                        >
                          {order.financials.shippingCost?.toLocaleString('en-US')} ֏
                        </Typography>
                      </Box>
                    )}
                    {order.financials &&
                      (order.financials.totalSaved > 0 ||
                        order.financials.savedFromOriginalPrice > 0 ||
                        order.financials.discount > 0 ||
                        order.financials.shippingSavings > 0) && (
                        <Box
                          sx={{
                            mb: '10px',
                            mt: '10px',
                            p: '10px',
                            bgcolor: '#fff7ed',
                            borderRadius: '8px',
                            border: '1px dashed #e65100',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '5px' }}>
                            <Typography sx={{ color: '#e65100', fontSize: '15px', fontWeight: 600 }}>
                              Total Savings
                            </Typography>
                            <Typography sx={{ color: '#e65100', fontSize: '15px', fontWeight: 700 }}>
                              ֏{order.financials.totalSaved?.toLocaleString('en-US')}
                            </Typography>
                          </Box>
                          {order.financials.savedFromOriginalPrice > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                                • Product markdowns
                              </Typography>
                              <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                                ֏{order.financials.savedFromOriginalPrice?.toLocaleString('en-US')}
                              </Typography>
                            </Box>
                          )}
                          {order.financials.discount > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                                • Extra 20% discount
                              </Typography>
                              <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                                ֏{order.financials.discount?.toLocaleString('en-US')}
                              </Typography>
                            </Box>
                          )}
                          {order.financials.shippingSavings > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                                • Free shipping
                              </Typography>
                              <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                                ֏{order.financials.shippingSavings?.toLocaleString('en-US')}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                  </Box>
                </Collapse>
                <Divider sx={{ my: 1.1 }} />
                {/* Detailed order financials info styled like CartPageUi.js */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.93rem' }}>
                      Total Paid
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ color: '#000', fontSize: '0.98rem' }}
                    >
                      {order.financials?.total?.toLocaleString('en-US')} ֏
                    </Typography>
                  </Box>
                  {/* Removed duplicate total savings section. Only the one inside the items collapse remains. */}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </>

      {displayOrders.length === 0 && (
        <Box sx={{ textAlign: 'center', color: '#888' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#F5F5F5',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                <path d="M7 7V6a5 5 0 0 1 10 0v1" stroke="#E57373" strokeWidth="1.7" strokeLinecap="round" />
                <rect x="3" y="7" width="18" height="13" rx="3" stroke="#E57373" strokeWidth="1.7" />
                <path d="M16 11a4 4 0 0 1-8 0" stroke="#E57373" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </Box>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600, color: '#E57373' }}>
              No {tabValue === 0 ? 'Pending' : 'Delivered'} Orders Yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
              {tabValue === 0
                ? `You don't have any orders in progress yet.`
                : `You don't have any delivered orders yet.`}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
