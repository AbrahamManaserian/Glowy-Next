'use client';

import { Box, Typography, Button } from '@mui/material';
import { Payment } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

export default function PaymentTab() {
  const t = useTranslations('UserPage.paymentTab');
  return (
    <>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        {t('paymentMethods')}
      </Typography>
      <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
        <Payment sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
        <Typography>{t('noMethods')}</Typography>
        <Button
          variant="outlined"
          startIcon={<Payment />}
          sx={{ mt: 2, borderRadius: '12px', color: '#E57373', borderColor: '#E57373' }}
        >
          {t('addCard')}
        </Button>
      </Box>
    </>
  );
}
