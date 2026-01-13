'use client';

import { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
  Menu,
  MenuItem,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from 'next/link';
import Image from 'next/image';
import { CustomPagination } from '@/_components/products/PageUi';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { doc, updateDoc, serverTimestamp, increment, runTransaction } from 'firebase/firestore';
import { db } from '@/firebase';

export default function AdminOrdersPageUI({
  data = { items: [] },
  counts = { total: 0, pending: 0, delivered: 0, failed: 0, inTransit: 0 },
  initialLoading,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState();
  const [status, setStatus] = useState(searchParams?.get('status') || '');
  const [expandedIds, setExpandedIds] = useState([]);
  const [isReplacing, setIsReplacing] = useState(false);

  const isSelected = (s) => status === s;

  useEffect(() => {
    setIsReplacing(false);
    setPage(+searchParams.get('page') || 1);
    if (searchParams.get('status')) {
      setStatus(searchParams?.get('status'));
    }
    // Reset scroll to top on navigation
    window.scrollTo(0, 0);
  }, [searchParams]);

  const PAGE_SIZE = 20;
  const totalPages = Math.ceil((counts?.[status] || 0) / PAGE_SIZE);

  const handlePageChange = (e, value) => {
    if (value === +page || (value === 1 && !page)) return;
    // setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (value === 1) {
      params.delete('page');
      params.delete('startId');
      params.delete('lastId');
      params.delete('nav');
    } else if (value === totalPages) {
      params.set('page', value);
      params.set('startId', data.newStartId);
      params.set('lastId', data.newLastId);
      params.set('nav', 'last');
    } else {
      params.set('page', value);
      params.set('startId', data.newStartId);
      params.set('lastId', data.newLastId);
      if (value > page || !page) {
        params.set('nav', 'next');
      } else {
        params.set('nav', 'prev');
      }
    }
    setIsReplacing(true);
    setPage(value);
    router.push(`?${params.toString()}`);
  };

  const handleStatusChange = (status) => {
    setStatus(status);
    setIsReplacing(status);
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

  // Robust date formatter that supports numbers, ISO strings, Firestore Timestamps and objects with `seconds` or `_seconds`.
  const formatDate = (value) => {
    if (value === null || value === undefined) return '—';

    try {
      // numbers (milliseconds)
      if (typeof value === 'number') {
        const d = new Date(value);
        return isNaN(d.getTime()) ? '—' : d.toLocaleString();
      }

      // numeric string
      if (typeof value === 'string') {
        const num = Number(value);
        if (!Number.isNaN(num)) {
          const d = new Date(num);
          return isNaN(d.getTime()) ? '—' : d.toLocaleString();
        }
        // ISO or parseable date string
        const d = new Date(value);
        return isNaN(d.getTime()) ? '—' : d.toLocaleString();
      }

      // Firestore Timestamp-like with toMillis()
      if (value?.toMillis && typeof value.toMillis === 'function') {
        const d = new Date(value.toMillis());
        return isNaN(d.getTime()) ? '—' : d.toLocaleString();
      }

      // Firestore Timestamp-like with toDate()
      if (value?.toDate && typeof value.toDate === 'function') {
        const d = value.toDate();
        return isNaN(d.getTime()) ? '—' : d.toLocaleString();
      }

      // Plain object with seconds/_seconds and optional nanoseconds
      const seconds = value?.seconds ?? value?._seconds;
      const nanoseconds = value?.nanoseconds ?? value?._nanoseconds ?? value?.nanos ?? 0;
      if (seconds !== undefined && seconds !== null) {
        const ms = Number(seconds) * 1000 + Math.floor((Number(nanoseconds) || 0) / 1e6);
        const d = new Date(ms);
        return isNaN(d.getTime()) ? '—' : d.toLocaleString();
      }
    } catch (err) {
      // ignore and fall through
    }

    return '—';
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Local UI state derived from props so we can update UI optimistically

  // Status edit menu state
  const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState(null);
  const [statusMenuOrderId, setStatusMenuOrderId] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const STATUS_OPTIONS = ['pending', 'inTransit', 'delivered', 'failed'];

  const openStatusMenu = (e, orderId) => {
    e.stopPropagation();
    setStatusMenuAnchorEl(e.currentTarget);
    setStatusMenuOrderId(orderId);
  };

  const closeStatusMenu = () => {
    setStatusMenuAnchorEl(null);
    setStatusMenuOrderId(null);
  };

  // Default implementation: update Firestore and update local UI
  const defaultUpdateOrderStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    // Minimal update payload: set status, updatedAt and a dynamic timestamp like `${status}At`
    const updatePayload = {
      status: newStatus,
      updatedAt: serverTimestamp(),
      [`${newStatus}At`]: serverTimestamp(),
    };

    try {
      await updateDoc(orderRef, updatePayload);
    } catch (err) {
      console.error('Failed to update order in Firestore', err);
      throw err; // rethrow so caller can handle (shows spinner off / snackbar)
    }

    // Request a refresh of the listing (go to page 1) so parent re-fetches data and counts
    // handlePageChange?.(null, 1);

    // Also refresh the route to ensure server data and counts are revalidated
    try {
      if (typeof router?.refresh === 'function') {
        router.refresh();
      } else if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (err) {
      // As a last resort, reload the page
      if (typeof window !== 'undefined') window.location.reload();
    }
  };

  const handleSelectStatus = async (newStatus) => {
    if (!statusMenuOrderId) {
      closeStatusMenu();
      return;
    }
    const orderId = statusMenuOrderId;
    closeStatusMenu();
    try {
      setStatusUpdatingId(orderId);

      await Promise.resolve(defaultUpdateOrderStatus(orderId, newStatus));

      // Update user totalSpent if status changed to 'delivered'
      if (newStatus === 'delivered') {
        const currentOrder = data.items?.find((o) => o.id === orderId);
        const userId = currentOrder?.userId;
        const orderTotal = currentOrder?.financials?.total;

        if (userId && orderTotal > 0) {
          try {
            await runTransaction(db, async (transaction) => {
              const userRef = doc(db, 'users', userId);
              transaction.update(userRef, { totalSpent: increment(orderTotal) });
            });
          } catch (err) {
            console.error('Failed to update user totalSpent', err);
          }
        }
      }
    } catch (err) {
      console.error('Failed to update order status', err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const stats = [
    { key: 'total', label: 'Total', icon: ShoppingCartIcon, color: 'secondary' },
    { key: 'pending', label: 'Pending', icon: PendingIcon, color: 'warning' },
    { key: 'inTransit', label: 'In Transit', icon: LocalShippingIcon, color: 'info' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircleIcon, color: 'success' },
    { key: 'failed', label: 'Failed', icon: ErrorIcon, color: 'error' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, overflowX: 'auto' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Orders Overview</Typography>
      </Stack>

      <>
        <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 2 }}>
          {stats.map((s) => {
            const Icon = s.icon;
            const count = counts[s.key] ?? 0;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.key}>
                <Link
                  href={`/admin/orders?status=${s.key}`}
                  onClick={() => handleStatusChange(s.key)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Paper
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      p: { xs: 1, sm: 1.5 },
                      boxShadow: isSelected(s.key) ? '0 6px 14px rgba(2,6,23,0.05)' : 'none',
                      border: '1px solid',
                      borderColor: isSelected(s.key) ? `${s.color}.light` : 'transparent',
                      bgcolor: isSelected(s.key) ? `${s.color}.lighter` : 'background.paper',
                      transition: 'box-shadow 160ms ease, transform 160ms ease, background 160ms ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: isSelected(s.key)
                          ? '0 7px 18px rgba(2,6,23,0.06)'
                          : '0 3px 8px rgba(2,6,23,0.03)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `${s.color}.light`,
                        width: { xs: 36, sm: 44 },
                        height: { xs: 36, sm: 44 },
                      }}
                    >
                      {isReplacing === s.key || initialLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Icon sx={{ color: 'white', fontSize: { xs: 18, sm: 20 } }} />
                      )}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.72rem', sm: '0.82rem' } }}
                      >
                        {s.label}
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: { xs: '0.96rem', sm: '1rem' } }}>
                        {count}
                      </Typography>
                    </Box>
                  </Paper>
                </Link>
              </Grid>
            );
          })}
        </Grid>

        <Paper sx={{ p: 2, mt: '20px', minWidth: 760, boxSizing: 'border-box' }}>
          {isReplacing && (
            <div
              style={{
                position: 'absolute', // 👈 key difference — relative to the parent
                inset: 0,
                backdropFilter: 'blur(0.5px)',
                background: 'rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px', // optional, matches parent if rounded
                zIndex: 100,
              }}
            >
              <style jsx>{`
                @keyframes spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </div>
          )}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
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
              ) : data.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                data.items.map((order) => {
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
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={order.status ?? '—'}
                                size="small"
                                variant="outlined"
                                onClick={(e) => openStatusMenu(e, order.id)}
                                sx={{
                                  cursor: 'pointer',
                                  textTransform: 'capitalize',
                                  color:
                                    order.status === 'pending'
                                      ? 'warning.main'
                                      : order.status === 'delivered'
                                      ? 'success.main'
                                      : order.status === 'failed'
                                      ? 'error.main'
                                      : order.status === 'inTransit'
                                      ? 'info.main'
                                      : 'text.primary',
                                  borderColor:
                                    order.status === 'pending'
                                      ? 'warning.main'
                                      : order.status === 'delivered'
                                      ? 'success.main'
                                      : order.status === 'failed'
                                      ? 'error.main'
                                      : order.status === 'inTransit'
                                      ? 'info.main'
                                      : 'divider',
                                  background: 'transparent',
                                }}
                              />
                              {statusUpdatingId === order.id && <CircularProgress size={14} sx={{ ml: 1 }} />}
                            </Box>

                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {formatDate(order?.[`${order.status}At`] || order?.updatedAt)}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>{formatDate(order.createdAt)}</TableCell>

                        <TableCell align="right">
                          <Tooltip title="View order">
                            <IconButton size="small" onClick={() => router.push(`/admin/order/${order.id}`)}>
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
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 2,
                                  flexDirection: { xs: 'column', sm: 'row' },
                                  alignItems: 'flex-start',
                                  px: 1,
                                }}
                              >
                                {/* LEFT: Items list (50%) */}
                                <Box
                                  sx={{
                                    width: { xs: '100%', sm: '50%' },
                                  }}
                                >
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
                                          sx={{
                                            display: 'flex',
                                            gap: 0.7,
                                            alignItems: 'center',
                                            width: '100%',
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

                                {/* RIGHT: Financial summary (50%) */}
                                <Box
                                  sx={{
                                    width: { xs: '100%', sm: '50%' },
                                    display: 'flex',
                                    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                                    px: { xs: 1, sm: 2 },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: { xs: '100%', sm: 320 },
                                      p: 2,
                                      borderLeft: { xs: 'none', sm: '1px solid' },
                                      borderColor: 'divider',
                                      bgcolor: 'background.paper',
                                      position: { xs: 'static', sm: 'sticky' },
                                      top: { sm: 12 },
                                      alignSelf: 'flex-start',
                                    }}
                                  >
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                      Summary
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        Subtotal
                                      </Typography>
                                      <Typography variant="body2">
                                        {formatAMD(
                                          order.financials?.subtotal ??
                                            order.financials?.subTotal ??
                                            order.financials?.itemsTotal ??
                                            0
                                        )}
                                      </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        Shipping
                                      </Typography>
                                      <Typography variant="body2">
                                        {formatAMD(order.financials?.shippingCost ?? 0)}
                                      </Typography>
                                    </Box>

                                    {/* Show simple Savings line only when there is no detailed savings breakdown */}
                                    {!(
                                      order.financials?.totalSaved > 0 ||
                                      order.financials?.savedFromOriginalPrice > 0 ||
                                      order.financials?.extraDiscount > 0 ||
                                      order.financials?.firstShopDiscount > 0 ||
                                      order.financials?.shippingSavings > 0
                                    ) && (
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">
                                          Savings
                                        </Typography>
                                        <Typography variant="body2">
                                          {formatAMD(
                                            order.financials?.savings ?? order.financials?.discount ?? 0
                                          )}
                                        </Typography>
                                      </Box>
                                    )}

                                    {/* Savings details */}
                                    {(order.financials?.totalSaved > 0 ||
                                      order.financials?.savedFromOriginalPrice > 0 ||
                                      order.financials?.extraDiscount > 0 ||
                                      order.financials?.firstShopDiscount > 0 ||
                                      order.financials?.shippingSavings > 0 ||
                                      order.financials?.bonusApplied > 0) && (
                                      <Box
                                        sx={{
                                          mt: 1,
                                          p: 1,
                                          bgcolor: 'rgba(255,243,224,0.6)',
                                          borderRadius: 1,
                                          border: '1px dashed',
                                          borderColor: 'divider',
                                        }}
                                      >
                                        <Box
                                          sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
                                        >
                                          <Typography
                                            sx={{
                                              color: 'text.secondary',
                                              fontSize: '0.86rem',
                                              fontWeight: 600,
                                            }}
                                          >
                                            Total Savings
                                          </Typography>
                                          <Typography
                                            sx={{
                                              color: 'text.secondary',
                                              fontSize: '0.86rem',
                                              fontWeight: 700,
                                            }}
                                          >
                                            {formatAMD(
                                              order.financials?.totalSaved ??
                                                order.financials?.savings ??
                                                order.financials?.discount ??
                                                0
                                            )}
                                          </Typography>
                                        </Box>

                                        {order.financials?.savedFromOriginalPrice > 0 && (
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography
                                              sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.82rem',
                                                fontWeight: 300,
                                              }}
                                            >
                                              • Product markdowns
                                            </Typography>
                                            <Typography
                                              sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.82rem',
                                                fontWeight: 500,
                                              }}
                                            >
                                              {formatAMD(order.financials.savedFromOriginalPrice)}
                                            </Typography>
                                          </Box>
                                        )}

                                        {order.financials?.extraDiscount > 0 && (
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography
                                              sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.82rem',
                                                fontWeight: 300,
                                              }}
                                            >
                                              • Extra discount
                                            </Typography>
                                            <Typography
                                              sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.82rem',
                                                fontWeight: 500,
                                              }}
                                            >
                                              {formatAMD(order.financials.extraDiscount)}
                                            </Typography>
                                          </Box>
                                        )}

                                        {order.financials?.firstShopDiscount > 0 && (
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography
                                              sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.82rem',
                                                fontWeight: 300,
                                              }}
                                            >
                                              • First shop discount
                                            </Typography>
                                            <Typography
                                              sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.82rem',
                                                fontWeight: 500,
                                              }}
                                            >
                                              {formatAMD(order.financials.firstShopDiscount)}
                                            </Typography>
                                          </Box>
                                        )}

                                        {order.financials?.shippingSavings > 0 && (
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography
                                              sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.82rem',
                                                fontWeight: 300,
                                              }}
                                            >
                                              • Free shipping
                                            </Typography>
                                            <Typography
                                              sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.82rem',
                                                fontWeight: 500,
                                              }}
                                            >
                                              {formatAMD(order.financials.shippingSavings)}
                                            </Typography>
                                          </Box>
                                        )}

                                        {order.financials?.bonusApplied > 0 && (
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography
                                              sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.82rem',
                                                fontWeight: 300,
                                              }}
                                            >
                                              • Bonus applied
                                            </Typography>
                                            <Typography
                                              sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.82rem',
                                                fontWeight: 500,
                                              }}
                                            >
                                              {formatAMD(order.financials.bonusApplied)}
                                            </Typography>
                                          </Box>
                                        )}
                                      </Box>
                                    )}

                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 1,
                                        pt: 1,
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                      }}
                                    >
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Total
                                      </Typography>
                                      <Typography variant="h6">
                                        {formatAMD(order.financials?.total ?? order.financials?.amount ?? 0)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
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

          <Menu
            anchorEl={statusMenuAnchorEl}
            open={Boolean(statusMenuAnchorEl)}
            onClose={closeStatusMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            {STATUS_OPTIONS.map((s) => {
              const label = s === 'inTransit' ? 'In Transit' : s.charAt(0).toUpperCase() + s.slice(1);
              const currentOrder = data.items?.find((o) => o.id === statusMenuOrderId);
              const isCurrent = currentOrder?.status === s;
              return (
                <MenuItem key={s} selected={isCurrent} onClick={() => handleSelectStatus(s)}>
                  <Typography sx={{ textTransform: 'capitalize' }}>{label}</Typography>
                </MenuItem>
              );
            })}
          </Menu>
        </Paper>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, gap: 2 }}>
          {totalPages > 1 ? (
            <CustomPagination
              curentPage={page || 1}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
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
