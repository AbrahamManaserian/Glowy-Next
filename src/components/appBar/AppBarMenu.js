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
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
// import { categories } from './CategorySearch';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { FavoriteIcon, UserAvatar } from '../icons';
import CartDrawer from '../cartPage/CartDrawer';
import { categories } from '../ui/CategoriesDekstop';
import { useRouter } from 'next/navigation';

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

const navObj = { makeup: 'Makeup', fragrance: 'Fragrance', sale: 'Sale', gifts: 'Gifts', about: 'About' };

export function LogoHome() {
  return (
    <Link href="/" style={{ textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}>
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
    router.push(url, undefined, { scroll: true });
    closeDrawer(false);
    setOpen();
    // window.scrollTo(0, 0);
  };

  return (
    <List sx={{ p: 0 }}>
      <ListItem {...rootProps} disablePadding>
        <ListItemButton sx={{ p: '2px' }} onClick={handleClick}>
          <ListItemText
            primary={category}
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
            <ListItemButton
              sx={{ p: '0 2px 5px 20px ' }}
              onClick={() => handleCloseDrawer(`/${data.routTo}`)}
            >
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
        {Object.keys(data).map((item, index) => {
          if (item === 'routTo') return null;
          // console.log(data[item]);
          return (
            <List key={index} sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ p: '0 2px 5px 20px ' }}
                  onClick={() => handleCloseDrawer(`/${data.routTo}?category=${data[item].routTo}`)}
                >
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
              <List sx={{ ml: '20px', p: 0, borderLeft: 'solid 1px #cdd1d4ff' }}>
                {Object.keys(data[item]).map((subItem, subIndex) => {
                  // console.log(data[item][subItem]);
                  if (subItem === 'routTo') return null;
                  return (
                    <ListItem key={subIndex} disablePadding>
                      <ListItemButton
                        sx={{ p: '0 2px 0 20px ' }}
                        onClick={() =>
                          handleCloseDrawer(
                            `/${data.routTo}?category=${data[item].routTo}&${
                              data[item].routTo === 'fragrance' ? 'gender' : 'type'
                            }=${data[item][subItem]}`
                          )
                        }
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

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };

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
        <Grid item xs={12} container direction="column" sx={{ p: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '15px' }}>
            <LogoHome />
            <CloseIcon sx={{ color: '#8a8c8dff' }} onClick={() => toggleDrawer(false)} />
          </Box>
          <List ref={drawerRef} sx={{ pl: '10px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            {Object.keys(categories).map((key) => {
              return (
                <SingleCategory
                  data={categories[key]}
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

          <Divider />
        </Grid>
      </Drawer>
    </>
  );
}

export default function AppBarMenu() {
  const [isSticky, setIsSticky] = useState(false);

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
        top: isSticky ? 0 : -300, // 👈 offset sticky start
        // top: 0, // 👈 offset sticky start
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
      item
      xs={12}
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
        <Link href="/favorite" style={{ margin: '0 25px 0 10px', WebkitTapHighlightColor: 'transparent' }}>
          <StyledBadgeFavorite badgeContent={1}>
            <FavoriteIcon size={21} />
          </StyledBadgeFavorite>
        </Link>

        <CartDrawer />
        <Link href="/user" style={{ margin: '0 15px 0 25px', WebkitTapHighlightColor: 'transparent' }}>
          <UserAvatar />
        </Link>
      </Grid>
    </Grid>
  );
}
