'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { updatePassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useTranslations } from 'next-intl';

export default function SettingsTab({
  user,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  newEmail,
  setNewEmail,
  currentPasswordForEmail,
  setCurrentPasswordForEmail,
  loading,
  setLoading,
  message,
  setMessage,
  emailMessage,
  setEmailMessage,
  handleUpdateEmail,
}) {
  const t = useTranslations('UserPage.settingsTab');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: t('messages.passwordMismatch') });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: t('messages.passwordLength') });
      return;
    }

    setLoading(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      setMessage({ type: 'success', text: t('messages.passwordUpdated') });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setMessage({
          type: 'error',
          text: t('messages.reauthRequired'),
        });
      } else {
        setMessage({ type: 'error', text: error.message });
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        {t('accountSettings')}
      </Typography>

      {/* Change Email Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          {t('changeEmail')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('changeEmailDesc')}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={t('newEmail')}
              type="email"
              fullWidth
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={t('currentPassword')}
              type={showEmailPassword ? 'text' : 'password'}
              fullWidth
              value={currentPasswordForEmail}
              onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowEmailPassword(!showEmailPassword)} edge="end">
                      {showEmailPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              variant="outlined"
              onClick={handleUpdateEmail}
              disabled={loading}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                px: 4,
                borderColor: '#E57373',
                color: '#E57373',
                '&:hover': { borderColor: '#EF5350', bgcolor: 'rgba(229, 115, 115, 0.04)' },
              }}
            >
              {loading ? 'Processing...' : 'Update Email'}
            </Button>
          </Grid>
        </Grid>
        {emailMessage.text && (
          <Alert
            severity={emailMessage.type}
            sx={{ mt: 3, borderRadius: '12px' }}
            onClose={() => setEmailMessage({ type: '', text: '' })}
          >
            {emailMessage.text}
          </Alert>
        )}
      </Box>

      <Divider sx={{ mb: 5 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          {user && !user.providerData.some((p) => p.providerId === 'password')
            ? t('setPassword')
            : t('changePassword')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('changePasswordDesc')}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={t('newPassword')}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={t('confirmPassword')}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              onClick={handleUpdatePassword}
              disabled={loading}
              sx={{
                bgcolor: '#E57373',
                borderRadius: '12px',
                textTransform: 'none',
                px: 4,
                '&:hover': { bgcolor: '#EF5350' },
              }}
            >
              {loading ? t('saving') : t('updatePassword')}
            </Button>
          </Grid>
        </Grid>
        {message.text && (
          <Alert
            severity={message.type}
            sx={{ mt: 3, borderRadius: '12px' }}
            onClose={() => setMessage({ type: '', text: '' })}
          >
            {message.text}
          </Alert>
        )}
      </Box>
    </>
  );
}
