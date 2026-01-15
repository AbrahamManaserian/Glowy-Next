'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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

  const pathname = usePathname();

  const [openProducts, setOpenProducts] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleProductsClick = () => {
    setOpenProducts(!openProducts);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigationItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/orders?status=pending' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin' },
    { text: 'Suppliers', icon: <BusinessIcon />, path: '/admin/manage-suppliers' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/admin' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin' },
  ];

  const productSubItems = [
    { text: 'Add Product', icon: <AddIcon />, path: '/admin/add-product' },
    { text: 'Edit Product', icon: <EditIcon />, path: '/admin/edit-product' },
  ];

  return (
    <Box sx={{ display: 'flex', pt: '15px', flexWrap: 'nowrap', position: 'relative' }}>
      <Box
        sx={{
          width: { xs: sidebarOpen ? '100%' : 0, sm: sidebarOpen ? '100%' : 0, md: sidebarWidth },

          position: { xs: 'absolute', sm: 'sticky' },
          top: 0,
          height: 'calc(100vh - 64px)',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          overflowY: 'auto',
          transform: {
            xs: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            sm: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            md: 'translateX(0)',
          },
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
              <Link
                href={item.path}
                style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'block' }}
              >
                <ListItemButton
                  selected={pathname === item.path.split('?')[0]}
                  onClick={() => {
                    if (sidebarOpen) setSidebarOpen(false);
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
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
                  <Link
                    href={subItem.path}
                    style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'block' }}
                  >
                    <ListItemButton
                      selected={pathname === subItem.path}
                      sx={{ pl: 4 }}
                      onClick={() => {
                        setSidebarOpen(false);
                        if (sidebarOpen) setSidebarOpen(false);
                      }}
                    >
                      <ListItemIcon>{subItem.icon}</ListItemIcon>
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                  </Link>
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
          sx={{ display: { md: 'none' }, position: 'sticky', top: '0px', bgcolor: 'GrayText', ml: '10px' }}
        >
          <MenuIcon />
        </IconButton>
        {children}
      </Box>
    </Box>
  );
}
