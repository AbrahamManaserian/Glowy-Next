'use client';

import {
  Badge,
  Box,
  Collapse,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import { FavoriteIcon, SearchIcon, ShoppingBasketIcon, UserAvatar } from './icons';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -1,
    top: 0,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
    backgroundColor: '#f44336',
    color: 'white',
    height: '20px',
    width: '20px',
    borderRadius: '13px',
  },
}));
const StyledBadgeFavorite = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -4,
    top: -1,
    border: `2px solid white`,
    padding: '0 4px',
    backgroundColor: '#3794b9ff',
    color: 'white',
    height: '20px',
    width: '20px',
    borderRadius: '13px',
  },
}));

function LogoHome() {
  return (
    <Link href="/" style={{ textDecoration: 'none' }}>
      <Typography
        sx={{
          // height: '24px',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#D23F57',
          color: 'white',
          fontSize: '17px',
          fontFamily: 'Roboto, sans-serif', // ✅ make sure fallback is same
          px: '12px',
          fontWeight: 700,
          letterSpacing: '1px',
          // mr: '10px',
        }}
      >
        GLOWY
      </Typography>
    </Link>
  );
}

const navObj = { makeup: 'Makeup', fragrance: 'Fragrance', sale: 'Sale', gifts: 'Gifts', about: 'About' };

function DrawerMenu() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <>
      <MenuIcon sx={{ display: { xs: 'block', sm: 'none' }, mr: '9px' }} onClick={toggleDrawer(true)} />

      <Drawer sx={{ '& .MuiDrawer-paper': { width: '100%' } }} open={open} onClose={toggleDrawer(false)}>
        <Grid onClick={toggleDrawer(false)} item xs={12} container direction="column" sx={{ p: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '15px' }}>
            <LogoHome />
            <CloseIcon sx={{ color: '#8a8c8dff' }} onClick={toggleDrawer(false)} />
          </Box>
          <List sx={{ pl: '10px' }}>
            {Object.keys(navObj).map((key) => {
              return (
                <ListItem key={key} disablePadding>
                  <ListItemButton sx={{ p: 0 }}>
                    <Link style={{ width: '100%' }} className="bar-link" href={`/${key}`}>
                      {navObj[key]}
                    </Link>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Divider />
        </Grid>
      </Drawer>
    </>
  );
}

export default function AppBarMenu() {
  const [openSearch, setOpenSearch] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Grid
      sx={{
        position: 'sticky',
        top: isSticky ? 0 : -300, // 👈 offset sticky start
        bgcolor: 'white',
        zIndex: 1200,
        p: { xs: '10px', sm: '19px 45px' },
        transition: 'top 0.8s ease, box-shadow 0.8s ease',
        boxShadow: isSticky ? 'rgba(0, 0, 0, 0.1) 0px 2px 6px' : 'none',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        width: '100%',
      }}
      item
      xs={12}
      container
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item container sx={{ order: 1 }}>
        <DrawerMenu />
        <LogoHome />
      </Grid>
      <Grid item container sx={{ display: { xs: 'none', sm: 'flex' }, order: 2 }}>
        {Object.keys(navObj).map((key) => {
          return (
            <Link key={key} className="bar-link" href={`/${key}`}>
              {navObj[key]}
            </Link>
          );
        })}
      </Grid>

      <Grid sx={{ order: 3, flexWrap: 'nowrap' }} item xs={12} container alignItems="center">
        <Box sx={{ display: { xs: 'block', sm: 'none' } }} onClick={() => setOpenSearch(!openSearch)}>
          <SearchIcon />
        </Box>
        <Link href="/favorite" style={{ margin: '0 25px 0 10px' }}>
          <StyledBadgeFavorite badgeContent={1}>
            <FavoriteIcon size={21} />
          </StyledBadgeFavorite>
        </Link>
        <Link href="/cart">
          <StyledBadge badgeContent={2}>
            <ShoppingBasketIcon />
          </StyledBadge>
        </Link>
        <Link href="/user" style={{ marginLeft: '25px' }}>
          <UserAvatar />
        </Link>
      </Grid>
      {/* <Collapse sx={{ width: '100%', order: 4 }} in={openSearch} timeout="auto" unmountOnExit>
        <Grid
          sx={
            {
              // boxShadow: 'rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset',
            }
          }
          item
          xs={12}
        >
          asd
        </Grid>
      </Collapse> */}
    </Grid>
  );
}
