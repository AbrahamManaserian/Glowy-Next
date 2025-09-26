'use client';

import { Box, Button, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBasketIcon } from '@/components/icons';

export function Options() {
  const [option, setOption] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const handleClickOption = (opt) => {
    setOption(opt);
  };
  return (
    <Box sx={{ display: 'flex', mt: '25px', flexWrap: 'wrap' }}>
      <Typography sx={{ color: '#212122da', fontSize: '15px', fontWeight: 500, width: '100%', mb: '10px' }}>
        Available Options
      </Typography>

      {[50, 75, 100].map((opt, index) => {
        return (
          <Box
            key={index}
            onClick={() => handleClickOption(opt)}
            sx={{
              border:
                opt === option ? 'solid 1.5px rgba(69, 73, 69, 0.53)' : 'solid 1px rgba(44, 43, 43, 0.11)',
              p: '6px 15px',
              borderRadius: '8px',
              mr: '8px',
              cursor: 'pointer',
            }}
          >
            <Typography sx={{ color: '#212122da', fontSize: '14px', fontWeight: 500 }}>{opt} ml</Typography>
          </Box>
        );
      })}
      <div
        style={{
          display: 'flex',
          width: '100%',
          marginTop: '30px',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            border: 'solid 0.5px #65626263',
            borderRadius: '10px',
            justifyContent: 'center',
            alignItems: 'flex-start',
            mr: '15px',
          }}
        >
          <IconButton
            disabled={quantity < 2 ? true : false}
            onClick={() => setQuantity(quantity - 1)}
            aria-label="delete"
            // sx={{ cursor: quantity < 2 ? 'not-allowed' : 'pointer' }}
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{ bgcolor: '#6562620f', p: '10px 25px', fontSize: '14px' }}>{quantity} </Typography>
          <IconButton onClick={() => setQuantity(quantity + 1)} aria-label="delete">
            <AddIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', mt: '15px' }}>
          <Button
            sx={{ bgcolor: '#2B3445', borderRadius: '10px' }}
            variant="contained"
            endIcon={<ShoppingBasketIcon color={'white'} />}
          >
            Add to cart
          </Button>
          <Link href="/cart">
            <Button sx={{ ml: '10px', bgcolor: '#f44336', borderRadius: '10px' }} variant="contained">
              Buy now
            </Button>
          </Link>
        </Box>
      </div>
    </Box>
  );
}
