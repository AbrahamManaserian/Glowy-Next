'use client';

import { useContext, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Divider,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { CheckCircleOutline, Google } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { Link } from '@/i18n/routing';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { GlobalContext } from '@/app/GlobalContext';
import { useTranslations } from 'next-intl';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { setUserData, user } = useContext(GlobalContext);
  const t = useTranslations('Auth');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      setLoading(false);
      router.push(redirect);
    } catch (err) {
      setError(t('errors.signInFailed'));
      console.error(err);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setError(t('errors.enterEmail'));
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage(t('errors.resetSent'));
      setError('');
    } catch (err) {
      setError(t('errors.resetFailed'));
      console.error(err);
    }
  };

  const toggleResetMode = () => {
    setIsResetMode(!isResetMode);
    setError('');
    setMessage('');
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists (in case they sign in with Google for the first time here)
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: 'customer',
          provider: 'google',
          firstShopping: true,
          createdAt: serverTimestamp(),
        });
        setUserData({
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: 'customer',
          provider: 'google',
          firstShopping: true,
          createdAt: serverTimestamp(),
        });
      }

      setLoading(false);
      router.push(redirect);
    } catch (err) {
      setError(t('errors.signInFailed'));
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#FFF8F6',
        p: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', p: 0 }}>
        {!user ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              width: '100%',
              maxWidth: '450px',
              borderRadius: '20px',
              boxShadow: '0px 10px 40px rgba(229, 115, 115, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: '#5D4037',
                  mb: 1,
                }}
              >
                GLOWY
              </Typography>
              <Typography variant="body2" sx={{ color: '#8D6E63' }}>
                {isResetMode ? t('errors.enterEmail') : t('signInSubtitle')}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                {error}
              </Alert>
            )}
            {message && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
                {message}
              </Alert>
            )}

            <Box component="form" onSubmit={isResetMode ? handleForgotPassword : handleSignIn}>
              <TextField
                label={t('email')}
                fullWidth
                margin="normal"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#FAFAFA',
                    '&.Mui-focused fieldset': {
                      borderColor: '#E57373',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#E57373',
                  },
                }}
              />
              {!isResetMode && (
                <TextField
                  label={t('password')}
                  fullWidth
                  margin="normal"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      bgcolor: '#FAFAFA',
                      '&.Mui-focused fieldset': {
                        borderColor: '#E57373',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#E57373',
                    },
                  }}
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
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontWeight: 'bold',
                  bgcolor: '#E57373',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '16px',
                  boxShadow: '0 4px 12px rgba(229, 115, 115, 0.4)',
                  '&:hover': {
                    bgcolor: '#EF5350',
                    boxShadow: '0 6px 16px rgba(229, 115, 115, 0.6)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : isResetMode ? (
                  t('resetPassword')
                ) : (
                  t('signInButton')
                )}
              </Button>

              <Box sx={{ textAlign: 'right', mt: -1, mb: 2 }}>
                <Typography
                  variant="body2"
                  onClick={toggleResetMode}
                  sx={{
                    color: '#E57373',
                    cursor: 'pointer',
                    fontWeight: 500,
                    display: 'inline-block',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {isResetMode ? t('backToSignIn') : t('forgotPassword')}
                </Typography>
              </Box>
            </Box>

            {!isResetMode && (
              <>
                <Divider sx={{ my: 3, color: '#8D6E63', fontSize: '14px' }}>{t('or')}</Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Google />}
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  sx={{
                    mb: 3,
                    py: 1.5,
                    borderRadius: '12px',
                    textTransform: 'none',
                    borderColor: '#E0E0E0',
                    color: '#5D4037',
                    '&:hover': {
                      borderColor: '#E57373',
                      bgcolor: 'rgba(229, 115, 115, 0.04)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={20} sx={{ color: '#5D4037' }} /> : t('signInGoogle')}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#8D6E63' }}>
                    {t('noAccount')}{' '}
                    <Link
                      href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`}
                      style={{ textDecoration: 'none', color: '#E57373', fontWeight: 'bold' }}
                    >
                      {t('signUpLink')}
                    </Link>
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              animation: 'fadeIn 0.5s ease-in-out',
              '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'scale(0.9)' },
                '100%': { opacity: 1, transform: 'scale(1)' },
              },
            }}
          >
            <CheckCircleOutline sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2E7D32', mb: 1 }}>
              {t('successTitle')}
            </Typography>
            <Typography variant="body1" sx={{ color: '#5D4037', textAlign: 'center', mb: 3 }}>
              {t('alreadySignedIn')}
            </Typography>
            <Link href="/shop" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#E57373',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: '#EF5350',
                  },
                }}
              >
                {t('goShopping')}
              </Button>
            </Link>
          </Box>
        )}
      </Container>
    </Box>
  );
}
