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
  Stack,
  Skeleton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';

import { useGlobalContext } from '@/app/GlobalContext';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase';
import { Link } from '@/i18n/routing';

const OrderImage = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchImage = async () => {
      if (!src) {
        if (active) {
          setImgSrc('/placeholder.png');
          setLoading(false);
        }
        return;
      }

      if (src.startsWith('http') || src.startsWith('/')) {
        if (active) {
          setImgSrc(src);
          setLoading(false);
        }
        return;
      }

      // Assume it's a firebase storage path
      try {
        const storageRef = ref(storage, src);
        const url = await getDownloadURL(storageRef);
        if (active) {
          setImgSrc(url);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching image URL for', src, err);
        if (active) {
          setImgSrc('/placeholder.png');
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      active = false;
    };
  }, [src]);

  if (loading) {
    return <Skeleton variant="rectangular" width="100%" height="100%" />;
  }

  return (
    <Image
      src={imgSrc || '/placeholder.png'}
      alt={alt || 'Product Image'}
      fill
      style={{ objectFit: 'cover' }}
    />
  );
};

const formatDate = (value) => {
  if (value === null || value === undefined) return '—';

  try {
    let d;
    if (value?.toDate && typeof value.toDate === 'function') {
      d = value.toDate();
    } else if (value?.seconds !== undefined) {
      d = new Date(value.seconds * 1000);
    } else {
      d = new Date(value);
    }

    if (isNaN(d.getTime())) return '—';

    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  } catch (err) {
    return '—';
  }
};

