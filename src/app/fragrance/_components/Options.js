'use client';

import { Box, Button, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBasketIcon } from '@/_components/icons';
import { useGlobalContext } from '@/app/GlobalContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleAddItemToCart } from '@/app/cart/functions/addDeleteIncDecreaseCart';

export function Options({ id, options, initialOption }) {
  const { cart, setCart, setOpenCartAlert, setOpenItemAddedAlert } = useGlobalContext();
  const [option, setOption] = useState();

  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleClickOption = (opt) => {
    // setOption(opt);
    opt || opt === 0 ? router.push(`?option=${opt}`) : router.push(`?`);
  };

  const handelClickBuyNow = (id) => {
    if (cart.items[id]) {
      router.push(`/cart?item=${id}`);
    } else {
      handleAddItemToCart(id, setCart, setOpenCartAlert, 1, cart);
      router.push(`/cart?item=${id}`);
    }
  };

  const handleClickAddToCart = (id) => {
    if (cart.items[id]) {
      setOpenItemAddedAlert(id);
    } else {
      setOpenCartAlert({ id: id, qount: quantity });
    }
    // setOpenCartAlert({ id: id, qount: quantity });
  };

  useEffect(() => {
    searchParams.get('option') ? setOption(+searchParams.get('option')) : setOption();
  }, [searchParams]);
  return (
    <Box sx={{ display: 'flex', mt: '25px', flexWrap: 'wrap' }}>
      <Typography sx={{ color: '#212122da', fontSize: '15px', fontWeight: 500, width: '100%', mb: '10px' }}>
        Available Options
      </Typography>
      <Box
        onClick={() => handleClickOption()}
        sx={{
          border:
            !option && option !== 0
              ? 'solid 1.5px rgba(69, 73, 69, 0.53)'
              : 'solid 1px rgba(44, 43, 43, 0.11)',
          p: '6px 15px',
          borderRadius: '8px',
          mr: '8px',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <Typography sx={{ color: '#212122da', fontSize: '14px', fontWeight: 500 }}>
          {initialOption} ml
        </Typography>
      </Box>
      {options.map((item, index) => {
        return (
          <Box
            key={index}
            onClick={() => handleClickOption(index)}
            sx={{
              border:
                index === option ? 'solid 1.5px rgba(69, 73, 69, 0.53)' : 'solid 1px rgba(44, 43, 43, 0.11)',
              p: '6px 15px',
              borderRadius: '8px',
              mr: '8px',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Typography sx={{ color: '#212122da', fontSize: '14px', fontWeight: 500 }}>
              {item.optionValue} ml
            </Typography>
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
            onClick={() => handleClickAddToCart(id)}
            sx={{ bgcolor: '#2B3445', borderRadius: '10px' }}
            variant="contained"
            endIcon={<ShoppingBasketIcon color={'white'} />}
          >
            Add to cart
          </Button>
          <Button
            onClick={() => handelClickBuyNow(id)}
            sx={{ ml: '10px', bgcolor: '#f44336', borderRadius: '10px' }}
            variant="contained"
          >
            Buy now
          </Button>
        </Box>
      </div>
    </Box>
  );
}
