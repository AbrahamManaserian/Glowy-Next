'use client';

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
} from '@mui/icons-material';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { updateProfile, updatePassword, sendEmailVerification, signOut } from 'firebase/auth';
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
import WishlistItem from './_components/WishlistItem';

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

export default function UserPage() {
  const {
    user,
    loading: authLoading,
    wishList,
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

  useEffect(() => {
    const tabIndex = tabMap.indexOf(currentTabParam);
    if (tabIndex !== -1) {
      setActiveTab(tabIndex);
    } else {
      setActiveTab(0);
    }
  }, [currentTabParam]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!authLoading && !user) {
      const tab = searchParams.get('tab');
      if (tab !== 'wishlist') {
        router.push('/auth/signin?redirect=/user');
      }
    }
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
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
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
  };

  const handleAvatarChange = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setLoading(true);
      try {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, file);
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
      setLoading(false);
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
    try {
      await sendEmailVerification(auth.currentUser);
      setMessage({ type: 'success', text: 'Verification email sent! Please check your inbox.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send verification email. Try again later.' });
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

  if (!user && activeTab !== 2) {
    return null; // Or a loading spinner, but the useEffect will redirect
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#5D4037' }}>
        {user ? 'My Account' : 'My Wishlist'}
      </Typography>

      {/* Email Verification Banner */}
      {user && !user.emailVerified && (
        <Alert
          severity="warning"
          sx={{ mb: 4, borderRadius: '12px' }}
          action={
            <Button color="inherit" size="small" onClick={handleSendVerification} disabled={loading}>
              Verify Email
            </Button>
          }
        >
          Your email address is not verified. Please verify it to secure your account.
        </Alert>
      )}

      {message.text && (
        <Alert
          severity={message.type}
          sx={{ mb: 4, borderRadius: '12px' }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
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
                  <Avatar
                    src={photoURL}
                    alt={displayName}
                    sx={{ width: 80, height: 80, bgcolor: '#E57373', fontSize: '2rem' }}
                  >
                    {displayName ? displayName[0].toUpperCase() : <Person />}
                  </Avatar>
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
              {user && (
                <Tab value={0} icon={<Person sx={{ mr: 1 }} />} iconPosition="start" label="Profile" />
              )}
              {user && (
                <Tab value={1} icon={<ShoppingBag sx={{ mr: 1 }} />} iconPosition="start" label="Orders" />
              )}
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
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Personal Information
              </Typography>
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
            </TabPanel>

            {/* Orders Tab */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                My Orders
              </Typography>
              {orders.length > 0 ? (
                <Grid container spacing={2}>
                  {orders.map((order) => (
                    <Grid size={{ xs: 12 }} key={order.id}>
                      <Paper sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: '12px' }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Order #{order.id.slice(0, 12)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Date:{' '}
                              {order.createdAt?.toDate
                                ? order.createdAt.toDate().toLocaleDateString()
                                : new Date(order.createdAt).toLocaleDateString()}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                              {order.items &&
                                order.items.slice(0, 4).map((item, idx) => (
                                  <Box
                                    key={idx}
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      position: 'relative',
                                      borderRadius: '4px',
                                      overflow: 'hidden',
                                      border: '1px solid #eee',
                                    }}
                                  >
                                    {/* Use a placeholder if no image, or the actual image */}
                                    <Image
                                      src={item.img || '/images/cosmetic/placeholder.jpg'}
                                      alt="Product"
                                      fill
                                      style={{ objectFit: 'cover' }}
                                    />
                                  </Box>
                                ))}
                              {order.items && order.items.length > 4 && (
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: '#f5f5f5',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    color: '#757575',
                                  }}
                                >
                                  +{order.items.length - 4}
                                </Box>
                              )}
                            </Box>
                            <Box sx={{ mt: 1 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  bgcolor:
                                    order.status === 'Delivered'
                                      ? '#E8F5E9'
                                      : order.status === 'Shipped'
                                      ? '#E3F2FD'
                                      : '#FFF3E0',
                                  color:
                                    order.status === 'Delivered'
                                      ? '#2E7D32'
                                      : order.status === 'Shipped'
                                      ? '#1565C0'
                                      : '#EF6C00',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: '6px',
                                  fontWeight: 600,
                                }}
                              >
                                {order.status}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid
                            size={{ xs: 12, sm: 6 }}
                            sx={{ textAlign: { sm: 'right' }, mt: { xs: 2, sm: 0 } }}
                          >
                            <Typography variant="h6" color="#E57373" fontWeight="bold">
                              ֏{order.total?.toLocaleString()}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                mt: 1,
                                borderRadius: '8px',
                                textTransform: 'none',
                                borderColor: '#E0E0E0',
                                color: '#757575',
                              }}
                            >
                              View Details
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                  <ShoppingBag sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                  <Typography>No orders found yet.</Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2, borderRadius: '12px', color: '#E57373', borderColor: '#E57373' }}
                    onClick={() => router.push('/')}
                  >
                    Start Shopping
                  </Button>
                </Box>
              )}
            </TabPanel>

            {/* Wishlist Tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                My Wishlist
              </Typography>
              {wishListLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : wishListDetails.length > 0 ? (
                <Grid container spacing={2}>
                  {wishListDetails.map((item) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={item.id}>
                      <WishlistItem item={item} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                  <Favorite sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                  <Typography>Your wishlist is empty.</Typography>
                </Box>
              )}
            </TabPanel>

            {/* Payment Tab */}
            <TabPanel value={activeTab} index={3}>
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
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={activeTab} index={4}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Security Settings
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Change Password
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Ensure your account is using a long, random password to stay secure.
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="New Password"
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
                      label="Confirm New Password"
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
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
