'use client';
import React from 'react';

import { useState, useContext, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
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
  Badge,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import Image from 'next/image';
import {
  Person,
  ShoppingBag,
  Favorite,
  Settings,
  Logout,
  Visibility,
  VisibilityOff,
  Warning,
  CheckCircle,
  Payment,
  Edit,
  CameraAlt,
  DeleteOutline,
} from '@mui/icons-material';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  updateProfile,
  updatePassword,
  sendEmailVerification,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/firebase';
import { GlobalContext } from '@/app/GlobalContext';
import WishlistItem from './WishlistItem';
import Resizer from 'react-image-file-resizer';
import ProfileTab from './ProfileTab';
import OrdersTab from './OrdersTab';
import WishlistTab from './WishlistTab';
import PaymentTab from './PaymentTab';
import SettingsTab from './SettingsTab';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserPageUi() {
  const {
    user,
    loading: authLoading,
    wishList,
    setWishList,
    wishListDetails,
    wishListLoading,
  } = useContext(GlobalContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const tabMap = ['profile', 'orders', 'wishlist', 'payment', 'settings'];
  const currentTabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(0);

  const handleClearWishlist = async () => {
    setWishList([]);
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { wishList: [] }, { merge: true });
      } catch (error) {
        console.error('Error clearing wishlist:', error);
      }
    } else {
      localStorage.setItem('fav', JSON.stringify([]));
    }
  };

  useEffect(() => {
    const tabIndex = tabMap.indexOf(currentTabParam);
    if (tabIndex !== -1) {
      setActiveTab(tabIndex);
    } else {
      setActiveTab(0);
    }
  }, [currentTabParam]);

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [emailMessage, setEmailMessage] = useState({ type: '', text: '' });
  const [verificationMessage, setVerificationMessage] = useState({ type: '', text: '' });

  const [orders, setOrders] = useState([]);

  // Track Order State (for unsigned users)
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackPhoneNumber, setTrackPhoneNumber] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!trackOrderId || !trackPhoneNumber) {
      setTrackError('Please enter both Order ID and Phone Number');
      return;
    }

    setTrackLoading(true);
    setTrackError('');
    setTrackedOrder(null);

    try {
      const q = query(collection(db, 'orders'), where('orderNumber', '==', trackOrderId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setTrackError('Order not found. Please check your Order ID.');
        setTrackLoading(false);
        return;
      }

      const orderDoc = querySnapshot.docs[0];
      const orderData = orderDoc.data();

      if (orderData.customer.phoneNumber !== trackPhoneNumber) {
        setTrackError('Phone number does not match this order.');
        setTrackLoading(false);
        return;
      }

      setTrackedOrder({ id: orderDoc.id, ...orderData });
    } catch (err) {
      console.error(err);
      setTrackError('Failed to fetch order details. Please try again.');
    } finally {
      setTrackLoading(false);
    }
  };

  useEffect(() => {
    // if (!authLoading && !user) {
    //   const tab = searchParams.get('tab');
    //   if (tab !== 'wishlist') {
    //     router.push('/auth/signin?redirect=/user');
    //   }
    // }
  }, [user, authLoading, router, searchParams]);

  // Profile State
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Email Change State
  const [newEmail, setNewEmail] = useState('');
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');

      // Fetch additional user data from Firestore
      const fetchUserData = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPhoneNumber(data.phoneNumber || '');
            setAddress(data.address || '');
            setBirthday(data.birthday || '');
            setGender(data.gender || '');

            // Sync email if it changed in Auth but not in Firestore
            if (user.email && data.email !== user.email) {
              await setDoc(docRef, { email: user.email }, { merge: true });
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid)
            // orderBy('createdAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersData);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      } else {
        // DEMO DATA: If no user or no orders found (for demonstration purposes)
        // In a real app, you might only show this if the user has no orders
        // setOrders([
        //   { id: '12345678-demo', createdAt: new Date(), status: 'Delivered', total: 120.50 },
        //   { id: '87654321-demo', createdAt: new Date(Date.now() - 86400000 * 5), status: 'Processing', total: 45.00 }
        // ]);
      }
    };
    fetchOrders();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    const newTab = tabMap[newValue];
    router.push(`${pathname}?tab=${newTab}`, { scroll: false });
    setMessage({ type: '', text: '' });
    setEmailMessage({ type: '', text: '' });
  };

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

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // Update Auth Profile
      if (displayName !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName });
      }

      // Update Firestore Profile
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          displayName,
          phoneNumber,
          address,
          birthday,
          gender,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

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

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password should be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setMessage({
          type: 'error',
          text: 'For security, please sign out and sign in again to change your password.',
        });
      } else {
        setMessage({ type: 'error', text: error.message });
      }
    }
    setLoading(false);
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      setEmailMessage({ type: 'error', text: 'Please enter a new email address.' });
      return;
    }
    if (!currentPasswordForEmail) {
      setEmailMessage({ type: 'error', text: 'Please enter your current password to confirm.' });
      return;
    }

    setLoading(true);
    setEmailMessage({ type: '', text: '' });

    try {
      // 1. Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPasswordForEmail);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // 2. Send verification email to the new address
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail.trim());

      setEmailMessage({
        type: 'success',
        text: `Verification email sent to ${newEmail}. Please check your inbox and click the link to finalize the change.`,
      });
      setNewEmail('');
      setCurrentPasswordForEmail('');
    } catch (error) {
      console.error('Error updating email:', error);
      if (error.code === 'auth/wrong-password') {
        setEmailMessage({ type: 'error', text: 'Incorrect password. Please try again.' });
      } else if (error.code === 'auth/email-already-in-use') {
        setEmailMessage({ type: 'error', text: 'This email is already in use by another account.' });
      } else if (error.code === 'auth/requires-recent-login') {
        setEmailMessage({ type: 'error', text: 'Please sign out and sign in again to perform this action.' });
      } else {
        setEmailMessage({ type: 'error', text: 'Failed to update email: ' + error.message });
      }
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#5D4037' }}>
        {user ? 'My Account' : 'Guest Services'}
      </Typography>

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
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: '16px', overflow: 'hidden' }}>
            {user && (
              <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#FAFAFA', borderBottom: '1px solid #E0E0E0' }}>
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
                <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ mt: 2 }}>
                  {displayName || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                  {user.email}
                </Typography>
              </Box>
            )}
            <Tabs
              orientation={isMobile ? 'horizontal' : 'vertical'}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  alignItems: isMobile ? 'center' : 'flex-start', // Aligns content to the left
                  justifyContent: isMobile ? 'center' : 'flex-start', // Ensures text starts from left
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 48,
                  pl: 3,
                },
                '& .Mui-selected': {
                  color: '#E57373',
                  bgcolor: 'rgba(229, 115, 115, 0.04)',
                  borderRight: isMobile ? 'none' : '3px solid #E57373',
                  borderBottom: isMobile ? '3px solid #E57373' : 'none',
                },
                '& .MuiTabs-indicator': { display: 'none' },
              }}
            >
              <Tab value={0} icon={<Person sx={{ mr: 1 }} />} iconPosition="start" label="Profile" />
              <Tab value={1} icon={<ShoppingBag sx={{ mr: 1 }} />} iconPosition="start" label="Orders" />
              <Tab value={2} icon={<Favorite sx={{ mr: 1 }} />} iconPosition="start" label="Wishlist" />
              {user && (
                <Tab value={3} icon={<Payment sx={{ mr: 1 }} />} iconPosition="start" label="Payment" />
              )}
              {user && (
                <Tab value={4} icon={<Settings sx={{ mr: 1 }} />} iconPosition="start" label="Settings" />
              )}
            </Tabs>
            <Divider />
            {user ? (
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  color="error"
                  startIcon={<Logout />}
                  onClick={handleSignOut}
                  sx={{ justifyContent: 'flex-start', pl: 2, textTransform: 'none' }}
                >
                  Sign Out
                </Button>
              </Box>
            ) : (
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => router.push('/auth/signin?redirect=/user?tab=wishlist')}
                  sx={{
                    justifyContent: 'center',
                    textTransform: 'none',
                    borderColor: '#E57373',
                    color: '#E57373',
                  }}
                >
                  Sign In
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Content Area */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Paper elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: '16px', minHeight: '400px' }}>
            {/* Profile Tab */}
            <TabPanel value={activeTab} index={0}>
              <ProfileTab
                user={user}
                displayName={displayName}
                setDisplayName={setDisplayName}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                address={address}
                setAddress={setAddress}
                birthday={birthday}
                setBirthday={setBirthday}
                gender={gender}
                setGender={setGender}
                photoURL={photoURL}
                setPhotoURL={setPhotoURL}
                message={message}
                setMessage={setMessage}
                loading={loading}
                setLoading={setLoading}
                imageLoading={imageLoading}
                setImageLoading={setImageLoading}
                handleUpdateProfile={handleUpdateProfile}
                handleSendVerification={handleSendVerification}
                verificationMessage={verificationMessage}
              />
            </TabPanel>

            {/* Orders Tab */}
            <TabPanel value={activeTab} index={1}>
              <OrdersTab
                user={user}
                orders={orders}
                trackOrderId={trackOrderId}
                setTrackOrderId={setTrackOrderId}
                trackPhoneNumber={trackPhoneNumber}
                setTrackPhoneNumber={setTrackPhoneNumber}
                trackLoading={trackLoading}
                setTrackLoading={setTrackLoading}
                trackError={trackError}
                setTrackError={setTrackError}
                trackedOrder={trackedOrder}
                setTrackedOrder={setTrackedOrder}
              />
            </TabPanel>

            {/* Wishlist Tab */}
            <TabPanel value={activeTab} index={2}>
              <WishlistTab
                user={user}
                wishList={wishList}
                setWishList={setWishList}
                wishListDetails={wishListDetails}
                wishListLoading={wishListLoading}
              />
            </TabPanel>

            {/* Payment Tab */}
            <TabPanel value={activeTab} index={3}>
              <PaymentTab />
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={activeTab} index={4}>
              <SettingsTab
                user={user}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                newEmail={newEmail}
                setNewEmail={setNewEmail}
                currentPasswordForEmail={currentPasswordForEmail}
                setCurrentPasswordForEmail={setCurrentPasswordForEmail}
                loading={loading}
                setLoading={setLoading}
                message={message}
                setMessage={setMessage}
                emailMessage={emailMessage}
                setEmailMessage={setEmailMessage}
                handleUpdateEmail={handleUpdateEmail}
              />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
