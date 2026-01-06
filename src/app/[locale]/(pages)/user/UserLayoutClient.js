'use client';

import { useContext, useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Alert, Button, CircularProgress } from '@mui/material';
import { GlobalContext } from '@/app/GlobalContext';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@/firebase';
import UserSidebar from './_components/UserSidebar';
import { useTranslations } from 'next-intl';

export default function UserLayoutClient({ children }) {
  const t = useTranslations('Common.user');
  const { user, loading: authLoading, initializeData } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    initializeData();
  }, []);

  const handleSendVerification = async () => {
    setLoading(true);
    setVerificationMessage({ type: '', text: '' });
    try {
      await sendEmailVerification(auth.currentUser);
      setVerificationMessage({ type: 'success', text: 'Verification email sent! Please check your inbox.' });
    } catch (error) {
      setVerificationMessage({ type: 'error', text: 'Failed to send verification email. Try again later.' });
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#E57373' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#5D4037' }}>
        {user ? t('myAccount') : 'Guest Services'}
      </Typography> */}

      {/* Email Verification Banner */}
      {user && !user.emailVerified && (
        <Box sx={{ mb: 4 }}>
          <Alert
            severity="warning"
            sx={{ borderRadius: '12px' }}
            action={
              <Button color="inherit" size="small" onClick={handleSendVerification} disabled={loading}>
                Verify Email
              </Button>
            }
          >
            Your email address is not verified. Please verify it to secure your account.
          </Alert>
          {verificationMessage.text && (
            <Alert severity={verificationMessage.type} sx={{ mt: 1, borderRadius: '12px' }}>
              {verificationMessage.text}
            </Alert>
          )}
        </Box>
      )}

      <Grid container spacing={4}>
        {/* Sidebar Navigation */}
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <UserSidebar />
        </Grid>

        {/* Content Area */}
        <Grid size={{ xs: 12, md: 9 }}>{children}</Grid>
      </Grid>
    </Container>
  );
}
