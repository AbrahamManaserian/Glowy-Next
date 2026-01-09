'use client';

import {
  Box,
  Button,
  ClickAwayListener,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
// import Link from 'next/link';
import { Link } from '@/i18n/routing';
// import { categoriesObj } from '@/app/admin/add-product/page';
import { categoriesObj } from '@/app/[locale]/(pages)/admin1/add-product/page';
import { typeMapping } from '../products/Filter';

export default function CategoriesDekstop() {
  const t = useTranslations('Categories');
  const tTypes = useTranslations('ProductTypes');
  const [data, setData] = useState({});

  const [showMoreCategory, setShowMoreCategory] = useState(null);
  const [showNestedCategory, setShowNestedCategory] = useState(null);
  const moreRef = useRef(null);
  const closeTimer = useRef(null);
  const nestedRef = useRef(null);
  const open = Boolean(showMoreCategory);

  const handleMouseEnter = (event, data, key) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current); // cancel pending close
    }
    setData({ ...data, routTo: key });
    setShowNestedCategory(event.currentTarget);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setShowNestedCategory(null);
    }, 10); // small delay (10–15ms works well)
  };

  const handleClick = (event) => {
    setShowMoreCategory(showMoreCategory ? null : event.currentTarget);
  };

  const handleClose = (event) => {
    setShowMoreCategory(null);
    handleMouseLeave();
  };

  // Nested Popper

  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        handleClose();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  const openNested = Boolean(showNestedCategory);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <Button
          onClick={handleClick}
          sx={{
            color: '#4a4747f8',
            bgcolor: '#d2cccc17',
            textTransform: 'capitalize',
            fontSize: '14px',
            width: '300px',
            justifyContent: 'space-between',
            boxShadow: '0 0 0',
            ': hover': {
              boxShadow: '0 0 0',
            },
            display: { xs: 'none', sm: 'flex' },
            mr: '15px',
            height: '40px',
            borderRadius: '8px',
          }}
          variant="contained"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MenuIcon sx={{ fontSize: '20px', mr: '5px' }} />
            {t('title')}
          </Box>
          <NavigateNextIcon
            sx={{
              color: '#797676f8',
              fontSize: '18px',
              transform: showMoreCategory ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </Button>

        {/* More Category Popper */}

        <Popper
          sx={{ width: '300px', zIndex: 1100 }}
          open={open}
          anchorEl={showMoreCategory}
          disablePortal={true}
          onMouseLeave={handleMouseLeave}
        >
          <Paper ref={moreRef} sx={{ width: '100%', zIndex: 1100, mt: '10px' }}>
            <List ref={nestedRef}>
              {Object.keys(categoriesObj).map((name, index) => {
                return (
                  <Link
                    href={`/${data.routTo}`}
                    key={index}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItem disablePadding sx={{ fontSize: '12px' }}>
                      <ListItemButton
                        onClick={handleClose}
                        onMouseEnter={(e) => handleMouseEnter(e, categoriesObj[name], name)}
                        sx={{ height: '35px' }}
                        // ref={nestedRef}
                      >
                        <ListItemText
                          primary={t(name)}
                          primaryTypographyProps={{
                            fontSize: '14px',
                            fontWeight: 400,
                            letterSpacing: 0,
                            textTransform: 'capitalize',
                          }}
                        />
                        <NavigateNextIcon
                          sx={{
                            color: '#797676f8',
                            fontSize: '18px',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                );
              })}
            </List>
          </Paper>
          ;{/* Nested Popper */}
          <Popper
            sx={{
              zIndex: 1100,
              p: '10px',
              width: 'calc(100vw - 360px)',
              maxHeight: 'calc(100vh - 250px)',
              overflow: 'scroll',
            }}
            open={openNested}
            anchorEl={nestedRef.current}
            disablePortal={true}
            placement="right-start"
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: [-10],
                },
              },
            ]}
          >
            <Paper sx={{ zIndex: 1100, minHeight: '295px' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexGrow: 1,
                  bgcolor: 'background.paper',
                  flexWrap: 'wrap',
                  alignItems: 'stretch',
                }}
              >
                {Object.keys(data).map((category, index) => {
                  if (category === 'category' || category === 'routTo') return null;
                  return (
                    <List key={index} sx={{ minWidth: '150px' }}>
                      <Link
                        href={`/${data.routTo}?subCategory=${encodeURIComponent(category)}`}
                        key={index}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItemButton onClick={handleClose} sx={{ height: '35px', pl: '7px' }}>
                          <ListItemText
                            primary={t(category)}
                            primaryTypographyProps={{
                              fontSize: '13px',
                              fontWeight: 500,
                              letterSpacing: 0,
                              // pl: '2px',
                              ml: '2px',
                            }}
                          />
                        </ListItemButton>
                      </Link>

                      {data[category].type.map((item, index) => {
                        // if (item === 'routTo') return null;

                        return (
                          <Link
                            href={`/${data.routTo}?subCategory=${encodeURIComponent(
                              category
                            )}&type=${encodeURIComponent(item)}`}
                            key={index}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            <ListItemButton onClick={handleClose} sx={{ height: '35px' }}>
                              <ListItemText
                                primary={tTypes(typeMapping[item] || item)}
                                primaryTypographyProps={{
                                  fontSize: '14px',
                                  fontWeight: 400,
                                  letterSpacing: 0,
                                }}
                              />
                            </ListItemButton>
                          </Link>
                        );
                      })}
                    </List>
                  );
                })}
              </Box>
            </Paper>
          </Popper>
          ; ; ; ;;
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
