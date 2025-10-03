'use client';

import { useGlobalContext } from '@/app/GlobalContext';
import { Box, Checkbox, Grid, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { images } from '@/components/PopularProducts';
import Image from 'next/image';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

export default function CartPageUi({ items }) {
  const { cart, setCart, handleClickError } = useGlobalContext();
  //   console.log(cart);

  return (
    <Grid
      sx={{
        display: 'flex',
        width: '100%',
        maxWidth: '1150px',
        margin: '0 auto',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        mt: '40px',
      }}
      container
    >
      <Typography
        sx={{ fontSize: { xs: '22px', sm: '28px' }, mb: '20px', width: '100%' }}
        fontWeight={700}
        color="#2B3445"
      >
        Cart ({cart.length})
      </Typography>
      <Grid container size={12} direction={'column'}>
        {Object.keys(cart.items).map((id, index) => {
          return (
            <Grid
              key={index}
              size={8}
              container
              alignItems={'center'}
              //   justifyContent={'space-between'}
              sx={{ borderTop: 'solid 1px #c5c7cc47', py: '30px', position: 'relative' }}
            >
              <Checkbox
                sx={{
                  position: 'absolute',
                  top: '8px',
                  right: 0,
                  p: 0,
                  '&.Mui-checked': {
                    color: '#00c853',
                  },
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  width: '100px',
                  overflow: 'hidden',
                  bgcolor: '#98a4cb16',
                  boxSizing: 'border-box',
                  borderRadius: '15px',
                  p: '7px',
                }}
              >
                <Image
                  width={200}
                  height={200}
                  style={{ width: '100%', height: 'auto' }}
                  src={images[id]}
                  alt="image"
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  ml: '20px',

                  overflow: 'hidden',
                }}
              >
                <Typography
                  sx={{
                    color: '#263045fb',

                    fontSize: '15px',
                    fontWeight: 500,
                    textWrap: 'nowrap',
                    width: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Girogio Armani
                </Typography>
                <Typography
                  sx={{
                    color: '#263045fb',
                    fontSize: '13px',
                    textWrap: 'nowrap',
                    width: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Stronger With You Absolutely
                </Typography>
                <Typography sx={{ color: '#263045fb', fontSize: '13px', fontWeight: 500 }}>100 ml</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  border: 'solid 0.5px #65626263',
                  borderRadius: '10px',
                  justifyContent: 'center',
                  alignContent: 'center',
                  width: 'fit-content',
                  margin: 'auto',
                }}
              >
                <IconButton
                  size="small"
                  //  onClick={() => decreaseQuantity(key, cart, setCart)}
                  aria-label="delete"

                  // sx={{ cursor: quantity < 2 ? 'not-allowed' : 'pointer' }}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ bgcolor: '#6562620f', p: '6px 15px', fontSize: '14px', mx: '5px' }}>
                  {cart.items[id].quantity}
                </Typography>
                <IconButton
                  size="small"
                  //  onClick={() => increaseQuantity(key, cart, setCart)}
                  aria-label="delete"
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography
                sx={{
                  color: '#263045fb',
                  fontSize: '14px',
                  //   fontWeight: 500,
                  width: '90px',
                  //   textAlign: 'center',
                }}
              >
                $89.70
              </Typography>
              <Typography
                sx={{
                  color: '#263045fb',
                  fontSize: '14px',
                  fontWeight: 500,
                  width: '90px',
                  //   textAlign: 'center',
                }}
              >
                $189.70
              </Typography>
              <DeleteOutlinedIcon sx={{ color: '#9c9ea2fb' }} />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
}
