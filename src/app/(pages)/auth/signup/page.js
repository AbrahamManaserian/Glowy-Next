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
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        role: 'customer',
        provider: 'email',
        createdAt: serverTimestamp(),
      });

      await sendEmailVerification(user);
      alert('Account created! Please check your email to verify your account.');

      router.push(redirect);
    } catch (err) {
      let errorMessage = 'Failed to create an account.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      setError(errorMessage);
      console.error(err);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists
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
      setError('Failed to sign up with Google.');
      console.error(err);
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
              Create an account to get started.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSignUp}>
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
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
              Sign Up
            </Button>
          </Box>

          <Divider sx={{ my: 3, color: '#8D6E63', fontSize: '14px' }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={handleGoogleSignUp}
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
            Sign up with Google
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#8D6E63' }}>
              Already have an account?{' '}
              <Link
                href={`/auth/signin?redirect=${encodeURIComponent(redirect)}`}
                style={{ textDecoration: 'none', color: '#E57373', fontWeight: 'bold' }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
