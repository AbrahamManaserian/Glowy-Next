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
import Link from 'next/link';

export const categories = {
  fragrance: {
    Fragrance: {
      Men: 'men',
      Women: 'women',
      Uni: 'uni',
      routTo: 'fragrance',
    },
    routTo: 'fragrance',
  },

  Makeup: {
    Face: {
      Foundation: 'foundation',
      Highlighter: 'highlighter',
      'Face Primer': 'face-primer',
      'Powder & Setting Spray': 'powder-setting-spray',
      Contour: 'contour',
      Concealer: 'concealer',
      Blush: 'blush',
      'BB & CC cream': 'bb-cc-cream',
      routTo: 'face',
    },

    Eye: {
      'Brow Gel': 'brow-gel',
      'Eye Palettes': 'eye-palettes',
      'Eyebrow pencil': 'eyebrow-pencil',
      Eyeliner: 'eyeliner',
      Pencil: 'pencil',
      routTo: 'eye',
    },
    Lip: {
      Lipstick: 'lipstick',
      'Liquid Lipstick': 'liquid-lipstick',
      'Lip Balm & Treatmentl': 'lip-balm-treatmentl',
      'Lip Gloss': 'lip-gloss',
      'Lip Liner': 'lip-liner',
      'Lip Oil': 'lip-oil',
      routTo: 'lip',
    },
    routTo: 'makeup',
  },

  Skincare: {
    Cleansers: {
      Cleansers: 'cleansers',
      Exfoliation: 'exfoliation',
      'Face Wash': 'face-wash',
      'Makeup Removers': 'makeup-removers',
      'Toners & Lotions': 'toners-lotions',
      routTo: 'cleansers',
    },

    'Eye Care': {
      'Dark Circles': 'dark-circles',
      'Eye Patches': 'eye-patches',
      'Lifting/Anti-age Eye Creams': 'lifting-anti-age-eye-creams',
      routTo: 'eye-care',
    },
    Masks: {
      'Anti-age': 'anti-age',
      'Eye Patches': 'eye-patches',
      'Face Masks': 'face-masks',
      Hydrating: 'hydrating',
      routTo: 'masks',
    },
    Moisturizers: {
      'Face Creams': 'face-creams',
      'Face Oils': 'face-oils',
      Mists: 'mists',
      Moisturizers: 'moisturizers',
      'Night Creams': 'night-creams',
      'Anti-Aging': 'anti-aging',
      'Dark Spots': 'dark-spots',
      Lifting: 'lifting',
      'Face Serums': 'face-serums',
      routTo: 'masks',
    },
    routTo: 'moisturizers',
  },
  'Bath & Body': {
    'Bath & Shower': {
      Gel: 'gel',
      'Hand Wash & Soap': 'hand-wash-soap',
      'Scrub & Exfoliation': 'scrub-exfoliation',
      'Shampoo & Conditione': 'shampoo-conditione',
      routTo: 'bath-shower',
    },
    'Body Care': {
      Antiperspirants: 'antiperspirants',
      'Body Lotion & Body Oils': 'body-lotion-body-oils',
      'Body Moisturizers': 'body-moisturizers',
      'Cellulite & Stretch Marks': 'cellulite-stretch-marks',
      'Hand Cream & Foot Cream': 'hand-cream–foot-ream',
      'Masks & Special Treatment': 'masks-special-treatment',
      routTo: 'body-care',
    },
    routTo: 'bath-body',
  },
  Hair: {
    'Hair Styling': {
      Gel: 'gel',
      'Hand Wash & Soap': 'hand-wash-soap',
      'Scrub & Exfoliation': 'scrub-exfoliation',
      'Shampoo & Conditione': 'shampoo-conditione',
      routTo: 'hair-styling',
    },
    routTo: 'hair',
  },
  Nail: {
    Nail: {
      'Cuticle care': 'cuticle-care',
      'Nail care': 'nail-care',
      'Nail color': 'nail-color',
      'Nail polish removers': 'nail-polish-removers',
      routTo: 'nail',
    },
    routTo: 'nail',
  },
  'New Items': {
    'New Items': { routTo: 'new-items' },
    routTo: 'new-items',
  },
  Accessories: {
    Accessories: { routTo: 'accessories' },
    routTo: 'accessories',
  },
};

export default function CategoriesDekstop() {
  const [data, setData] = useState({});
  const [showMoreCategory, setShowMoreCategory] = useState(null);
  const [showNestedCategory, setShowNestedCategory] = useState(null);
  const moreRef = useRef(null);
  const closeTimer = useRef(null);
  const nestedRef = useRef(null);
  const open = Boolean(showMoreCategory);

  const handleMouseEnter = (event, data) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current); // cancel pending close
    }
    setData(data);
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
            Categories
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
              {Object.keys(categories).map((name, index) => {
                return (
                  <Link
                    href={`/${data.routTo}`}
                    key={index}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItem disablePadding sx={{ fontSize: '12px' }}>
                      <ListItemButton
                        onClick={handleClose}
                        onMouseEnter={(e) => handleMouseEnter(e, categories[name])}
                        sx={{ height: '35px' }}
                        // ref={nestedRef}
                      >
                        <ListItemText
                          primary={name}
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

          {/* Nested Popper */}

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
                  if (category === 'routTo') return null;
                  return (
                    <List key={index} sx={{ minWidth: '150px' }}>
                      <Link
                        href={`/${data.routTo}?category=${data[category].routTo}`}
                        key={index}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItemButton onClick={handleClose} sx={{ height: '35px', pl: '7px' }}>
                          <ListItemText
                            primary={category}
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

                      {Object.keys(data[category]).map((item, index) => {
                        if (item === 'routTo') return null;
                        return (
                          <Link
                            href={`/${data.routTo}?category=${data[category].routTo}&type=${data[category][item]}`}
                            key={index}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            <ListItemButton onClick={handleClose} sx={{ height: '35px' }}>
                              <ListItemText
                                primary={item}
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
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
