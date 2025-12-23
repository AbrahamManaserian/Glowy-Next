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
} from '@mui/material';
import { Person, Warning, CheckCircle } from '@mui/icons-material';

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
}) {
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
          Sign in to your profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 320, fontSize: '0.95rem' }}>
          Sign in to access your personal information, manage your orders, and view your wishlist.
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
          Sign In / Register
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Personal Information
      </Typography>

      {user && !user.providerData.some((p) => p.providerId === 'password') && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>
          You signed in with Google. To enable email/password sign-in, please set a password in the Settings
          tab.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Display Name"
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
            label="Email Address"
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
            label="Phone Number"
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
            label="Birthday"
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
            label="Gender"
            fullWidth
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Shipping Address"
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
            {loading ? 'Saving...' : 'Save Changes'}
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
