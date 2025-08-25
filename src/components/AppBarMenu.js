'use client';

import { Badge, Box, Button, Grid, Typography } from '@mui/material';
import { FavoriteIcon, LogoIcon, ShoppingBasketIcon, UserAvatar } from './icons';
import useGetWindowDimensions from '@/hooks/useGetWindowSize';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Link from 'next/link';
import styled from '@emotion/styled';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 0,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
    backgroundColor: '#f44336',
    color: 'white',
    height: '25px',
    width: '25px',
    borderRadius: '13px',
  },
}));

export default function AppBarMenu() {
  const windowDimensions = useGetWindowDimensions();
  if (!windowDimensions)
    return (
      <Grid
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'white',
          zIndex: 100,
          p: '15px 45px',
          minHeight: '50px',
          boxShadow: 'rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset',
        }}
        item
        xs={12}
        container
        justifyContent="space-between"
        alignItems="center"
      ></Grid>
    );
  return (
    <Grid
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'white',
        zIndex: 100,
        p: windowDimensions.width < 700 ? '15px 10px' : '15px 45px',
        boxShadow: 'rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset',
      }}
      item
      xs={12}
      container
      justifyContent="space-between"
      alignItems="center"
    >
      <Link href="/" style={{ textDecoration: 'none', order: 1 }}>
        {/* <LogoIcon width={70} height={70} color="black" hidePC={true} /> */}
        <Typography
          sx={{
            fontWeight: 700,
            color: '#2B3445',
            textDecoration: 'none',
            letterSpacing: '4px',
            fontSize: '16px',
          }}
        >
          GLOWY
        </Typography>
      </Link>

      <Grid sx={{ order: 2 }} item container alignItems="center">
        <Link href="/">
          {/* <Button sx={{ textTransform: 'initial' }} variant="text"> */}
          Home
          {/* </Button> */}
        </Link>
        <Link href="/about">
          {/* <Button sx={{ textTransform: 'initial' }} variant="text"> */}
          About
          {/* </Button> */}
        </Link>
      </Grid>
      <Grid sx={{ order: 3 }} item xs={12} container alignItems="center">
        <Link href="/favorite" style={{ marginRight: '25px' }}>
          <Badge
            sx={{
              '& .MuiBadge-badge': {
                right: -6,
                top: -1,
                border: `2px solid white`,
                padding: '0 4px',
                backgroundColor: '#3794b9ff',
                color: 'white',
                height: '25px',
                width: '25px',
                borderRadius: '13px',
              },
              '& svg': { color: 'initial' },
            }}
            badgeContent={1}
          >
            <FavoriteIcon size={21} />
          </Badge>
        </Link>
        <Link href="/cart">
          <StyledBadge badgeContent={4}>
            <ShoppingBasketIcon />
          </StyledBadge>
        </Link>
        <Link href="/cart" style={{ marginLeft: '25px' }}>
          {/* <StyledBadge badgeContent={4}> */}
          <UserAvatar />
          {/* </StyledBadge> */}
        </Link>
      </Grid>
    </Grid>
  );
}
