'use client';

import { Box, Button, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SpecialOffer() {
  const [option, setOption] = useState(100);
  const handleClickOption = (opt) => {
    setOption(opt);
  };
  return (
    <Grid sx={{ m: { xs: '80px 15px', sm: '90px 25px' } }} size={12} container justifyContent="center">
      <Typography
        sx={{ fontSize: { xs: '22px', sm: '32px' }, mb: '35px', flexGrow: 1, width: '100%' }}
        fontWeight={700}
        color="#2B3445"
      >
        Special Offer
      </Typography>
      <Grid size={12} maxWidth={'1150px'} spacing={5} container>
        <Grid
          spacing={0}
          size={{ xs: 12, sm: 12, md: 4, lg: 4 }}
          sx={{
            boxShadow: 'rgba(84, 80, 80, 0.1) 0px 1px 60px',
            p: '40px 10px',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
          container
          direction="column"
          alignItems="center"
        >
          <Typography sx={{ color: '#f44336', fontSize: '14px' }}>Fragrance</Typography>
          <Typography
            sx={{
              color: '#2B3445',
              fontSize: '18px',
              fontWeight: 500,
              mt: '5px',
              maxWidth: '200px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Versace Bright Cristal
          </Typography>

          <Typography
            sx={{
              border: 'solid 1px rgba(44, 43, 43, 0.11)',
              p: '7px 24px',
              borderRadius: '7px',
              mt: '30px',
            }}
            fontSize="14px"
            fontWeight={500}
            color="#46484bff"
          >
            $7,500
          </Typography>

          <Typography
            sx={{
              mt: '20px ',
              borderTop: '1px dashed #dde2e5ff',
              width: '250px',
              textAlign: 'center',
              pt: '30px',
            }}
            fontSize="14px"
            fontWeight={500}
            color="#46484bff"
          >
            Deal Ends In:
          </Typography>
          <DealCountdown />
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignContent="center"
          size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
          sx={{ bgcolor: '#4c5e790e', p: '15px', borderRadius: '10px', overflow: 'hidden' }}
        >
          <Image
            src="/images/12.webp"
            alt="Versace Bright Cristal"
            width={200}
            height={200}
            style={{ width: 'auto', height: '75%' }}
          />
        </Grid>
        <Grid
          container
          direction="column"
          spacing={0}
          size={{ xs: 12, sm: 4, md: 4, lg: 4 }}
          sx={{ overflow: 'hidden' }}
        >
          <Typography
            sx={{
              color: '#2B3445',
              fontSize: '23px',
              fontWeight: 600,
            }}
          >
            Versace Bright Cristal
          </Typography>
          <Typography sx={{ color: '#21212295', fontSize: '14px', mt: '10px' }}>
            While most people enjoy casino gambling, sports betting, lottery and bingo playing for the fun.
          </Typography>
          <Typography sx={{ color: '#212122da', fontSize: '14px', mt: '25px', fontWeight: 500 }}>
            Options
          </Typography>
          <Box sx={{ display: 'flex', mt: '12px' }}>
            {[50, 75, 100].map((opt, index) => {
              return (
                <Options key={index} handleClickOption={handleClickOption} option={opt} state={option} />
              );
            })}
          </Box>
          <Button
            variant="contained"
            sx={{
              textTransform: 'capitalize',
              mt: '35px',
              py: '8px',
              bgcolor: '#2B3445',
              borderRadius: '7px',
              width: '150px',
            }}
          >
            Buy Now
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

function Options({ handleClickOption, option, state }) {
  return (
    <Box
      onClick={() => handleClickOption(option)}
      sx={{
        border: state === option ? 'solid 1.5px rgba(44, 43, 43, 0.8)' : 'solid 1px rgba(44, 43, 43, 0.11)',
        p: '6px 15px',
        borderRadius: '8px',
        mr: '8px',
        cursor: 'pointer',
      }}
    >
      <Typography sx={{ color: '#212122da', fontSize: '14px', fontWeight: 500 }}>{option} ml</Typography>
    </Box>
  );
}

function DealCountdown() {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    // Example: deal ends in 3 days from now
    const dealEndTime = new Date('2025-09-10T23:59:59').getTime();

    const updateTime = () => {
      setTimeLeft(dealEndTime - new Date().getTime());
    };

    updateTime(); // run once immediately
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft === null) {
    return <div style={{ visibility: 'hidden' }}>Loading…</div>; // prevent SSR mismatch
  }

  if (timeLeft <= 0) {
    return <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'red' }}>Deal ended</div>;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = String(Math.floor((timeLeft / (1000 * 60 * 60)) % 24)).padStart(2, '0');
  const minutes = String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(2, '0');
  const seconds = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, '0');

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: '15px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ border: 'solid 1px rgba(44, 43, 43, 0.11)', p: '6px 15px', borderRadius: '8px' }}>
          <Typography fontWeight={500}>{days ? days : '00'}</Typography>
        </Box>
        <Typography sx={{ color: '#3e3f4279', fontSize: '14px', mt: '7px' }}>days</Typography>
      </Box>
      <Typography sx={{ m: '6px 8px 0 8px' }}>:</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ border: 'solid 1px rgba(44, 43, 43, 0.11)', p: '6px 15px', borderRadius: '8px' }}>
          <Typography fontWeight={500}>{hours ? hours : '00'}</Typography>
        </Box>
        <Typography sx={{ color: '#3e3f4279', fontSize: '14px', mt: '7px' }}>hours</Typography>
      </Box>
      <Typography sx={{ m: '6px 8px 0 8px' }}>:</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ border: 'solid 1px rgba(44, 43, 43, 0.11)', p: '6px 15px', borderRadius: '8px' }}>
          <Typography fontWeight={500}>{minutes ? minutes : '00'}</Typography>
        </Box>
        <Typography sx={{ color: '#3e3f4279', fontSize: '14px', mt: '7px' }}>minutes</Typography>
      </Box>
      <Typography sx={{ m: '6px 8px 0 8px' }}>:</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ border: 'solid 1px rgba(44, 43, 43, 0.11)', p: '6px 15px', borderRadius: '8px' }}>
          <Typography fontWeight={500}>{seconds ? seconds : '00'}</Typography>
        </Box>
        <Typography sx={{ color: '#3e3f4279', fontSize: '14px', mt: '7px' }}>seconds</Typography>
      </Box>
    </Box>
  );
}
