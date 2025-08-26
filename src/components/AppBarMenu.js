'use client';

import { Badge, Drawer, Grid, Typography } from '@mui/material';
import { FavoriteIcon, ShoppingBasketIcon, UserAvatar } from './icons';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import styled from '@emotion/styled';
import { useState } from 'react';

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

function BarMenu() {
  return (
    <Grid
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ flexWrap: 'nowrap', overflow: 'hidden' }}
      item
      container
      alignItems="flex-start"
    >
      <Link className="bar-link" href="/makeup">
        Makeup
      </Link>
      <Link className="bar-link" href="/fragrance">
        Fragrance
      </Link>
      <Link className="bar-link" href="/sale">
        Sale
      </Link>
      <Link className="bar-link" href="/gifts">
        Gifts
      </Link>
      <Link className="bar-link" href="/about">
        About
      </Link>
    </Grid>
  );
}

function DrawerMenu() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <>
      <MenuIcon sx={{ display: { xs: 'block', sm: 'none' } }} onClick={toggleDrawer(true)} />

      <Drawer
        sx={{ '& .MuiDrawer-paper': { width: '100%', p: '10px' } }}
        open={open}
        onClose={toggleDrawer(false)}
      >
        <CloseIcon sx={{ position: 'fixed', top: '10px', right: '10px' }} onClick={toggleDrawer(false)} />
        <BarMenu />
      </Drawer>
    </>
  );
}

export default function AppBarMenu() {
  return (
    <Grid
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'white',
        zIndex: 100,
        p: { xs: '10px', sm: '15px 45px' },
        boxShadow: 'rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset',
        flexWrap: 'nowrap',
        overflow: 'hidden',
      }}
      item
      xs={12}
      container
      justifyContent="space-between"
      alignItems="center"
    >
      <Link href="/" style={{ textDecoration: 'none', order: 1 }}>
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
      <DrawerMenu />
      <Grid item container sx={{ display: { xs: 'none', sm: 'flex' }, order: 2 }}>
        <BarMenu />
      </Grid>

      <Grid sx={{ order: 3, flexWrap: 'nowrap' }} item xs={12} container alignItems="center">
        <Link href="/favorite" style={{ marginRight: '25px' }}>
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
    </Grid>
  );
}
