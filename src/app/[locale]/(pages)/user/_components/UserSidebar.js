'use client';

import { Box, Typography, Tabs, Tab, Button, Paper, Divider, useMediaQuery, useTheme } from '@mui/material';
import { Person, ShoppingBag, Favorite, Settings, Logout, Payment } from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useGlobalContext } from '@/app/GlobalContext';
import Link from 'next/link';

export default function UserSidebar() {
  const t = useTranslations('UserPage');
  const { user, userData } = useGlobalContext();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Logic to determine active tab based on pathname
  // /user -> 0
  // /user/orders -> 1
  // /user/wishlist -> 2
  // /user/payment -> 3
  // /user/settings -> 4

  let activeTab = 0;
  if (pathname.includes('/orders')) activeTab = 1;
  else if (pathname.includes('/wishlist')) activeTab = 2;
  else if (pathname.includes('/payment')) activeTab = 3;
  else if (pathname.includes('/settings')) activeTab = 4;
  else if (pathname.endsWith('/user') || pathname.endsWith('/user/')) activeTab = 0;

  const handleTabChange = (event, newValue) => {
    // Navigation is handled by Link in Tab, but if we need imperative:
    // This is mainly for the UI state of the Tabs component
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { label: t('tabs.profile'), icon: <Person sx={{ mr: 1 }} />, href: '/user' },
    { label: t('tabs.orders'), icon: <ShoppingBag sx={{ mr: 1 }} />, href: '/user/orders' },
    { label: t('tabs.wishlist'), icon: <Favorite sx={{ mr: 1 }} />, href: '/user/wishlist' },
    { label: t('tabs.payment'), icon: <Payment sx={{ mr: 1 }} />, href: '/user/payment', requiresUser: true },
    {
      label: t('tabs.settings'),
      icon: <Settings sx={{ mr: 1 }} />,
      href: '/user/settings',
      requiresUser: true,
    },
  ];

  const displayName = userData?.fullName || user?.displayName || 'User';

  return (
    <Paper elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: '16px', overflow: 'hidden' }}>
      {user && (
        <Box sx={{ p: '10px', textAlign: 'center', bgcolor: '#FAFAFA', borderBottom: '1px solid #E0E0E0' }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" noWrap>
            {userData?.email || user?.email}
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
            alignItems: isMobile ? 'center' : 'flex-start',
            justifyContent: isMobile ? 'center' : 'flex-start',
            textTransform: 'none',
            fontWeight: 500,
            minHeight: 40,
            pl: 2,
            textDecoration: 'none',
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
        {menuItems.map((item, index) => {
          if (item.requiresUser && !user) return null;
          return (
            <Tab
              key={index}
              label={item.label}
              icon={item.icon}
              iconPosition="start"
              component={Link}
              href={item.href}
              value={index}
              sx={{ p: 2 }}
            />
          );
        })}
      </Tabs>
      <Divider />
      {user ? (
        <Box sx={{ p: 1.5 }}>
          <Button
            fullWidth
            color="error"
            startIcon={<Logout />}
            onClick={handleSignOut}
            sx={{ justifyContent: 'flex-start', pl: 2, textTransform: 'none' }}
          >
            {t('signOut')}
          </Button>
        </Box>
      ) : (
        <Box sx={{ p: 1.5 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => router.push('/auth/signin?redirect=/user')}
            sx={{
              justifyContent: 'center',
              textTransform: 'none',
              borderColor: '#E57373',
              color: '#E57373',
            }}
          >
            {t('signIn')}
          </Button>
        </Box>
      )}
    </Paper>
  );
}
