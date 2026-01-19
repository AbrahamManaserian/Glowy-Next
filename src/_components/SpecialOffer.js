'use client';

import { Box, Button, Grid, Typography } from '@mui/material';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SpecialOffer({ specialOffer: initialOffer }) {
  const [specialOffer, setSpecialOffer] = useState(initialOffer);
  const [option, setOption] = useState(null);
  const router = useRouter();
  const t = useTranslations('HomePage.specialOffer');

  useEffect(() => {
    if (initialOffer) {
      const key = initialOffer.optionKey;
      if (key && initialOffer[key]) {
        setOption(initialOffer[key]);
      } else if (
        initialOffer.availableOptions &&
        Array.isArray(initialOffer.availableOptions) &&
        initialOffer.availableOptions.length > 0
      ) {
        setOption(initialOffer.availableOptions[0][key]);
      }
    }
    setSpecialOffer(initialOffer);
  }, [initialOffer]);

  const handleClickOption = async (opt) => {
    const key = specialOffer.optionKey;
    setOption(opt[key]);

    if (opt.id) {
      try {
        const res = await fetch(`/api/item?id=${opt.id}`);
        const newData = await res.json();
        if (newData && !newData.error) {
          setSpecialOffer(newData);
        }
      } catch (error) {
        console.error('Failed to fetch option data', error);
      }
    }
  };

  if (!specialOffer) return null;

  return (
    <Grid sx={{ m: { xs: '80px 15px', sm: '90px 25px' } }} size={12} container justifyContent="center">
      <Typography
        sx={{ fontSize: { xs: '22px', sm: '32px' }, mb: '35px', flexGrow: 1, width: '100%' }}
        fontWeight={700}
        color="#2B3445"
      >
        {t('title')}
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
          <Typography sx={{ color: '#f44336', fontSize: '14px' }}>
            {specialOffer.category || t('specialDeal')}
          </Typography>
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
              textAlign: 'center',
            }}
          >
            {specialOffer.fullName || specialOffer.title}
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
            ֏{specialOffer.price?.toLocaleString()}
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
          <Box sx={{ position: 'relative', width: '100%', height: '300px' }}>
            <img
              src={specialOffer.mainImage?.url || specialOffer.mainImage?.file || '/images/placeholder.jpg'}
              alt={specialOffer.fullName || specialOffer.title}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Box>
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
            {specialOffer.fullName || specialOffer.title}
          </Typography>
          <Typography sx={{ color: '#21212295', fontSize: '14px', mt: '10px' }}>
            {specialOffer.description || 'Get the best deal on this amazing product. Limited time offer!'}
          </Typography>

          {(() => {
            const key = specialOffer.optionKey;
            let opts = specialOffer.availableOptions ? [...specialOffer.availableOptions] : [];

            if (key && specialOffer[key] && !opts.find((o) => o.id === specialOffer.id)) {
              opts.push({ id: specialOffer.id, [key]: specialOffer[key] });
            }

            opts.sort((a, b) => {
              const valA = parseFloat(a[key]);
              const valB = parseFloat(b[key]);
              if (!isNaN(valA) && !isNaN(valB)) {
                return valA - valB;
              }
              return 0;
            });

            if (opts.length === 0) return null;

            return (
              <>
                <Typography sx={{ color: '#212122da', fontSize: '14px', mt: '25px', fontWeight: 500 }}>
                  Options
                </Typography>
                <Box sx={{ display: 'flex', mt: '12px' }}>
                  {opts.map((opt, index) => {
                    const value = opt[key];
                    return (
                      <Options
                        key={index}
                        handleClickOption={() => handleClickOption(opt)}
                        option={value}
                        state={option}
                      />
                    );
                  })}
                </Box>
              </>
            );
          })()}

          <Button
            onClick={() => router.push(`/item/${specialOffer.id}`)}
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
            More
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
      <Typography sx={{ color: '#212122da', fontSize: '14px', fontWeight: 500 }}>{option}</Typography>
    </Box>
  );
}

function DealCountdown() {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTargetTime = () => {
      let target = new Date('2025-09-10T23:59:59').getTime();
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      if (target < now) {
        const diff = now - target;
        const daysToAdd = Math.ceil(diff / oneDay);
        target += daysToAdd * oneDay;

        if (target <= now) {
          target += oneDay;
        }
      }
      return target;
    };

    let dealEndTime = calculateTargetTime();

    const updateTime = () => {
      const now = Date.now();
      let diff = dealEndTime - now;

      if (diff <= 0) {
        dealEndTime += 24 * 60 * 60 * 1000;
        diff = dealEndTime - now;
      }

      setTimeLeft(diff);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft === null) {
    return <div style={{ visibility: 'hidden' }}>Loading…</div>;
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
