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
  ListItemText,
  Typography,
} from '@mui/material';
import { FavoriteIcon, ShoppingBasketIcon, UserAvatar } from './icons';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { categories } from './CategorySearch';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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

function SingleCategory({ category, subCategories, open, setOpen }) {
  // const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (open === category) {
      setOpen('');
    } else {
      setOpen(category);
    }
  };
  // const handleClickNested = () => {
  //   setOpen(!open);
  // };
  // console.log(subCategories);
  return (
    <List sx={{ p: 0 }}>
      <ListItem disablePadding>
        <ListItemButton sx={{ p: '2px' }} onClick={handleClick}>
          <ListItemText
            primary={category}
            primaryTypographyProps={{
              fontSize: '17px',
              fontWeight: 300,
              letterSpacing: 0,
              textTransform: 'capitalize',
              color: open === category ? '#1574d3ff' : '',
            }}
          />
          <NavigateNextIcon
            sx={{
              color: '#797676f8',
              fontSize: '18px',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={open === category} timeout="auto" unmountOnExit>
        {Object.keys(subCategories).map((item, index) => {
          return (
            <List key={index} sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton sx={{ p: '0 2px 5px 20px ' }} onClick={handleClick}>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      fontSize: '15px',
                      fontWeight: 700,
                      letterSpacing: 0,
                      textTransform: 'capitalize',
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {subCategories[item].map((subItem, subIndex) => {
                return (
                  <ListItem key={subIndex} disablePadding>
                    <ListItemButton sx={{ p: '0 2px 0 30px ' }} onClick={handleClick}>
                      <ListItemText
                        primary={subItem}
                        primaryTypographyProps={{
                          fontSize: '16px',
                          fontWeight: 100,
                          letterSpacing: 0,
                          textTransform: 'capitalize',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          );
        })}
        {/* <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>asd</ListItemButton>
        </List> */}
      </Collapse>
    </List>
  );
}

function DrawerMenu() {
  const [open, setOpen] = useState(false);
  const [openNested, setOpenNested] = useState();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <>
      <MenuIcon
        sx={{
          display: { xs: 'block', sm: 'none' },
          // mr: '9px',
          order: 9,
          fontSize: '30px',
          color: '#505152ff',
        }}
        onClick={toggleDrawer(true)}
      />

      <Drawer
        anchor={'right'}
        sx={{ '& .MuiDrawer-paper': { width: '100%' } }}
        open={open}
        onClose={toggleDrawer(false)}
      >
        <Grid item xs={12} container direction="column" sx={{ p: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '15px' }}>
            <LogoHome />
            <CloseIcon sx={{ color: '#8a8c8dff' }} onClick={toggleDrawer(false)} />
          </Box>
          <List sx={{ pl: '10px' }}>
            {Object.keys(categories).map((key) => {
              return (
                <SingleCategory
                  category={key}
                  key={key}
                  subCategories={categories[key]}
                  open={openNested}
                  setOpen={setOpenNested}
                />
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
        transition: 'top 0.5s ease, box-shadow 0.5s ease',
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
      <DrawerMenu />
      {/* <Grid item container sx={{ order: 1 }}> */}
      <LogoHome />
      {/* </Grid> */}
      <Grid item container sx={{ display: { xs: 'none', sm: 'flex' }, order: 2 }}>
        {Object.keys(navObj).map((key) => {
          return (
            <Link key={key} className="bar-link" href={`/${key}`}>
              {navObj[key]}
            </Link>
          );
        })}
      </Grid>

      <Grid
        sx={{ order: 3, flexWrap: 'nowrap', flexGrow: { xs: 1, sm: 0 } }}
        item
        xs={12}
        container
        alignItems="center"
        justifyContent="flex-end"
      >
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
        <Link href="/user" style={{ margin: '0 15px 0 25px' }}>
          <UserAvatar />
        </Link>
      </Grid>
    </Grid>
  );
}
