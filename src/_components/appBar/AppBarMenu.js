'use client';

import {
  Avatar,
  Badge,
  Collapse,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Logout from '@mui/icons-material/Logout';
import Login from '@mui/icons-material/Login';
import Link from 'next/link';
import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { FavoriteIcon, UserAvatar } from '../icons';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CartDrawer from '@/app/(pages)/cart/_components/CartDrawer';
import { useGlobalContext } from '@/app/GlobalContext';
import { categoriesObj } from '@/app/(pages)/admin/add-product/page';

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

const navObj = {
  shop: 'Shop',
  makeup: 'Makeup',
  fragrance: 'Fragrance',
  sale: 'Sale',
  gifts: 'Gifts',
  about: 'About',
};
const navObjGeneral = {
  shop: 'Shop',
  home: 'Home',
  sale: 'Sale',
  gifts: 'Gifts',
  about: 'About',
  blog: 'Blog',
};
const navObjAbout = {
  about: 'Story',
  'about#2': 'Our Goals',
  'about#3': 'Terms & Conditions',
  'about#4': 'Privacy Policy',
};
const navObjCusCare = {
  help: 'Help Center',
  'help#2': 'Track Your Order',
  'help#3': 'Returns & Refunds',
  'help#4': 'FAQ',
};

export function LogoHome() {
  return (
    <Link href="/" style={{ textDecoration: 'none', WebkitTapHighlightColor: 'Background' }}>
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
function SingleCategory({ data, category, open, setOpen, rootProps, closeDrawer }) {
  const router = useRouter();
  const handleClick = () => {
    if (open === category) {
      setOpen('');
    } else {
      setOpen(category);
    }
  };
  const handleCloseDrawer = (url) => {
    closeDrawer(false);
    setOpen();
    router.push(url, undefined, { scroll: true });
  };

  return (
    <List sx={{ p: 0 }}>
      <ListItem {...rootProps} disablePadding>
        <ListItemButton sx={{ p: '2px' }} onClick={handleClick}>
          <ListItemText
            primary={data.category}
            primaryTypographyProps={{
              fontSize: '17px',
              fontWeight: 400,
              letterSpacing: 0,
              textTransform: 'capitalize',
              color: open === category ? '#1574d3ff' : '',
            }}
          />
          <NavigateNextIcon
            sx={{
              color: '#797676f8',
              fontSize: '18px',
              transform: open === category ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </ListItemButton>
      </ListItem>

      <Collapse in={open === category} timeout="auto" unmountOnExit>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding>
            <ListItemButton sx={{ p: '0 2px 5px 20px ' }} onClick={() => handleCloseDrawer(`/${category}`)}>
              <ListItemText
                primary="All Items "
                primaryTypographyProps={{
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: 0,
                  textTransform: 'capitalize',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        {Object.keys(data).map((key, index) => {
          if (key === 'category') return null;
          // console.log(data[item]);
          return (
            <List key={index} sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ p: '0 2px 5px 20px ' }}
                  onClick={() => handleCloseDrawer(`/${category}?subCategory=${key}`)}
                >
                  <ListItemText
                    primary={key}
                    primaryTypographyProps={{
                      fontSize: '15px',
                      fontWeight: 700,
                      letterSpacing: 0,
                      textTransform: 'capitalize',
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <List sx={{ ml: '20px', p: 0, borderLeft: 'solid 1px #cdd1d4ff' }}>
                {data[key].type.map((subItem, subIndex) => {
                  // console.log(data[item][subItem]);

                  return (
                    <ListItem key={subIndex} disablePadding>
                      <ListItemButton
                        sx={{ p: '5px 2px 5px 20px' }}
                        onClick={() => handleCloseDrawer(`/${category}?subCategory=${key}&type=${subItem}`)}
                      >
                        <ListItemText
                          primary={subItem}
                          primaryTypographyProps={{
                            fontSize: '16px',
                            fontWeight: 300,
                            letterSpacing: 0,
                            textTransform: 'capitalize',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </List>
          );
        })}
      </Collapse>
    </List>
  );
}

function DrawerMenu() {
  const drawerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openNested, setOpenNested] = useState();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    toggleDrawer(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (openNested && drawerRef.current) {
      const el = drawerRef.current.querySelector(`[data-category="${openNested}"]`);
      if (el) {
        drawerRef.current.scrollTo({
          top: 0,
          // behavior: 'smooth',
        });
      }
    }
  }, [openNested]);

  return (
    <>
      <MenuIcon
        sx={{
          display: { xs: 'block', sm: 'none' },
          order: 9,
          fontSize: '30px',
          color: '#505152ff',
        }}
        onClick={() => toggleDrawer(true)}
      />

      <Drawer
        anchor={'right'}
        sx={{ '& .MuiDrawer-paper': { width: '100%' } }}
        open={open}
        onClose={() => toggleDrawer(false)}
      >
        <Grid item xs={12} container direction="column" sx={{ p: '0 20px 20px 20px' }}>
          <div
            style={{
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <CloseIcon
              sx={{
                color: '#8a8c8dff',
                my: '10px',
              }}
              onClick={() => toggleDrawer(false)}
            />
          </div>
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#434a4eff' }}>
            All Categories
          </Typography>
          <List ref={drawerRef} sx={{ pl: '10px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            {Object.keys(categoriesObj).map((key) => {
              return (
                <SingleCategory
                  data={categoriesObj[key]}
                  category={key}
                  key={key}
                  open={openNested}
                  setOpen={setOpenNested}
                  closeDrawer={toggleDrawer}
                  rootProps={{ 'data-category': key }}
                />
              );
            })}
          </List>
          <Divider sx={{ mb: '10px' }} />
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#434a4eff', mb: '10px' }}>
            General
          </Typography>
          {Object.keys(navObjGeneral).map((key, index) => {
            return (
              <Link key={index} scroll={true} href={`/${key}`} style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    fontSize: '17px',
                    fontWeight: 400,
                    color: 'black',
                    textDecoration: 'none',
                    m: ' 0 0 10px 13px',
                  }}
                >
                  {navObjGeneral[key]}
                </Typography>
              </Link>
            );
          })}
          <Divider sx={{ mb: '10px' }} />
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#434a4eff', mb: '10px' }}>
            Customer Care
          </Typography>
          {Object.keys(navObjCusCare).map((key, index) => {
            return (
              <Link key={index} scroll={true} href={`/${key}`} style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    fontSize: '17px',
                    fontWeight: 400,
                    color: 'black',
                    textDecoration: 'none',
                    m: ' 0 0 10px 13px',
                  }}
                >
                  {navObjCusCare[key]}
                </Typography>
              </Link>
            );
          })}
          <Divider sx={{ mb: '10px' }} />
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#434a4eff', mb: '10px' }}>
            About Us
          </Typography>
          {Object.keys(navObjAbout).map((key, index) => {
            return (
              <Link key={index} scroll={true} href={`/${key}`} style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    fontSize: '17px',
                    fontWeight: 400,
                    color: 'black',
                    textDecoration: 'none',
                    m: ' 0 0 10px 13px',
                  }}
                >
                  {navObjAbout[key]}
                </Typography>
              </Link>
            );
          })}
        </Grid>
      </Drawer>
    </>
  );
}

import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

export default function AppBarMenu() {
  const { isSticky, setIsSticky, userData, user } = useGlobalContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirectUrl =
    searchParams.get('redirect') ||
    (pathname.startsWith('/auth')
      ? '/'
      : pathname + (searchParams.toString() ? '?' + searchParams.toString() : ''));

  const handleClickUser = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      handleCloseMenu();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Grid
      sx={{
        position: 'sticky',
        // top: isSticky ? 0 : -300, // 👈 offset sticky start
        top: 0, // 👈 offset sticky start
        bgcolor: 'white',
        zIndex: 1200,
        p: { xs: '10px', sm: '19px 45px' },
        transition: 'top 0.5s ease, box-shadow 0.5s ease',
        boxShadow: isSticky ? 'rgba(0, 0, 0, 0.1) 0px 2px 6px' : 'none',
        // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 6px',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        width: '100%',
      }}
      size={12}
      container
      justifyContent="space-between"
      alignItems="center"
    >
      <DrawerMenu />
      <LogoHome />
      <Grid item container sx={{ display: { xs: 'none', sm: 'flex' }, order: 2 }}>
        {Object.keys(navObj).map((key) => {
          return (
            <Link scroll={true} key={key} className="bar-link" href={`/${key}`}>
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
        <CartDrawer />
        <div style={{ margin: '0 15px 0 25px', WebkitTapHighlightColor: 'Background' }}>
          <div onClick={handleClickUser} style={{ cursor: 'pointer' }}>
            <Avatar
              src={userData?.photoURL}
              alt={userData?.fullName || 'User'}
              sx={{ width: 32, height: 32 }}
            />
          </div>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <div style={{ padding: '10px 20px', outline: 'none' }}>
              <Typography variant="subtitle1" noWrap fontWeight={600}>
                {userData ? userData.fullName || 'User' : 'Welcome, Guest'}
              </Typography>
              {userData && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {userData.email}
                </Typography>
              )}
            </div>
            <Divider />
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                router.push('/user');
              }}
            >
              <ListItemIcon>
                <PersonOutlineIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                router.push('/user?tab=orders');
              }}
            >
              <ListItemIcon>
                <LocalMallOutlinedIcon fontSize="small" />
              </ListItemIcon>
              My Orders
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                router.push('/user?tab=wishlist');
              }}
            >
              <ListItemIcon>
                <FavoriteBorderIcon fontSize="small" />
              </ListItemIcon>
              Wishlist
            </MenuItem>
            <Divider />
            {userData ? (
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  router.push(`/auth/signin?redirect=${encodeURIComponent(redirectUrl)}`);
                }}
              >
                <ListItemIcon>
                  <Login fontSize="small" />
                </ListItemIcon>
                Sign In
              </MenuItem>
            )}
          </Menu>
        </div>
      </Grid>
    </Grid>
  );
}
