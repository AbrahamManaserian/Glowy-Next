'use client';

import { useState } from 'react';
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
} from '@mui/material';
import { Google } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase';

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

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      router.push(redirect);
    } catch (err) {
      setError('Failed to sign in. Please check your email and password.');
      console.error(err);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address first to reset password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage('Password reset email sent! Check your inbox.');
      setError('');
    } catch (err) {
      setError('Failed to send reset email. Please check your email address.');
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
          name: user.displayName,
          email: user.email,
          role: 'customer',
          provider: 'google',
          createdAt: serverTimestamp(),
        });
      }

      router.push(redirect);
    } catch (err) {
      setError('Failed to sign in with Google.');
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
              {isResetMode
                ? 'Enter your email to receive a password reset link.'
                : 'Welcome back! Please sign in to continue.'}
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
              label="Email Address"
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
                label="Password"
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
              {loading ? 'Processing...' : isResetMode ? 'Reset Password' : 'Sign In'}
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
                {isResetMode ? 'Back to Sign In' : 'Forgot Password?'}
              </Typography>
            </Box>
          </Box>

          {!isResetMode && (
            <>
              <Divider sx={{ my: 3, color: '#8D6E63', fontSize: '14px' }}>OR</Divider>

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
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#8D6E63' }}>
                  Don&apos;t have an account?{' '}
                  <Link
                    href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`}
                    style={{ textDecoration: 'none', color: '#E57373', fontWeight: 'bold' }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
