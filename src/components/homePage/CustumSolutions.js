'use client';

import { Box, Grid, Typography } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const images = [
  '/images/giftCollection/491418281_17894849493207296_8185218575935560017_n.jpg',
  '/images/giftCollection/491444976_17895688209207296_701226333239409337_n.jpg',
  '/images/giftCollection/503000504_17899019925207296_2081947318050669149_n.jpg',
  '/images/giftCollection/527451955_17906711424207296_2969023766760293256_n.jpg',
  '/images/giftCollection/491415702_17894775201207296_2836718220170321531_n.jpg',
];

export default function CustumSolutions() {
  return (
    <Grid
      size={12}
      alignContent="flex-start"
      container
      sx={{ borderRadius: '15px', m: { xs: '80px 15px', sm: '90px 25px' }, position: 'relative' }}
    >
      <Typography
        width={'100%'}
        sx={{ fontSize: { xs: '22px', sm: '32px' }, mb: '20px' }}
        fontWeight={700}
        color="#2B3445"
      >
        Custom solutions for your needs
      </Typography>
      <Grid
        alignContent="flex-start"
        size={{ xs: 12, sm: 12, md: 4 }}
        container
        sx={{
          p: { xs: '10px 0 10px 0', sm: '10px 0 10px 0', md: '10px 10px 10px 0' },
          position: 'relative',
          '&:hover p': {
            textDecoration: 'underline',
          },
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            borderRadius: '15px',
            height: { xs: '205px', sm: '470px', md: '810px' },
          }}
        >
          <Box
            component="img"
            src={images[1]}
            alt="slide"
            sx={{
              width: { xs: '100%', sm: '100%', md: 'auto' }, // 👈 changes at breakpoints
              height: { xs: 'auto', sm: 'auto', md: '1000px' },
              ':hover': {
                transform: { xs: 0, sm: 'scale(1.07)' },
              },
              transition: 'transform 0.6s ease',
              cursor: 'pointer',
            }}
          />
        </Box>
        <Typography
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            fontSize: { xs: '14px', sm: '20px' },
            fontWeight: 600,
            color: '#2B3445',
            pointerEvents: 'none',
          }}
        >
          Makeup Remover
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            height: '35px',
            width: '35px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'white',
            borderRadius: '10px',
            pointerEvents: 'none',
          }}
        >
          <ArrowRightAltIcon sx={{ color: '#2B3445' }} />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 8 }} container>
        <Grid
          sx={{
            p: { xs: '10px 0 10px 0', sm: '10px 10px 10px 0', md: '10px' },
            position: 'relative',
            '&:hover p': {
              textDecoration: 'underline',
            },
          }}
          size={{ xs: 12, sm: 6 }}
          container
          alignContent="flex-start"
        >
          <Box
            sx={{
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              borderRadius: '15px',
              height: { xs: '205px', sm: '275px', md: '395px' },
            }}
          >
            <Box
              component="img"
              src={images[0]}
              sx={{
                width: '110%',
                height: 'auto',
                ':hover': {
                  transform: { xs: 0, sm: 'scale(1.07)' },
                },

                transition: 'transform 0.6s ease',
                cursor: 'pointer',
              }}
            />
          </Box>

          <Typography
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              fontSize: { xs: '14px', sm: '20px' },
              fontWeight: 600,
              color: '#2B3445',
              pointerEvents: 'none',
            }}
          >
            Makeup Remover
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              height: '35px',
              width: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'white',
              borderRadius: '10px',
              pointerEvents: 'none',
            }}
          >
            <ArrowRightAltIcon sx={{ color: '#2B3445' }} />
          </Box>
        </Grid>
        <Grid
          sx={{
            p: { xs: '10px 0 10px 0', sm: '10px 0 10px 10px', md: '10px 0 10px 10px' },
            overflow: 'hidden',
            position: 'relative',
            '&:hover p': {
              textDecoration: 'underline',
            },
          }}
          size={{ xs: 12, sm: 6 }}
          container
          alignContent="flex-start"
        >
          <Box
            sx={{
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              borderRadius: '10px',
              height: { xs: '205px', sm: '275px', md: '395px' },
            }}
          >
            <Box
              component="img"
              src={images[2]}
              sx={{
                width: '140%',
                height: 'auto',
                ':hover': {
                  transform: { xs: 0, sm: 'scale(1.07)' },
                },
                transition: 'transform 0.6s ease',
                cursor: 'pointer',
              }}
            />
          </Box>
          <Typography
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              fontSize: { xs: '14px', sm: '20px' },
              fontWeight: 600,
              color: '#2B3445',
              pointerEvents: 'none',
            }}
          >
            Makeup Remover
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              height: '35px',
              width: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'white',
              borderRadius: '10px',
              pointerEvents: 'none',
            }}
          >
            <ArrowRightAltIcon sx={{ color: '#2B3445' }} />
          </Box>
        </Grid>
        <Grid
          sx={{
            p: { xs: '10px 0 10px 0', sm: '10px 10px 10px 0', md: '10px' },
            overflow: 'hidden',
            position: 'relative',
            '&:hover p': {
              textDecoration: 'underline',
            },
          }}
          size={{ xs: 12, sm: 6 }}
          container
          alignContent="flex-start"
        >
          <Box
            sx={{
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              borderRadius: '10px',
              height: { xs: '205px', sm: '275px', md: '395px' },
            }}
          >
            <Box
              component="img"
              src={images[3]}
              sx={{
                width: '140%',
                height: 'auto',
                ':hover': {
                  transform: { xs: 0, sm: 'scale(1.07)' },
                },
                transition: 'transform 0.6s ease',
                cursor: 'pointer',
              }}
            />
          </Box>
          <Typography
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              fontSize: { xs: '14px', sm: '20px' },
              fontWeight: 600,
              color: '#2B3445',
              pointerEvents: 'none',
            }}
          >
            Makeup Remover
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              height: '35px',
              width: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'white',
              borderRadius: '10px',
              pointerEvents: 'none',
            }}
          >
            <ArrowRightAltIcon sx={{ color: '#2B3445' }} />
          </Box>
        </Grid>
        <Grid
          sx={{
            p: { xs: '10px 0 10px 0', sm: '10px 0 10px 10px', md: '10px 0 10px 10px' },
            overflow: 'hidden',
            position: 'relative',
            '&:hover p': {
              textDecoration: 'underline',
            },
          }}
          size={{ xs: 12, sm: 6 }}
          container
          alignContent="flex-start"
        >
          <Box
            sx={{
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              borderRadius: '10px',
              height: { xs: '205px', sm: '275px', md: '395px' },
            }}
          >
            <Box
              component="img"
              src={images[4]}
              sx={{
                width: '140%',
                height: 'auto',
                ':hover': {
                  transform: { xs: 0, sm: 'scale(1.07)' },
                },
                transition: 'transform 0.6s ease',
                cursor: 'pointer',
              }}
            />
          </Box>
          <Typography
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              fontSize: { xs: '14px', sm: '20px' },
              fontWeight: 600,
              color: '#2B3445',
              pointerEvents: 'none',
            }}
          >
            Makeup Remover
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              height: '35px',
              width: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'white',
              borderRadius: '10px',
              pointerEvents: 'none',
            }}
          >
            <ArrowRightAltIcon sx={{ color: '#2B3445' }} />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
