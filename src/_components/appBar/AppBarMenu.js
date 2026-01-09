'use client';

import {
  Avatar,
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
  Dialog,
  useMediaQuery,
  useTheme,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Logout from '@mui/icons-material/Logout';
import Login from '@mui/icons-material/Login';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import TranslateIcon from '@mui/icons-material/Translate';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
// import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import CartDrawer from '@/app/[locale]/(pages)/cart/_components/CartDrawer';
import { useGlobalContext } from '@/app/GlobalContext';
import { categoriesObj } from '@/app/[locale]/(pages)/admin1/add-product/page';

import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { typeMapping } from '../products/Filter';
import { Payment, Settings } from '@mui/icons-material';
import {
  FragranceIcon,
  MakeupIcon,
  SkincareIcon,
  BathBodyIcon,
  HairIcon,
  NailIcon,
  AccessoriesIcon,
  CollectionIcon,
} from '../icons';

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSub = searchParams.get('subCategory');
  const currentType = searchParams.get('type');
  const t = useTranslations('Categories');
  const tTypes = useTranslations('ProductTypes');

  const iconMap = {
    fragrance: FragranceIcon,
    makeup: MakeupIcon,
    skincare: SkincareIcon,
    bathBody: BathBodyIcon,
    hair: HairIcon,
    nail: NailIcon,
    accessories: AccessoriesIcon,
    collection: CollectionIcon,
  };

  const IconComponent = iconMap[category];
  const isActive = pathname.startsWith(`/${category}`);

  const handleClick = () => {
    if (open === category) {
      setOpen('');
    } else {
      setOpen(category);
    }
  };
  const handleCloseDrawer = () => {
    closeDrawer(false);
    setOpen();
  };

  return (
    <List sx={{ p: 0 }}>
      <ListItem {...rootProps} disablePadding>
        <ListItemButton sx={{ p: '3px 2px' }} onClick={handleClick}>
          {IconComponent && (
            <IconComponent
              sx={{ mr: 1, color: isActive ? '#e64c14ff' : open === category ? '#1574d3ff' : '' }}
            />
          )}
          <ListItemText
            primary={t(category)}
            primaryTypographyProps={{
              fontWeight: 400,
              letterSpacing: 0,
              textTransform: 'capitalize',
              color: isActive ? '#e64c14ff' : open === category ? '#1574d3ff' : '',
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
          <Link
            href={`/${encodeURIComponent(category)}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItem disablePadding>
              <ListItemButton sx={{ p: '0 2px 5px 20px ' }} onClick={handleCloseDrawer}>
                <ListItemText
                  primary={t('allItems')}
                  primaryTypographyProps={{
                    fontSize: '15px',
                    fontWeight: 700,
                    letterSpacing: 0,
                    textTransform: 'capitalize',
                    color: isActive && !currentSub ? '#e64c14ff' : '',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        {Object.keys(data).map((key, index) => {
          if (key === 'category') return null;
          // console.log(data[item]);
          return (
            <List key={index} sx={{ p: 0 }}>
              <Link
                href={`/${encodeURIComponent(category)}?subCategory=${encodeURIComponent(key)}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ p: '0 2px 5px 20px ' }} onClick={handleCloseDrawer}>
                    <ListItemText
                      primary={t(key)}
                      primaryTypographyProps={{
                        fontSize: '15px',
                        fontWeight: 700,
                        letterSpacing: 0,
                        textTransform: 'capitalize',
                        color: isActive && currentSub === key ? '#e64c14ff' : '',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <List sx={{ ml: '20px', p: 0, borderLeft: 'solid 1px #cdd1d4ff' }}>
                {data[key].type.map((subItem, subIndex) => {
                  // console.log(data[item][subItem]);

                  return (
                    <Link
                      key={subIndex}
                      href={`/${encodeURIComponent(category)}?subCategory=${encodeURIComponent(
                        key
                      )}&type=${encodeURIComponent(subItem)}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <ListItem disablePadding>
                        <ListItemButton sx={{ p: '5px 2px 5px 20px' }} onClick={handleCloseDrawer}>
                          <ListItemText
                            primary={tTypes(typeMapping[subItem] || subItem)}
                            primaryTypographyProps={{
                              fontSize: '16px',
                              fontWeight: 300,
                              letterSpacing: 0,
                              textTransform: 'capitalize',
                              color:
                                isActive && currentSub === key && currentType === subItem
                                  ? '#e64c14ff'
                                  : undefined,
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </Link>
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
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openNested, setOpenNested] = useState();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Common.nav');

  const navObjGeneral = {
    '': t('home'),
    shop: t('shop'),
    sale: t('sale'),
    giftCards: t('giftCards'),
    about: t('about'),
  };
  const navObjAbout = {
    about: t('story'),
    'about#2': t('ourGoals'),
    'about#3': t('termsConditions'),
    'about#4': t('privacyPolicy'),
  };
  const navObjCusCare = {
    help: t('helpCenter'),
    'help#2': t('trackOrder'),
    'help#3': t('returnsRefunds'),
    'help#4': t('faq'),
  };

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
    setOpenNested();
  };

  useEffect(() => {
    toggleDrawer(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (listRef.current && openNested) {
      listRef.current.scrollIntoView({ block: 'start' });
    }
  }, [openNested]);

  return (
    <>
      <MenuIcon
        sx={{
          display: { sm: 'block', xs: 'block', md: 'block', lg: 'none' },
          order: 9,
          fontSize: '30px',
          color: '#505152ff',
          cursor: 'pointer',
        }}
        onClick={() => toggleDrawer(true)}
      />

      <Drawer
        anchor={'right'}
        sx={{
          '& .MuiDrawer-paper': { width: { xs: '100%', sm: 'auto' }, minWidth: '300px' },
        }}
        open={open}
        onClose={() => toggleDrawer(false)}
      >
        <div
          style={{
            height: '100vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 20px 20px 20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              borderBottom: '1px solid #eee',
              marginBottom: '5px',
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

          <Typography sx={{ fontWeight: 600, mb: '10px' }}>{t('general')}</Typography>
          {Object.keys(navObjGeneral).map((key, index) => {
            const isActive = key === '' ? pathname === '/' : pathname.startsWith(`/${key}`);
            const getIcon = (k) => {
              switch (k) {
                case '':
                  return <HomeOutlinedIcon sx={{ mr: 1, fontSize: '20px' }} />;
                case 'shop':
                  return <StoreOutlinedIcon sx={{ mr: 1, fontSize: '20px' }} />;
                case 'sale':
                  return <LocalOfferOutlinedIcon sx={{ mr: 1, fontSize: '20px' }} />;
                case 'giftCards':
                  return <CardGiftcardOutlinedIcon sx={{ mr: 1, fontSize: '20px' }} />;
                case 'about':
                  return <InfoOutlinedIcon sx={{ mr: 1, fontSize: '20px' }} />;
                default:
                  return null;
              }
            };
            return (
              <Link key={index} scroll={true} href={`/${key}`} style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    color: isActive ? '#e64c14ff' : 'black',
                    textDecoration: 'none',
                    m: ' 0 0 12px 13px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {getIcon(key)}
                  {navObjGeneral[key]}
                </Typography>
              </Link>
            );
          })}
          <Divider sx={{ mb: '10px' }} />
          <Typography ref={listRef} sx={{ fontWeight: 600 }}>
            {t('allCategories')}
          </Typography>
          <List sx={{ pl: '10px' }}>
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
          <Typography sx={{ fontWeight: 600, mb: '10px' }}>{t('customerCare')}</Typography>
          {Object.keys(navObjCusCare).map((key, index) => {
            const getIcon = (k) => {
              switch (k) {
                case 'help':
                  return <HelpOutlinedIcon sx={{ mr: 1, fontSize: '16px' }} />;
                case 'help#2':
                  return <LocalShippingOutlinedIcon sx={{ mr: 1, fontSize: '16px' }} />;
                case 'help#3':
                  return <AssignmentReturnOutlinedIcon sx={{ mr: 1, fontSize: '16px' }} />;
                case 'help#4':
                  return <HelpOutlineOutlinedIcon sx={{ mr: 1, fontSize: '16px' }} />;
                default:
                  return null;
              }
            };
            return (
              <Link key={index} scroll={true} href={`/${key}`} style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    // fontWeight: 400,
                    color: 'black',
                    textDecoration: 'none',
                    m: ' 0 0 10px 13px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {getIcon(key)}
                  {navObjCusCare[key]}
                </Typography>
              </Link>
            );
          })}
          <Divider sx={{ mb: '10px' }} />
          <Typography sx={{ fontWeight: 600, mb: '10px' }}>{t('aboutUs')}</Typography>
          {Object.keys(navObjAbout).map((key, index) => {
            const getIcon = (k) => {
              switch (k) {
                case 'about':
                  return <MenuBookOutlinedIcon sx={{ mr: 1, fontSize: '16px' }} />;
                case 'about#2':
                  return <FlagOutlinedIcon sx={{ mr: 1, fontSize: '16px' }} />;
                case 'about#3':
                  return <DescriptionOutlinedIcon sx={{ mr: 1, fontSize: '16px' }} />;
                case 'about#4':
                  return <SecurityOutlinedIcon sx={{ mr: 1, fontSize: '16px' }} />;
                default:
                  return null;
              }
            };
            return (
              <Link key={index} scroll={true} href={`/${key}`} style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    color: 'black',
                    textDecoration: 'none',
                    m: ' 0 0 10px 13px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {getIcon(key)}
                  {navObjAbout[key]}
                </Typography>
              </Link>
            );
          })}
        </div>
      </Drawer>
    </>
  );
}

function UserMenuContent({
  userData,
  t,
  tUser,
  isAdmin,
  locale,
  handleCloseMenu,
  handleLanguageChange,
  handleSignOut,
  router,
  redirectUrl,
}) {
  return (
    <>
      <div style={{ padding: '10px 20px', outline: 'none' }}>
        <Typography variant="subtitle1" noWrap fontWeight={600}>
          {userData ? userData.fullName || 'User' : t('welcomeGuest')}
        </Typography>
        {userData && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {userData.email}
          </Typography>
        )}
      </div>
      <Divider />
      <Link href="/user" style={{ textDecoration: 'none', color: 'inherit' }}>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          {tUser('profile')}
        </MenuItem>
      </Link>
      <Link href="/user/orders" style={{ textDecoration: 'none', color: 'inherit' }}>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <LocalMallOutlinedIcon fontSize="small" />
          </ListItemIcon>
          {tUser('myOrders')}
        </MenuItem>
      </Link>
      <Link href="/user/wishlist" style={{ textDecoration: 'none', color: 'inherit' }}>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <FavoriteBorderIcon fontSize="small" />
          </ListItemIcon>
          {tUser('wishlist')}
        </MenuItem>
      </Link>
      {userData && (
        <>
          <Link href="/user/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
            <MenuItem
              onClick={() => {
                handleCloseMenu();
              }}
            >
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              {tUser('settings')}
            </MenuItem>
          </Link>
          <Link href="/user/payment" style={{ textDecoration: 'none', color: 'inherit' }}>
            <MenuItem
              onClick={() => {
                handleCloseMenu();
              }}
            >
              <ListItemIcon>
                <Payment fontSize="small" />
              </ListItemIcon>
              {tUser('payment')}
            </MenuItem>
          </Link>
        </>
      )}
      <Link href="/help" style={{ textDecoration: 'none', color: 'inherit' }}>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <HelpOutlinedIcon fontSize="small" />
          </ListItemIcon>
          {t('help')}
        </MenuItem>
      </Link>

      {isAdmin && (
        <Link href="/admin/orders?status=pending" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem
            onClick={() => {
              handleCloseMenu();
            }}
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            {tUser('adminPanel')}
          </MenuItem>
        </Link>
      )}
      <Divider />
      <MenuItem disabled sx={{ opacity: '1 !important' }}>
        <ListItemIcon>
          <TranslateIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={t('language')} primaryTypographyProps={{ fontWeight: 600 }} />
      </MenuItem>
      <MenuItem selected={locale === 'hy'} onClick={() => handleLanguageChange('hy')} sx={{ pl: 4 }}>
        <ListItemText primary="Հայերեն" />
      </MenuItem>
      <MenuItem selected={locale === 'en'} onClick={() => handleLanguageChange('en')} sx={{ pl: 4 }}>
        <ListItemText primary="English" />
      </MenuItem>
      <MenuItem selected={locale === 'ru'} onClick={() => handleLanguageChange('ru')} sx={{ pl: 4 }}>
        <ListItemText primary="Русский" />
      </MenuItem>
      <Divider />
      {userData ? (
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {tUser('logout')}
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
          {tUser('login')}
        </MenuItem>
      )}
    </>
  );
}

export default function AppBarMenu() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const locale = useLocale();
  const t = useTranslations('Common.nav');
  const tUser = useTranslations('Common.user');
  const { isSticky, setIsSticky, userData, user } = useGlobalContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const openMenu = Boolean(anchorEl);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navObj = {
    shop: t('shop'),
    makeup: t('makeup'),
    fragrance: t('fragrance'),
    sale: t('sale'),
    giftCards: t('giftCards'),
    about: t('about'),
  };

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

  const handleLanguageChange = (newLocale) => {
    handleCloseMenu();
    const queryString = searchParams.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(url, { locale: newLocale });
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

  useEffect(() => {
    if (user) {
      user
        .getIdTokenResult()
        .then((idTokenResult) => {
          setIsAdmin(!!idTokenResult.claims.admin);
        })
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

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
      <Grid container sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' }, order: 2 }}>
        {Object.keys(navObj).map((key) => {
          const isActive = key === '' ? pathname === '/' : pathname.startsWith(`/${key}`);
          return (
            <Link scroll={true} key={key} href={`/${key}`} style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: isActive ? '#f44336' : '#505152ff',
                  fontSize: '14px',
                  // fontWeight: isActive ? 600 : 400,
                  mr: '35px',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#f44336',
                  },
                }}
              >
                {navObj[key]}
              </Typography>
            </Link>
          );
        })}
      </Grid>

      <Grid
        sx={{ order: 3, flexWrap: 'nowrap', flexGrow: { xs: 1, sm: 1, md: 1, lg: 0 } }}
        container
        alignItems="center"
        justifyContent="flex-end"
      >
        <CartDrawer />
        {fullScreen ? (
          <Dialog
            fullScreen={fullScreen}
            open={openMenu}
            onClose={handleCloseMenu}
            sx={{ marginTop: '50px', position: 'fixed' }}
            TransitionComponent={Slide}
            TransitionProps={{ direction: 'left' }}
            BackdropProps={{ style: { backgroundColor: 'transparent' } }}
          >
            <UserMenuContent
              userData={userData}
              t={t}
              tUser={tUser}
              isAdmin={isAdmin}
              locale={locale}
              handleCloseMenu={handleCloseMenu}
              handleLanguageChange={handleLanguageChange}
              handleSignOut={handleSignOut}
              router={router}
              redirectUrl={redirectUrl}
            />
          </Dialog>
        ) : (
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
                minWidth: '250px',
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
            <UserMenuContent
              userData={userData}
              t={t}
              tUser={tUser}
              isAdmin={isAdmin}
              locale={locale}
              handleCloseMenu={handleCloseMenu}
              handleLanguageChange={handleLanguageChange}
              handleSignOut={handleSignOut}
              router={router}
              redirectUrl={redirectUrl}
            />
          </Menu>
        )}
        <div style={{ margin: '0 15px 0 25px', WebkitTapHighlightColor: 'Background' }}>
          <div onClick={handleClickUser} style={{ cursor: 'pointer' }}>
            <Avatar
              src={userData?.photoURL}
              alt={userData?.fullName || 'User'}
              sx={{ width: 32, height: 32 }}
            />
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
