'use client';

import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Image from 'next/image';
import { decreaseQuantity, deleteItem, increaseQuantity } from '../functions/addDeleteIncDecreaseCart';
import Link from 'next/link';

export default function CartItem({ id, image, cart, setCart, check, padding }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '140px',
        borderBottom: '1px dashed #dde2e5ff',
        overflow: 'hidden',
        p: padding,
        boxSizing: 'border-box',
        maxWidth: '700px',
      }}
    >
      <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
        <Link
          href={`/fragrance/${id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            boxSizing: 'border-box',
            backgroundColor: '#d2cccc30',

            width: '100px',
            height: '100px',
            overflow: 'hidden',
            WebkitTapHighlightColor: 'rgba(43, 137, 219, 0.04)',
          }}
        >
          <Image src={image} alt="" width={200} height={200} style={{ width: '100%', height: 'auto' }} />
        </Link>
      </div>

      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          boxSizing: 'border-box',
          height: '100px',
          justifyContent: 'space-between',
          overflow: 'hidden',
          ml: '15px',
        }}
      >
        <div>
          <Typography
            sx={{
              fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              //   maxWidth: '240px',
              color: '#191818f6',
              fontWeight: 300,
            }}
          >
            Armani Stronger With yuo Absolutely
          </Typography>
          <Typography
            sx={{
              fontSize: '15px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              //   maxWidth: '220px',
              mt: '2px',
            }}
          >
            $ 230.00
          </Typography>
        </div>
        <Box
          sx={{
            display: 'flex',
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
              // mr: '15px',
            }}
          >
            <IconButton
              size="small"
              onClick={() => decreaseQuantity(id, cart, setCart)}
              aria-label="delete"
              // sx={{ cursor: quantity < 2 ? 'not-allowed' : 'pointer' }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ bgcolor: '#6562620f', p: '6px 15px', fontSize: '14px' }}>
              {cart.items[id].quantity}
            </Typography>
            <IconButton size="small" onClick={() => increaseQuantity(id, cart, setCart)} aria-label="delete">
              <AddIcon />
            </IconButton>
          </Box>
          {check && (
            <Checkbox
              sx={{
                p: 0,
                '&.Mui-checked': {
                  color: '#00c853',
                },
              }}
            />
          )}
          <DeleteOutlinedIcon
            onClick={() => deleteItem(id, cart, setCart)}
            sx={{ fontSize: '28px', color: '#ca4d4df6', cursor: 'pointer' }}
          />
        </Box>
      </Box>
    </Box>
  );
}
