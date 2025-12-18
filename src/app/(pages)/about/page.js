import React from 'react';
import { Container, Typography, Box, Grid, Button, Paper, Stack } from '@mui/material';
import { Spa, Favorite, Diamond, LocalShipping, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <Box component="main" sx={{ bgcolor: '#fcfcfc', minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#fff0f5', // Light pink background
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          textAlign: 'center',
          borderRadius: '0 0 50% 50% / 40px',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            We Are Glowy
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Redefining beauty with products that make you shine from the inside out.
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                height: '400px',
                bgcolor: '#fff0f5',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
              }}
            >
              <Box
                component="img"
                src="/logo.svg"
                alt="Glowy Brand"
                sx={{
                  width: '100%',
                  maxWidth: '300px',
                  height: 'auto',
                  filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.1))',
                }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
              Our Mission
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, mt: 1 }}>
              Beauty Without Compromise
            </Typography>
            <Typography
              variant="body1"
              paragraph
              color="text.secondary"
              sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}
            >
              At Glowy, we believe that beauty should be effortless, ethical, and effective. We started with a
              simple idea: to create a curated collection of beauty products that not only enhance your
              natural look but also care for your skin.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              color="text.secondary"
              sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}
            >
              Every product in our store is hand-picked for its quality, sustainability, and performance. We
              are committed to bringing you the best the beauty world has to offer.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Why Choose Us?
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            The pillars that define our brand
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              icon: <Spa fontSize="large" />,
              title: 'Natural Ingredients',
              desc: 'We prioritize products with clean, non-toxic ingredients.',
            },
            {
              icon: <Favorite fontSize="large" />,
              title: 'Cruelty Free',
              desc: 'We love animals. None of our products are tested on them.',
            },
            {
              icon: <Diamond fontSize="large" />,
              title: 'Premium Quality',
              desc: 'Luxury experiences at accessible prices.',
            },
            {
              icon: <LocalShipping fontSize="large" />,
              title: 'Fast Shipping',
              desc: 'Get your glow on faster with our expedited delivery.',
            },
          ].map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  bgcolor: '#fff',
                  borderRadius: 4,
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ color: '#FF6B6B', mb: 2 }}>{item.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stores Section */}
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Visit Our Stores
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            Experience Glowy in person
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            { city: 'New York', address: '123 Fifth Avenue, NY 10010', hours: 'Mon-Sun: 10am - 9pm' },
            { city: 'Los Angeles', address: '456 Rodeo Drive, CA 90210', hours: 'Mon-Sun: 10am - 8pm' },
            {
              city: 'London',
              address: '789 Oxford Street, W1D 1BS',
              hours: 'Mon-Sat: 10am - 8pm, Sun: 12pm - 6pm',
            },
          ].map((store, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 4,
                  border: '1px solid #eee',
                  height: '100%',
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
                }}
              >
                <Box
                  sx={{
                    height: '200px',
                    bgcolor: '#eee',
                    backgroundImage: `url(/images/stores/store-${index + 1}.jpg)`, // Placeholder
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    [Store Image]
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {store.city}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Box component="span" sx={{ fontWeight: 500 }}>
                      Address:
                    </Box>{' '}
                    {store.address}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Box component="span" sx={{ fontWeight: 500 }}>
                      Hours:
                    </Box>{' '}
                    {store.hours}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mt: 12, mb: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #fff0f5 0%, #fff 100%)',
            border: '1px solid #ffe0e5',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to find your glow?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Explore our latest collection and find your new favorites today.
          </Typography>
          <Button
            component={Link}
            href="/"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: 50,
              px: 5,
              py: 1.5,
              bgcolor: '#111',
              '&:hover': { bgcolor: '#333' },
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            Shop Now
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
