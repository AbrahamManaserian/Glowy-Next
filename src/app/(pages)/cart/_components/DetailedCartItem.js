'use client';

import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Image from 'next/image';
import { decreaseQuantity, deleteItem, increaseQuantity } from '../functions/addDeleteIncDecreaseCart';
import Link from 'next/link';

export default function DetailedCartItem({
  item,
  id,
  productDetails,
  cart,
  setCart,
  discountRate = 0,
  isSelected,
  toggleSelection,
}) {
  // Use fresh data from server if available, otherwise fallback to local cart data
  const data = productDetails || item;
  // console.log(data);

  const name = data.fullName ?? data.name ?? data.title ?? 'Product';
  const img =
    data.smallImage?.file ?? data.images?.[0]?.file ?? data.img ?? data.image ?? '/images/placeholder.png';
  const price = data.price ?? data.amount ?? 0;
  const previousPrice = data.previousPrice ?? 0;
  const quantity = item.quantity ?? 1;

  const savedFromOriginal = (previousPrice > price ? previousPrice - price : 0) * quantity;
  const savedFromDiscount = price * discountRate * quantity;

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
          <Image src={img} alt="" width={200} height={200} style={{ width: '100%', height: 'auto' }} />
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
            <IconButton size="small" onClick={() => decreaseQuantity(id, cart, setCart)} aria-label="delete">
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ bgcolor: '#6562620f', p: '4px 10px', fontSize: '13px' }}>
              {item.quantity}
            </Typography>
            <IconButton size="small" onClick={() => increaseQuantity(id, cart, setCart)} aria-label="add">
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
          <IconButton onClick={() => deleteItem(id, cart, setCart)} aria-label="delete" size="small">
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
              Markdown: ֏{savedFromOriginal.toLocaleString()}
            </Typography>
          )}
          {savedFromDiscount > 0 && (
            <Typography sx={{ fontSize: '12px', color: '#e65100', fontWeight: 500, mb: '5px' }}>
              Extra 20%: ֏{savedFromDiscount.toLocaleString()}
            </Typography>
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
              onClick={() => decreaseQuantity(item.id, cart, setCart)}
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
              onClick={() => increaseQuantity(item.id, cart, setCart)}
              aria-label="delete"
            >
              <AddIcon />
            </IconButton>
          </Box>
          <IconButton onClick={() => deleteItem(item.id, cart, setCart)} aria-label="delete">
            <DeleteOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
