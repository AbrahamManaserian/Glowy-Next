'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGlobalContext } from '@/app/GlobalContext';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Typography,
  IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const sidebarWidth = 240;

export default function AdminLayout({ children }) {
  const { user } = useGlobalContext();
  const router = useRouter();
  const pathname = usePathname();

  const [openProducts, setOpenProducts] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // useEffect(() => {
  //   if (!user) {
  //     router.push('/auth/signin?redirect=/admin');
  //     return;
  //   }
  //   user
  //     .getIdTokenResult()
  //     .then((result) => {
  //       if (!result.claims.admin) {
  //         router.push('/');
  //       }
  //     })
  //     .catch(() => {
  //       router.push('/');
  //     });
  // }, [user, router]);

  const handleProductsClick = () => {
    setOpenProducts(!openProducts);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigationItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/orders?status=pending' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Suppliers', icon: <BusinessIcon />, path: '/admin/suppliers' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/admin/analytics' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const productSubItems = [
    { text: 'Add Product', icon: <AddIcon />, path: '/admin/add-product' },
    { text: 'Edit Product', icon: <EditIcon />, path: '/admin/edit-product' },
    { text: 'Manage Products', icon: <InventoryIcon />, path: '/admin/manage-products' },
  ];

  return (
    <Box sx={{ display: 'flex', pt: '15px', flexWrap: 'nowrap', position: 'relative' }}>
      <Box
        sx={{
          width: { xs: sidebarOpen ? '100%' : 0, sm: sidebarWidth },
          position: { xs: 'absolute', sm: 'sticky' },
          top: 0,
          height: 'calc(100vh - 64px)',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          overflowY: 'auto',
          transform: { xs: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', sm: 'translateX(0)' },
          transition: 'transform 0.3s ease',
          zIndex: 1000,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Admin Panel
          </Typography>
          <IconButton onClick={() => setSidebarOpen(false)} sx={{ display: { xs: 'block', sm: 'none' } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => {
                  if (sidebarOpen) setSidebarOpen(false);

                  router.push(item.path);
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={handleProductsClick}>
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Products" />
              {openProducts ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openProducts} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {productSubItems.map((subItem) => (
                <ListItem key={subItem.text} disablePadding>
                  <ListItemButton
                    selected={pathname === subItem.path}
                    sx={{ pl: 4 }}
                    onClick={() => {
                      setSidebarOpen(false);
                      if (sidebarOpen) setSidebarOpen(false);
                      router.push(subItem.path);
                    }}
                  >
                    <ListItemIcon>{subItem.icon}</ListItemIcon>
                    <ListItemText primary={subItem.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </Box>

      <Box
        // component="main"
        sx={{
          flexGrow: 1,
          overflow: 'scroll',
          // m: { xs: '50px 10px', sm: '90px 35px' },
        }}
      >
        <IconButton
          onClick={handleSidebarToggle}
          sx={{ display: { sm: 'none' }, position: 'sticky', top: '0px', bgcolor: 'GrayText', ml: '10px' }}
        >
          <MenuIcon />
        </IconButton>
        {children}
      </Box>
    </Box>
  );
}
