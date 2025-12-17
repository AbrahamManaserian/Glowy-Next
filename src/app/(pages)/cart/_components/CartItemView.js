'use client';

import { Box, IconButton, Typography, Checkbox } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Image from 'next/image';
import Link from 'next/link';
import { decreaseQuantity, deleteItem, increaseQuantity } from '../functions/addDeleteIncDecreaseCart';

export default function CartItemView({ id, item, productDetails, cart, setCart, check = false }) {
  if (!item) return null;

  // Use fresh data from server if available, otherwise fallback to local cart data
  const data = productDetails || item;

  const name = data.fullName ?? data.name ?? data.title ?? 'Product';
  const img =
    data.smallImage?.file ?? data.images?.[0] ?? data.img ?? data.image ?? '/images/placeholder.png';
  const price = data.price ?? data.amount ?? 0;

  // Quantity always comes from the local cart state
  const quantity = item.quantity ?? 1;

  return (
    <Box
      component="article"
      aria-label={`cart-item-${id}`}
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 2,
        borderBottom: '1px dashed #dde2e5ff',
        overflow: 'hidden',
        p: { xs: '12px 16px', sm: '12px 20px' },
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
          // backgroundColor: '#d2cccc30',
          width: '100px',
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
          <Image
            src={img}
            alt={name}
            width={200}
            height={200}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>
      </Link>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
        <Typography variant="body2" sx={{ mt: 0.5, color: '#2B3445' }}>
          $ {Number(price).toLocaleString()}
        </Typography>
        {item.size && (
          <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5 }}>
            {item.size}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
  );
}
