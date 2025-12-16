'use client';

import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Image from 'next/image';
import { decreaseQuantity, deleteItem, increaseQuantity } from '../functions/addDeleteIncDecreaseCart';
import Link from 'next/link';

export default function DetailedCartItem({ item, cart, setCart }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px dashed #dde2e5ff',
        overflow: 'hidden',
        boxSizing: 'border-box',
        maxWidth: '700px',
        py: '20px',
      }}
    >
      <Link
        href={`/item/${item.id}`}
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
        <Image src={item.img} alt="" width={200} height={200} style={{ width: '100%', height: 'auto' }} />
      </Link>

      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          boxSizing: 'border-box',
          justifyContent: 'space-between',
          overflow: 'hidden',
          ml: '15px',
        }}
      >
        <div>
          <Typography
            sx={{
              fontSize: '14px',
              overflow: 'hidden',
              color: '#191818f6',
              fontWeight: 500,
            }}
          >
            {item.name}
          </Typography>
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
            ${item.price.toLocaleString()}
          </Typography>
        </div>
        <Box
          sx={{
            mt: '2px',
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

          <DeleteOutlinedIcon
            onClick={() => deleteItem(item.id, cart, setCart)}
            sx={{ fontSize: '28px', color: '#ca4d4df6', cursor: 'pointer' }}
          />
        </Box>
      </Box>
    </Box>
  );
}
