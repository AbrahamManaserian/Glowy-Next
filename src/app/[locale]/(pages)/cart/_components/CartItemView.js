'use client';

import { Box, IconButton, Typography, Checkbox } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { Link } from '@/i18n/routing';
import { decreaseQuantity, deleteItem, increaseQuantity } from '../functions/addDeleteIncDecreaseCart';
import { useTranslations } from 'next-intl';

export default function CartItemView({ id, item, productDetails, cart, setCart, check = false }) {
  const t = useTranslations('CartPage');
  const tProduct = useTranslations('ProductPage');
  if (!item) return null;

  // Use fresh data from server if available, otherwise fallback to local cart data
  const data = productDetails || item;

  const name = data.fullName ?? data.name ?? data.title ?? t('productFallback');
  const img =
    data.smallImage?.file ?? data.images?.[0] ?? data.img ?? data.image ?? '/images/placeholder.png';
  const price = data.price ?? data.amount ?? 0;

  // Quantity always comes from the local cart state
  const quantity = item.quantity ?? 1;

  return (
    <>
      {item.options ? (
        Object.keys(item.options).map((opt, ind) => {
          const price =
            productDetails?.availableOptions?.find((o) => o[productDetails.optionKey] === opt)?.price ||
            data.price;
          const quantity = item.options[opt];

          return (
            <Box
              key={ind}
              component="article"
              aria-label={`cart-item-${id}`}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                gap: 2,
                borderBottom: '1px dashed #dde2e5ff',
                overflow: 'hidden',
                p: { xs: '12px' },
                minHeight: 120,
              }}
            >
              <Link
                href={`/item/${id}?option=${encodeURIComponent(opt)}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  boxSizing: 'border-box',
                  width: '100px',
                  minWidth: '100px',
                  height: '100px',
                  overflow: 'hidden',
                  WebkitTapHighlightColor: 'rgba(219, 122, 43, 0.04)',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: 100,
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={img}
                    alt={name}
                    // width={200}
                    // height={200}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Box>
              </Link>

              <Box
                sx={{
                  flex: '1 1 auto',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: '100%',
                  overflow: 'hidden',
                  px: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#191818',
                      fontWeight: 500,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {name}
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5 }}>
                    {tProduct(`optionKeys.${productDetails?.optionKey}`)} : {opt}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: '#2B3445' }}>
                    $ {Number(price).toLocaleString()}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center', mt: 1 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: '#fff',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <IconButton
                      size="small"
                      aria-label={`decrease-${id}`}
                      onClick={() => decreaseQuantity(id, cart, setCart, opt)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ px: 1.5, fontSize: 14 }}>{quantity}</Typography>
                    <IconButton
                      size="small"
                      aria-label={`increase-${id}`}
                      onClick={() => increaseQuantity(id, cart, setCart, opt)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {check && <Checkbox size="small" />}

                  <IconButton
                    aria-label={`delete-${id}`}
                    onClick={() => deleteItem(id, cart, setCart, opt)}
                    sx={{ color: '#ca4d4d' }}
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          );
        })
      ) : (
        <Box
          component="article"
          aria-label={`cart-item-${id}`}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: 2,
            borderBottom: '1px dashed #dde2e5ff',
            overflow: 'hidden',
            p: { xs: '12px' },
            minHeight: 120,
          }}
        >
          <Link
            href={`/item/${id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              boxSizing: 'border-box',
              width: '100px',
              minWidth: '100px',
              height: '100px',
              overflow: 'hidden',
              WebkitTapHighlightColor: 'rgba(219, 122, 43, 0.04)',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                minHeight: 100,
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Box>
          </Link>

          <Box
            sx={{
              flex: '1 1 auto',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '100%',
              overflow: 'hidden',
              px: 1,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#191818',
                  fontWeight: 500,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {name}
              </Typography>
              {productDetails?.optionKey && (
                <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5 }}>
                  {tProduct(`optionKeys.${productDetails?.optionKey}`)} :{' '}
                  {productDetails[productDetails?.optionKey]}
                </Typography>
              )}

              <Typography variant="body2" sx={{ mt: 0.5, color: '#2B3445' }}>
                $ {Number(price).toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center', mt: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: '#fff',
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                }}
              >
                <IconButton
                  size="small"
                  aria-label={`decrease-${id}`}
                  onClick={() => decreaseQuantity(id, cart, setCart)}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 1.5, fontSize: 14 }}>{quantity}</Typography>
                <IconButton
                  size="small"
                  aria-label={`increase-${id}`}
                  onClick={() => increaseQuantity(id, cart, setCart)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              {check && <Checkbox size="small" />}

              <IconButton
                aria-label={`delete-${id}`}
                onClick={() => deleteItem(id, cart, setCart)}
                sx={{ color: '#ca4d4d' }}
              >
                <DeleteOutlinedIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
