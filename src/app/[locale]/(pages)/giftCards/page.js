'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { useTranslations } from 'next-intl';

const GIFT_CARD_OPTIONS = [
  { value: 5000, label: '֏5,000' },
  { value: 10000, label: '֏10,000' },
  { value: 15000, label: '֏15,000' },
  { value: 20000, label: '֏20,000' },
  { value: 25000, label: '֏25,000' },
  { value: 30000, label: '֏30,000' },
];

export default function GiftCardsPage() {
  const t = useTranslations('GiftCardPage');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 300, letterSpacing: '0.05em', fontFamily: 'serif', color: '#1a1a1a' }}
        >
          {t('title')}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto', fontStyle: 'italic' }}
        >
          {t('subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={6}>
        {/* Left Column: Selection */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 3, fontWeight: 400, fontFamily: 'serif', color: '#1a1a1a' }}
          >
            {t('chooseAmount')}
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {GIFT_CARD_OPTIONS.map((option) => (
              <Grid size={{ xs: 6, sm: 4 }} key={option.value}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor: selectedAmount === option.value ? '#e65100' : 'divider',
                    bgcolor: selectedAmount === option.value ? 'rgba(230, 81, 0, 0.05)' : 'background.paper',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#e65100',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(230, 81, 0, 0.1)',
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleAmountSelect(option.value)}
                    sx={{ height: '100%', p: 4, textAlign: 'center' }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 500,
                        fontSize: '1.2rem',
                        color: selectedAmount === option.value ? '#e65100' : 'text.primary',
                      }}
                    >
                      {option.label}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 3, fontWeight: 400, fontFamily: 'serif', color: '#1a1a1a' }}
          >
            {t('paymentMethod')}
          </Typography>

          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              aria-label="payment-method"
              name="payment-method"
              value={paymentMethod}
              onChange={handlePaymentChange}
            >
              <Paper
                variant="outlined"
                sx={{
                  mb: 2,
                  p: 1,
                  borderColor: paymentMethod === 'credit_card' ? '#e65100' : 'divider',
                  bgcolor: paymentMethod === 'credit_card' ? 'rgba(230, 81, 0, 0.02)' : 'transparent',
                }}
              >
                <FormControlLabel
                  value="credit_card"
                  control={<Radio sx={{ color: '#e65100', '&.Mui-checked': { color: '#e65100' } }} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CreditCardIcon
                        color={paymentMethod === 'credit_card' ? 'primary' : 'action'}
                        sx={{ color: paymentMethod === 'credit_card' ? '#e65100' : 'inherit' }}
                      />
                      <Typography sx={{ fontWeight: paymentMethod === 'credit_card' ? 500 : 400 }}>
                        {t('creditCard')}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  borderColor: paymentMethod === 'cash' ? '#e65100' : 'divider',
                  bgcolor: paymentMethod === 'cash' ? 'rgba(230, 81, 0, 0.02)' : 'transparent',
                }}
              >
                <FormControlLabel
                  value="cash"
                  control={<Radio sx={{ color: '#e65100', '&.Mui-checked': { color: '#e65100' } }} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LocalAtmIcon
                        color={paymentMethod === 'cash' ? 'primary' : 'action'}
                        sx={{ color: paymentMethod === 'cash' ? '#e65100' : 'inherit' }}
                      />
                      <Typography sx={{ fontWeight: paymentMethod === 'cash' ? 500 : 400 }}>
                        {t('cash')}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Right Column: Summary & Info */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: 'solid 1px #c5c7cc8a',
              position: 'sticky',
              top: 20,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CardGiftcardIcon sx={{ fontSize: 60, color: '#e65100', mb: 2, opacity: 0.8 }} />
              <Typography variant="h6" gutterBottom sx={{ fontFamily: 'serif', color: '#263045fb' }}>
                {t('preview')}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 300, color: '#1a1a1a' }}>
                ֏{(selectedAmount || '0').toLocaleString()}
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={!selectedAmount}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: 'none',
                  bgcolor: '#2B3445',
                  color: 'white',
                  borderRadius: '8px',
                  '&:hover': { bgcolor: '#1a202c', boxShadow: 'none' },
                  '&:disabled': { bgcolor: '#ccc' },
                }}
              >
                {t('purchase')}
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: '#e65100' }}
              >
                {t('howToUse')}
              </Typography>
              <Stack spacing={1.5}>
                <Typography variant="body2" color="text.secondary">
                  {t('howToUsePoints.redeemable')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('howToUsePoints.noExpiration')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('howToUsePoints.promoCodes')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('howToUsePoints.delivery')}
                </Typography>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
