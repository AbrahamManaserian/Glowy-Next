'use client';

import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Alert,
  Grid,
  InputAdornment,
  MenuItem,
  Badge,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Person, Warning, CheckCircle, CameraAlt } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

export default function ProfileTab({
  user,
  displayName,
  setDisplayName,
  phoneNumber,
  setPhoneNumber,
  address,
  setAddress,
  birthday,
  setBirthday,
  gender,
  setGender,
  message,
  setMessage,
  loading,
  handleUpdateProfile,
  photoURL,
  imageLoading,
  handleAvatarChange,
}) {
  const t = useTranslations('UserPage.profileTab');

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',

          textAlign: 'center',
        }}
      >
        <Avatar sx={{ width: 48, height: 48, bgcolor: '#E57373', mb: 1.5 }}>
          <Person fontSize="small" />
        </Avatar>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ fontSize: '1.1rem' }}>
          {t('signInTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 320, fontSize: '0.95rem' }}>
          {t('signInDesc')}
        </Typography>
        <Button
          variant="contained"
          href="/auth/signin"
          sx={{
            bgcolor: '#E57373',
            borderRadius: '10px',
            textTransform: 'none',
            px: 3,
            py: 0.7,
            fontSize: '0.95rem',
            minWidth: 120,
            '&:hover': { bgcolor: '#EF5350' },
          }}
        >
          {t('signInRegister')}
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        {t('personalInfo')}
      </Typography>

      {user && !user.providerData.some((p) => p.providerId === 'password') && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>
          {t('googleSignInAlert')}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <IconButton
              component="label"
              disabled={imageLoading}
              sx={{
                bgcolor: '#E57373',
                color: 'white',
                width: 32,
                height: 32,
                '&:hover': { bgcolor: '#EF5350' },
              }}
            >
              <CameraAlt sx={{ fontSize: 18 }} />
              <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
            </IconButton>
          }
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={photoURL}
              alt={displayName}
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#E57373',
                fontSize: '2rem',
                opacity: imageLoading ? 0.5 : 1,
              }}
            >
              {displayName ? displayName[0].toUpperCase() : <Person />}
            </Avatar>
            {imageLoading && (
              <CircularProgress
                size={40}
                sx={{
                  color: '#E57373',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-20px',
                  marginLeft: '-20px',
                  zIndex: 1,
                }}
              />
            )}
          </Box>
        </Badge>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={t('displayName')}
            fullWidth
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={t('email')}
            fullWidth
            value={user?.email || ''}
            disabled
            variant="outlined"
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#F5F5F5' } }}
            InputProps={{
              endAdornment: user?.emailVerified ? (
                <InputAdornment position="end">
                  <CheckCircle color="success" fontSize="small" />
                </InputAdornment>
              ) : (
                <InputAdornment position="end">
                  <Warning color="warning" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={t('phone')}
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            variant="outlined"
            size="small"
            type="number"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={t('birthday')}
            type="date"
            fullWidth
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label={t('gender')}
            fullWidth
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          >
            <MenuItem value="male">{t('male')}</MenuItem>
            <MenuItem value="female">{t('female')}</MenuItem>
            <MenuItem value="other">{t('other')}</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label={t('shippingAddress')}
            fullWidth
            multiline
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            onClick={handleUpdateProfile}
            disabled={loading}
            sx={{
              bgcolor: '#E57373',
              borderRadius: '12px',
              textTransform: 'none',
              px: 4,
              '&:hover': { bgcolor: '#EF5350' },
            }}
          >
            {loading ? t('saving') : t('saveChanges')}
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
    </>
  );
}
