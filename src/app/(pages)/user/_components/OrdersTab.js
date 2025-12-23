'use client';

import { Box, Typography, Grid, Paper, Divider, Chip, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import Image from 'next/image';

export default function OrdersTab({ orders }) {
  const [openItems, setOpenItems] = React.useState({});
  const handleToggle = (orderId) => {
    setOpenItems((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };
  return (
    <Box sx={{ maxWidth: 600 }}>
      {orders.length > 0 ? (
        <>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1.05rem' }}>
            My Orders
          </Typography>
          <Grid container spacing={1.2}>
            {orders.map((order) => (
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
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.1 }}
                  >
                    <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.98rem' }}>
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
                    {(() => {
                      const dateObj = order.createdAt?.toDate
                        ? order.createdAt.toDate()
                        : new Date(order.createdAt);
                      return dateObj.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      });
                    })()}
                  </Typography>
                  <Divider sx={{ my: 1.1 }} />
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', mb: 0.5, justifyContent: 'space-between' }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ fontSize: '0.93rem' }}
                      gutterBottom
                    >
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
                        <Box key={idx} sx={{ display: 'flex', gap: 0.7, py: 0.2 }}>
                          <Box
                            sx={{
                              width: 34,
                              height: 34,
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
                      ))}
                    </Box>
                  </Collapse>
                  <Divider sx={{ my: 1.1 }} />
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
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
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
              No Orders Yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
              You haven't placed any orders yet.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
