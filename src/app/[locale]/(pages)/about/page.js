'use client';

import React from 'react';
import { Container, Typography, Box, Grid, Button, Paper, Stack, Skeleton } from '@mui/material';
import { Spa, Favorite, Diamond, LocalShipping, ArrowForward } from '@mui/icons-material';
// import Link from 'next/link';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function AboutPage() {
  const t = useTranslations('AboutPage');

  return (
    <Box component="main" sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 8 }}>
      {/* Minimal Hero */}
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 4, md: 8 } }}>
        <Box sx={{ textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
          <Typography component="h1" variant="h3" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            {t('title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mx: 'auto', maxWidth: 680 }}>
            {t('subtitle')}
          </Typography>
        </Box>
      </Container>

      {/* Mission: balanced two-column with clean image */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                height: { xs: 220, md: 320 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#fafafa',
              }}
            >
              <Box
                component="img"
                src="/logo.svg"
                alt="Glowy Brand"
                sx={{ width: { xs: '60%', md: '40%' }, filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.06))' }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              {t('missionTitle')}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, mt: 1, mb: 2 }}>
              {t('missionSubtitle')}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
              {t('missionText1')}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
              {t('missionText2')}
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Values: simple icon cards */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {t('whyChooseUs')}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            {t('whyChooseUsSubtitle')}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            { icon: <Spa />, title: t('naturalIngredients'), desc: t('naturalIngredientsDesc') },
            { icon: <Favorite />, title: t('crueltyFree'), desc: t('crueltyFreeDesc') },
            { icon: <Diamond />, title: t('premiumQuality'), desc: t('premiumQualityDesc') },
            { icon: <LocalShipping />, title: t('fastShipping'), desc: t('fastShippingDesc') },
          ].map((item, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                    color: 'primary.main',
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Small Stores list */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t('visitStores')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('visitStoresSubtitle')}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              city: 'Artashat',
              address: 'Isaakov 64/1',
              hours: 'Everyday: 10am - 9pm',
              image: '/images/WhatsApp Image 2026-01-10 at 11.48.10.jpeg',
            },
            { city: 'Yeerevan', comingSoon: true },
            { city: 'Yeerevan', comingSoon: true },
          ].map((store, idx) => (
            <Grid container size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #f0f0f0',
                  width: '100%',
                  alignContent: 'stretch',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                {store.comingSoon ? (
                  <Box
                    sx={{
                      width: '100%',
                      height: 150,
                      borderRadius: 1,
                      bgcolor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Coming soon
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ width: '100%', height: 150, mb: 2, position: 'relative' }}>
                    <Image
                      src={store.image}
                      alt={store.city}
                      fill
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                  </Box>
                )}

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {store.city}
                </Typography>

                {store.comingSoon ? (
                  <>
                    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        {t('address')}
                      </Box>{' '}
                      {store.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        {t('hours')}
                      </Box>{' '}
                      {store.hours}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Container maxWidth="sm" sx={{ mt: 10, mb: 12 }}>
        <Box sx={{ textAlign: 'center', p: 4, borderRadius: 3, border: '1px solid #f0f0f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {t('ctaTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('ctaSubtitle')}
          </Typography>
          <Button component={Link} href="/shop" variant="outlined" size="large" sx={{ borderRadius: 50 }}>
            {t('shopNow')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
