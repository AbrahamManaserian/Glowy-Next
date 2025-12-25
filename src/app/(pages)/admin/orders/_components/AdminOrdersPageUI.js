'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Collapse,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Stack,
  Chip,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Skeleton,
  Button,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from 'next/link';
import Image from 'next/image';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function AdminOrdersPageUI({
  initialOrders,
  counts = { total: 0, pending: 0, delivered: 0, failed: 0 },
  initialLoading,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams?.get('status') || 'pending';

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [nextCursor, setNextCursor] = useState(initialOrders?.nextCursor || null);
  const [fetchingMore, setFetchingMore] = useState(false);

  // useEffect(() => {
  //   const fetchCounts = async () => {
  //     try {
  //       const response = await fetch('/api/admin/orders/counts');
  //       if (!response.ok) throw new Error('Failed to fetch counts');
  //       const data = await response.json();
  //       setCounts(data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCounts();
  // }, []);
  // console.log(initialOrders);
  // Fetch orders when status (filter) changes

  const loadMore = async () => {
    // if (!nextCursor) return;

    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('after', String(initialOrders.nextCursor));
    router.push(`?${params.toString()}`);
    // console.log('Load more clicked');
  };

  // Format amount in Armenian Dram (AMD) without trailing .00 when integer
  const formatAMD = (value) => {
    if (typeof value !== 'number') return '—';
    const hasFraction = Math.abs(value % 1) > 0;
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency: 'AMD',
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: hasFraction ? 2 : 0,
    }).format(value);
  };

  // Expanded rows state
  const [expandedIds, setExpandedIds] = useState([]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  if (error) {
    return null;
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography color="error">Error: {error}</Typography>
    </Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minWidth: { xs: 680 }, overflowX: 'auto' }}>
      {loading && (
        <CircularProgress sx={{ position: 'absolute', top: '10px', display: 'flex', left: '50%' }} />
      )}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Orders Overview</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Last updated
          </Typography>
          <Tooltip title="Refresh counts">
            <IconButton
              size="small"
              onClick={async () => {
                // setLoading(true);
                // try {
                //   const res = await fetch('/api/admin/orders/counts');
                //   const data = await res.json();
                //   setCounts(data);
                // } catch (e) {
                //   setError(e.message);
                // } finally {
                //   setLoading(false);
                // }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <>
        <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 1.25, sm: 2 }, boxShadow: 1 }}
            >
              <Avatar
                sx={{ bgcolor: 'primary.light', width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}
              >
                <ShoppingCartIcon sx={{ color: 'primary.main', fontSize: { xs: 20, sm: 24 } }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="h6">{counts.total}</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 1.25, sm: 2 }, boxShadow: 1 }}
            >
              <Avatar
                sx={{ bgcolor: 'warning.light', width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}
              >
                <PendingIcon sx={{ color: 'warning.main', fontSize: { xs: 20, sm: 24 } }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
                <Typography variant="h6">{counts.pending}</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 1.25, sm: 2 }, boxShadow: 1 }}
            >
              <Avatar
                sx={{ bgcolor: 'success.light', width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}
              >
                <CheckCircleIcon sx={{ color: 'success.main', fontSize: { xs: 20, sm: 24 } }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Delivered
                </Typography>
                <Typography variant="h6">{counts.delivered}</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 1.25, sm: 2 }, boxShadow: 1 }}
            >
              <Avatar sx={{ bgcolor: 'error.light', width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}>
                <ErrorIcon sx={{ color: 'error.main', fontSize: { xs: 20, sm: 24 } }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Failed
                </Typography>
                <Typography variant="h6">{counts.failed}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ overflowX: 'auto', py: 1, mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ minWidth: 'max-content', px: 0.5 }}>
            <Chip
              avatar={
                <Avatar
                  sx={{
                    bgcolor: 'transparent',
                    color: currentStatus === 'all' ? 'primary.main' : 'text.secondary',
                    width: 24,
                    height: 24,
                    fontSize: 12,
                  }}
                >
                  {counts.total}
                </Avatar>
              }
              label="All"
              color={currentStatus === 'all' ? 'primary' : 'default'}
              onClick={() => router.push('/admin/orders?status=all')}
            />
            <Chip
              avatar={
                <Avatar
                  sx={{
                    bgcolor: 'transparent',
                    color: currentStatus === 'pending' ? 'warning.main' : 'text.secondary',
                    width: 24,
                    height: 24,
                    fontSize: 12,
                  }}
                >
                  {counts.pending}
                </Avatar>
              }
              label="Pending"
              color={currentStatus === 'pending' ? 'warning' : 'default'}
              onClick={() => router.push('/admin/orders?status=pending')}
            />
            <Chip
              avatar={
                <Avatar
                  sx={{
                    bgcolor: 'transparent',
                    color: currentStatus === 'delivered' ? 'success.main' : 'text.secondary',
                    width: 24,
                    height: 24,
                    fontSize: 12,
                  }}
                >
                  {counts.delivered}
                </Avatar>
              }
              label="Delivered"
              color={currentStatus === 'delivered' ? 'success' : 'default'}
              onClick={() => router.push('/admin/orders?status=delivered')}
            />
            <Chip
              avatar={
                <Avatar
                  sx={{
                    bgcolor: 'transparent',
                    color: currentStatus === 'failed' ? 'error.main' : 'text.secondary',
                    width: 24,
                    height: 24,
                    fontSize: 12,
                  }}
                >
                  {counts.failed}
                </Avatar>
              }
              label="Failed"
              color={currentStatus === 'failed' ? 'error' : 'default'}
              onClick={() => router.push('/admin/orders?status=failed')}
            />
          </Stack>
        </Box>

        <Paper sx={{ p: 2, overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {initialLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton variant="text" width={120} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={160} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={40} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={120} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="circular" width={28} height={28} />
                    </TableCell>
                  </TableRow>
                ))
              ) : initialOrders?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                initialOrders?.items.map((order) => {
                  const isExpanded = expandedIds.includes(order.id);
                  return (
                    <Fragment key={order.id}>
                      <TableRow key={order.id} hover>
                        <TableCell sx={{ maxWidth: 220, wordBreak: 'break-all' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {order.id?.slice?.(0, 8) || order.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.id}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">{order.customer?.fullName || '—'}</Typography>
                          {order.customer?.phoneNumber && (
                            <Typography variant="caption" color="text.secondary">
                              {order.customer.phoneNumber}
                            </Typography>
                          )}
                          {order.customer?.address && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {typeof order.customer.address === 'string'
                                ? order.customer.address
                                : order.customer.address?.line1 || order.customer.address?.street || ''}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {order.items
                                ? order.items.reduce(
                                    (sum, it) => sum + (it.quantity ?? it.qty ?? it.count ?? 1),
                                    0
                                  )
                                : '—'}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => toggleExpand(order.id)}
                              aria-expanded={isExpanded}
                              aria-label="show items"
                            >
                              {isExpanded ? (
                                <ExpandLessIcon fontSize="small" />
                              ) : (
                                <ExpandMoreIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Box>
                        </TableCell>

                        <TableCell>{formatAMD(order.financials?.total)}</TableCell>

                        <TableCell>
                          <Chip
                            label={order.status ?? '—'}
                            size="small"
                            color={
                              order.status === 'pending'
                                ? 'warning'
                                : order.status === 'delivered'
                                ? 'success'
                                : order.status === 'failed'
                                ? 'error'
                                : 'default'
                            }
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>

                        <TableCell>
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
                        </TableCell>

                        <TableCell align="right">
                          <Tooltip title="View order">
                            <IconButton size="small" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>

                      <TableRow key={`${order.id}-expanded`}>
                        <TableCell
                          colSpan={7}
                          sx={{
                            p: 0,
                            bgcolor: 'rgba(255,243,224,0.35)',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ py: 1 }}>
                              {(order.items || []).map((item, idx) => (
                                <Box
                                  key={`${order.id}-item-${idx}`}
                                  sx={{
                                    display: 'flex',
                                    gap: 0.7,
                                    py: 0.75,
                                    px: 2,
                                    alignItems: 'center',
                                    borderColor: 'divider',
                                  }}
                                >
                                  <Link
                                    href={`/item/${item.id}`}
                                    passHref
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                  >
                                    <Box
                                      sx={{ display: 'flex', gap: 0.7, alignItems: 'center', width: '100%' }}
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
                                          alt={item.name || item.title || item.sku || 'Item'}
                                          fill
                                          style={{ objectFit: 'cover' }}
                                        />
                                      </Box>
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          fontWeight={500}
                                          sx={{
                                            fontSize: { xs: '0.72rem', sm: '0.85rem' },
                                            lineHeight: 1.18,
                                          }}
                                        >
                                          {item.name || item.title || item.sku || 'Item'}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          sx={{ fontSize: '0.72rem' }}
                                        >
                                          Qty: {item.quantity ?? item.qty ?? item.count ?? 1} x{' '}
                                          {typeof item.price === 'number' ? formatAMD(item.price) : '—'}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Link>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Paper>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, gap: 2 }}>
          {initialOrders?.nextCursor ? (
            <Button variant="outlined" size="small" onClick={loadMore} disabled={fetchingMore}>
              {fetchingMore ? <CircularProgress size={18} /> : 'Load more'}
            </Button>
          ) : (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              End of results
            </Typography>
          )}
        </Box>
      </>
    </Box>
  );
}
