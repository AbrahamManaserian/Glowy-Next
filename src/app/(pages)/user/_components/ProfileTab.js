'use client';

import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Alert,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  InputAdornment,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Person, Visibility, VisibilityOff, Warning, CheckCircle, CameraAlt } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { updateProfile, sendEmailVerification, verifyBeforeUpdateEmail } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/firebase';
import Resizer from 'react-image-file-resizer';

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
  photoURL,
  setPhotoURL,
  message,
  setMessage,
  loading,
  setLoading,
  imageLoading,
  setImageLoading,
  handleUpdateProfile,
  handleSendVerification,
  verificationMessage,
}) {
  const router = useRouter();

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        500, // maxWidth
        500, // maxHeight
        'JPEG', // compressFormat
        80, // quality
        0, // rotation
        (uri) => {
          resolve(uri);
        },
        'blob' // outputType
      );
    });

  const handleAvatarChange = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageLoading(true);
      try {
        const resizedImage = await resizeFile(file);
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, resizedImage);
        const downloadURL = await getDownloadURL(storageRef);

        await updateProfile(auth.currentUser, { photoURL: downloadURL });
        setPhotoURL(downloadURL);

        // Also update in Firestore
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { photoURL: downloadURL }, { merge: true });

        setMessage({ type: 'success', text: 'Profile picture updated!' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to upload image: ' + error.message });
      }
      setImageLoading(false);
    }
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Avatar sx={{ width: 80, height: 80, bgcolor: '#E57373', mb: 2 }}>
          <Person fontSize="large" />
        </Avatar>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Sign in to your profile
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
          Sign in to access your personal information, manage your orders, and view your wishlist.
        </Typography>
        <Button
          variant="contained"
          href="/auth/signin"
          sx={{
            bgcolor: '#E57373',
            borderRadius: '12px',
            textTransform: 'none',
            px: 6,
            py: 1.5,
            fontSize: '1.1rem',
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
          You signed in with Google. To enable email/password sign-in, please set a password in the{' '}
          <strong style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setActiveTab(4)}>
            Settings
          </strong>{' '}
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
