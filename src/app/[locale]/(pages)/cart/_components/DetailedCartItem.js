'use client';

import {
  Box,
  Checkbox,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { decreaseQuantity, deleteItem, increaseQuantity } from '../functions/addDeleteIncDecreaseCart';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function DetailedCartItem({
  item,
  id,
  productDetails,
  cart,
  setCart,
  firstShopRate = 0,
  extraRate = 0,
  isSelected,
  toggleSelection,
  option,
  user,
}) {
  const t = useTranslations('CartPage');
  const tProduct = useTranslations('ProductPage');
  // Use fresh data from server if available, otherwise fallback to local cart data
  const data = productDetails || item;

  // Calculate isFirstShopDiscountActive here based on passed user prop (must come from parent)
  const isFirstShopDiscountActive = user && firstShopRate > 0 && user.emailVerified;
  // If firstShopRate passed in is already conditional on emailVerified, we can just use passed rate?
  // User asked to hide the discount display if unverified. Parent (CartPageUi) calculates global discount.
  // But DetailedCartItem receives `firstShopRate`.
  // Let's rely on receiving `user` and recalculating or just accepting specific per-item rate
  // if parent passed it correctly.

  // Actually, parent calculates `firstShopDiscount` (total) but passes `firstShopRate` (0.2).
  // If parent logic says rate is 0.2, then it is 0.2.
  // BUT the issue is DetailedCartItem calculates `savedFromFirstShop` using `firstShopRate` prop.
  // We need to make sure `savedFromFirstShop` is 0 if email not verified.

  const effectiveFirstShopRate = user && user.emailVerified ? firstShopRate : 0;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    note: '',
  });

  const name = data.fullName ?? data.name ?? data.title ?? 'Product';
  const img =
    data.smallImage?.file ?? data.images?.[0]?.file ?? data.img ?? data.image ?? '/images/placeholder.png';
  const price = item.price ?? 0;
  const previousPrice = data.previousPrice ?? 0;
  const quantity = item.quantity ?? 1;

  const savedFromOriginal = (previousPrice > price ? previousPrice - price : 0) * quantity;
  const savedFromFirstShop = price * effectiveFirstShopRate * quantity;
  const savedFromExtra = price * extraRate * quantity;

  let isInStock = true;
  if (data) {
    if (option && data.availableOptions && data.optionKey) {
      const found = data.availableOptions.find((o) => o[data.optionKey] === option);
      if (found && found.inStock === false) isInStock = false;
    } else if (data.inStock === false) {
      isInStock = false;
    }
  }

  const handleNotifySubmit = async () => {
    setNotifyLoading(true);
    try {
      await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'availability_check',
          customerName: contactInfo.name,
          phoneNumber: contactInfo.phone,
          email: contactInfo.email,
          note: contactInfo.note,
          productName: data.name || data.title,
          productId: id,
          option: option || null,
        }),
      });
      setRequestSent(true);
      setTimeout(() => {
        setDialogOpen(false);
        setRequestSent(false);
        setContactInfo({ name: '', email: '', phone: '', note: '' });
      }, 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setNotifyLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        borderBottom: '1px dashed #dde2e5ff',
        overflow: 'hidden',
        boxSizing: 'border-box',
        maxWidth: '700px',
        py: '20px',
        position: 'relative',
      }}
    >
      <Checkbox
        checked={isSelected}
        disabled={!isInStock}
        onChange={toggleSelection}
        sx={{
          color: '#c5c7cc',
          '&.Mui-checked': {
            color: '#e65100',
          },
          position: 'absolute',
          top: '10px',
          right: '0px',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mr: '15px',
        }}
      >
        <Link
          href={`/item/${data.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            boxSizing: 'border-box',
            backgroundColor: '#d2cccc30',
            borderRadius: '10px',
            maxWidth: '100px',
            height: '100px',
            overflow: 'hidden',
            WebkitTapHighlightColor: 'rgba(43, 137, 219, 0.04)',
          }}
        >
          <img
            src={img}
            alt=""
            style={{
              width: '100%',
              height: 'auto',
              filter: !isInStock ? 'blur(0.5px)' : 'none',
              opacity: !isInStock ? 0.6 : 1,
            }}
          />
        </Link>
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            mt: '10px',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              border: 'solid 0.5px #65626263',
              borderRadius: '10px',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <IconButton
              size="small"
              onClick={() => decreaseQuantity(id, cart, setCart, option)}
              aria-label="delete"
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ bgcolor: '#6562620f', p: '4px 10px', fontSize: '13px' }}>
              {item.quantity}
            </Typography>
            <IconButton
              size="small"
              onClick={() => increaseQuantity(id, cart, setCart, option)}
              aria-label="add"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
          <IconButton onClick={() => deleteItem(id, cart, setCart, option)} aria-label="delete" size="small">
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          boxSizing: 'border-box',
          justifyContent: 'space-between',
          overflow: 'hidden',
          minHeight: { sm: '100px' },
        }}
      >
        <Box sx={{ pr: '40px' }}>
          <Typography
            sx={{
              fontSize: '14px',
              overflow: 'hidden',
              color: '#191818f6',
              fontWeight: 500,
            }}
          >
            {name}
          </Typography>
          {option && data?.optionKey && (
            <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5, mb: '4px' }}>
              {tProduct(`optionKeys.${data?.optionKey}`)} : {option}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography
              sx={{
                // fontSize: '15px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                mt: '2px',
                mb: '8px',
              }}
            >
              ֏{price.toLocaleString()}
            </Typography>
            {data.previousPrice > price && (
              <Typography
                sx={{
                  fontSize: '13px',
                  textDecoration: 'line-through',
                  color: '#999',
                  mt: '2px',
                  mb: '8px',
                }}
              >
                ֏{data.previousPrice.toLocaleString()}
              </Typography>
            )}
          </Box>
          {savedFromOriginal > 0 && (
            <Typography sx={{ fontSize: '12px', color: '#e65100', fontWeight: 500, mb: '2px' }}>
              {t('itemMarkdown', { amount: savedFromOriginal.toLocaleString() })}
            </Typography>
          )}
          {savedFromFirstShop > 0 && (
            <Typography sx={{ fontSize: '12px', color: '#e65100', fontWeight: 500, mb: '2px' }}>
              {t('itemFirstShopDiscount', { amount: savedFromFirstShop.toLocaleString() })}
            </Typography>
          )}
          {savedFromExtra > 0 && (
            <Typography sx={{ fontSize: '12px', color: '#e65100', fontWeight: 500, mb: '5px' }}>
              {t('itemExtraDiscount', {
                rate: extraRate * 100,
                amount: savedFromExtra.toLocaleString(),
              })}
            </Typography>
          )}

          {!isInStock && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="error" display="block" sx={{ fontWeight: 600 }}>
                {t('disabledOutOfStock')}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ mt: 1, textTransform: 'none', fontSize: '12px' }}
                onClick={() => setDialogOpen(true)}
              >
                {t('checkAvailability')}
              </Button>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            mt: '2px',
            display: { xs: 'none', sm: 'flex' },
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              border: 'solid 0.5px #65626263',
              borderRadius: '10px',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <IconButton
              size="small"
              onClick={() => decreaseQuantity(id, cart, setCart, option)}
              aria-label="delete"
              // sx={{ cursor: quantity < 2 ? 'not-allowed' : 'pointer' }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ bgcolor: '#6562620f', p: '6px 15px', fontSize: '14px' }}>
              {item.quantity}
            </Typography>
            <IconButton
              size="small"
              onClick={() => increaseQuantity(id, cart, setCart, option)}
              aria-label="delete"
            >
              <AddIcon />
            </IconButton>
          </Box>
          <IconButton onClick={() => deleteItem(id, cart, setCart, option)} aria-label="delete">
            <DeleteOutlinedIcon />
          </IconButton>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('availabilityDialogTitle')}</DialogTitle>
        <DialogContent>
          {requestSent ? (
            <Alert severity="success" sx={{ mt: 1 }}>
              {t('requestSent')}
            </Alert>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body2">{t('availabilityDialogContent')}</Typography>
              <TextField
                label={t('name')}
                fullWidth
                size="small"
                value={contactInfo.name}
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
              />
              <TextField
                label={t('email')}
                fullWidth
                size="small"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              />
              <TextField
                label={t('phoneNumber')}
                fullWidth
                size="small"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              />
              <TextField
                label={t('note')}
                fullWidth
                multiline
                rows={2}
                size="small"
                value={contactInfo.note}
                onChange={(e) => setContactInfo({ ...contactInfo, note: e.target.value })}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          {!requestSent && (
            <>
              <Button onClick={() => setDialogOpen(false)}>{t('cancel')}</Button>
              <Button onClick={handleNotifySubmit} variant="contained" disabled={notifyLoading}>
                {notifyLoading ? '...' : t('submit')}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