export default function OrdersTab({ orders }) {
  const t = useTranslations('UserPage.ordersTab');
  const tProduct = useTranslations('ProductPage');
  const { user } = useGlobalContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const statusParam = searchParams.get('status') || 'pending';

  const [openItems, setOpenItems] = useState({});
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loadingDelivered, setLoadingDelivered] = useState(false);

  // Map status param to tab index
  const tabValue = statusParam === 'in-transit' ? 1 : statusParam === 'delivered' ? 2 : 0;

  const handleTabChange = (event, newValue) => {
    let newStatus = 'pending';
    if (newValue === 1) newStatus = 'in-transit';
    if (newValue === 2) newStatus = 'delivered';

    router.push(`${pathname}?status=${newStatus}`, { scroll: false });
  };

  // Fetch delivered orders

  useEffect(() => {
    if (statusParam === 'delivered') {
      setLoadingDelivered(true);
      fetch(`/api/orders/delivered?userId=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setFilteredOrders(data);
          } else {
            setFilteredOrders([]);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch delivered orders', err);
          setFilteredOrders([]);
        })
        .finally(() => setLoadingDelivered(false));
      return;
    }
    let sourceList = orders || [];

    const filtered = sourceList.filter((order) => {
      const status = order.status?.toLowerCase() || '';
      if (statusParam === 'pending') {
        return ['pending', 'processing', 'confirmed', 'paid'].includes(status);
      }
      if (statusParam === 'in-transit') {
        return ['shipped', 'intransit', 'in-transit', 'on-the-way'].includes(status);
      }
      if (statusParam === 'delivered') {
        return status === 'delivered';
      }
      return false;
    });

    filtered.sort((a, b) => {
      const dateA = a.createdAt?.seconds || new Date(a.createdAt).getTime();
      const dateB = b.createdAt?.seconds || new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    setFilteredOrders(filtered);
  }, [statusParam, orders]);

  const toggleAccordion = (orderId) => {
    setOpenItems((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const EmptyState = ({ type }) => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="body1" color="text.secondary">
        {type === 'pending'
          ? t('noPendingOrders')
          : type === 'in-transit'
          ? t('noPendingOrders')
          : t('noDeliveredOrders')}
      </Typography>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        {t('myOrders')}
      </Typography>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={t('tabs.pending')} />
        <Tab label={t('tabs.inTransit')} />
        {user && <Tab label={t('tabs.delivered')} />}
      </Tabs>

      {(statusParam === 'delivered' && loadingDelivered) || (!orders && statusParam !== 'delivered') ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredOrders.length === 0 ? (
        <EmptyState type={statusParam} />
      ) : (
        <Stack spacing={2}>
          {filteredOrders.map((order) => {
            const isExpanded = openItems[order.id];
            const financials = order.financials || {};

            // Extract financial values with defaults
            const totalSaved = financials.totalSaved || 0;
            const savedFromOriginalPrice = financials.savedFromOriginalPrice || 0;
            const discount = financials.extraDiscount || 0;
            const firstShopDiscount = financials.firstShopDiscount || 0;
            const shippingSavings = financials.shippingSavings || 0;
            const appliedBonus = financials.bonusApplied || 0; // Use bonusApplied key from object
            const applyBonus = appliedBonus > 0; // Helper boolean
            const total = financials.total || order.totalAmount || 0;
            const subtotal = financials.subtotal || order.subtotal || 0;
            const shippingCost =
              financials.shippingCost !== undefined ? financials.shippingCost : order.shippingCost || 0;

            return (
              <Paper
                key={order.id}
                variant="outlined"
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#FAFAFA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleAccordion(order.id)}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {t('order')} {order.id.toString().slice(0, 8).toUpperCase()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('dates.created')} {formatDate(order.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={t(`status.${order.status}`) || order.status}
                      color={
                        order.status === 'delivered'
                          ? 'success'
                          : order.status === 'cancelled'
                          ? 'error'
                          : order.status === 'pending'
                          ? 'error'
                          : 'primary'
                      }
                      size="small"
                      sx={{ mr: 1, textTransform: 'capitalize' }}
                    />
                    <IconButton size="small">
                      <ExpandMoreIcon
                        sx={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </IconButton>
                  </Box>
                </Box>

                {/* Content */}
                <Collapse in={isExpanded}>
                  <Divider />
                  <Box sx={{ p: 2 }}>
                    {/* Dates - Vertical Stack for Mobile/Desktop as requested */}
                    <Box sx={{ mb: 3 }}>
                      <Stack spacing={0.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ width: 100 }}>
                            {t('dates.created')}
                          </Typography>
                          <Typography variant="body2">{formatDate(order.createdAt)}</Typography>
                        </Box>
                        {(order.inTransitAt || order.dateInTransit || statusParam === 'in-transit') && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ width: 100 }}>
                              {t('dates.inTransit')}
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(order.inTransitAt || order.dateInTransit)}
                            </Typography>
                          </Box>
                        )}
                        {(order.deliveredAt || statusParam === 'delivered') && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ width: 100 }}>
                              {t('dates.delivered')}
                            </Typography>
                            <Typography variant="body2">{formatDate(order.deliveredAt)}</Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Split Layout: Items Left, Financials Right */}
                    <Grid container spacing={4}>
                      {/* Items Section */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                          {t('items')}
                        </Typography>
                        {order.items?.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              '&:last-child': { mb: 0 },
                            }}
                          >
                            <Link
                              href={`/item/${item.id}${
                                item.selectedOption ? `?option=${item.selectedOption}` : ''
                              }`}
                              style={{ textDecoration: 'none' }}
                            >
                              <Box
                                sx={{
                                  position: 'relative',
                                  width: 60,
                                  height: 60,
                                  flexShrink: 0,
                                  mr: 2,
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  border: '1px solid #eee',
                                }}
                              >
                                <OrderImage
                                  src={item.img || item.image || item.imageUrl || '/placeholder.png'}
                                  alt={item.name}
                                />
                              </Box>
                            </Link>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" fontWeight="500">
                                {item.name}
                              </Typography>
                              {item.selectedOption && (
                                <Typography
                                  variant="caption"
                                  sx={{ color: '#666', display: 'block', mt: 0.5, mb: '4px' }}
                                >
                                  {tProduct(`optionKeys.${item.selectedOptionKey}`)} : {item.selectedOption}
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary" display="block">
                                {item.quantity} * {item.price?.toLocaleString()} ֏
                              </Typography>
                              <Link href="#" style={{ textDecoration: 'none' }}>
                                <Typography
                                  variant="caption"
                                  color="primary"
                                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                >
                                  {t('leaveReview')}
                                </Typography>
                              </Link>
                            </Box>
                            {/* Removed individual item price as requested */}
                          </Box>
                        ))}
                      </Grid>

                      {/* Financials Section */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ borderTop: { xs: 'solid 1px #c5c7cc8a', md: 'none' }, pt: '10px' }}>
                          <Typography
                            sx={{
                              color: '#263045fb',
                              fontSize: '18px',
                              fontWeight: 500,
                              mb: '20px',
                            }}
                          >
                            {t('financials.summary')}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '15px' }}>
                            <Typography
                              sx={{
                                color: '#263045fb',
                                fontSize: '15px',
                                fontWeight: 300,
                              }}
                            >
                              {t('financials.subtotal')}
                            </Typography>
                            <Typography
                              sx={{
                                color: '#263045fb',
                                fontSize: '15px',
                                fontWeight: 500,
                              }}
                            >
                              ֏{subtotal.toLocaleString()}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '15px' }}>
                            <Typography
                              sx={{
                                color: '#263045fb',
                                fontSize: '15px',
                                fontWeight: 300,
                              }}
                            >
                              {t('financials.shipping')}
                            </Typography>
                            <Typography
                              sx={{
                                color: '#263045fb',
                                fontSize: '15px',
                                fontWeight: 500,
                              }}
                            >
                              {shippingCost === 0
                                ? t('financials.freeShippingLabel')
                                : `֏${shippingCost.toLocaleString()}`}
                            </Typography>
                          </Box>

                          {/* Orange Savings Box */}
                          {totalSaved > 0 && (
                            <Box
                              sx={{
                                mb: '15px',
                                p: '12px',
                                bgcolor: '#fff7ed',
                                borderRadius: '8px',
                                border: '1px dashed #e65100',
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '5px' }}>
                                <Typography sx={{ color: '#e65100', fontSize: '15px', fontWeight: 600 }}>
                                  {t('financials.totalSavings')}
                                </Typography>
                                <Typography sx={{ color: '#e65100', fontSize: '15px', fontWeight: 700 }}>
                                  ֏{totalSaved.toLocaleString()}
                                </Typography>
                              </Box>
                              {savedFromOriginalPrice > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                                    • {t('financials.productMarkdowns')}
                                  </Typography>
                                  <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                                    ֏{savedFromOriginalPrice.toLocaleString()}
                                  </Typography>
                                </Box>
                              )}
                              {discount > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                                    • {t('financials.extraDiscountLabel')}
                                  </Typography>
                                  <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                                    ֏{discount.toLocaleString()}
                                  </Typography>
                                </Box>
                              )}
                              {firstShopDiscount > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                                    • {t('financials.firstShopDiscountLabel')}
                                  </Typography>
                                  <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                                    ֏{firstShopDiscount.toLocaleString()}
                                  </Typography>
                                </Box>
                              )}
                              {shippingSavings > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                                    • {t('financials.freeShippingLabel')}
                                  </Typography>
                                  <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                                    ֏{shippingSavings.toLocaleString()}
                                  </Typography>
                                </Box>
                              )}
                              {applyBonus && appliedBonus > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                                    • {t('financials.bonusApplied')}
                                  </Typography>
                                  <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                                    ֏{appliedBonus.toLocaleString()}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          )}

                          {/* Final Total */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              pt: 2,
                              borderTop: '1px solid #c5c7cc8a',
                            }}
                          >
                            <Typography
                              sx={{
                                color: '#263045fb',
                                fontSize: '15px',
                                fontWeight: 500,
                              }}
                            >
                              {t('totalPaid')}
                            </Typography>
                            <Typography
                              sx={{
                                color: '#263045fb',
                                fontSize: '15px',
                                fontWeight: 500,
                              }}
                            >
                              ֏{total.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Collapse>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
