'use client';

import { Box, Typography, Button } from '@mui/material';
import { Payment } from '@mui/icons-material';

export default function PaymentTab() {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Payment Methods
      </Typography>
      <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
        <Payment sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
        <Typography>No payment methods saved.</Typography>
        <Button
          variant="outlined"
          startIcon={<Payment />}
          sx={{ mt: 2, borderRadius: '12px', color: '#E57373', borderColor: '#E57373' }}
        >
          Add New Card
        </Button>
      </Box>
    </>
  );
}
