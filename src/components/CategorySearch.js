'use client';

import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useRef, useState } from 'react';
import { SearchIcon } from './icons';
import BasicList from './testList';
import { usePathname } from 'next/navigation';

export const categories = {
  fragrance: { Fragrance: ['Men', 'Women', 'Uni'] },
  makeup: {
    Face: [
      'Foundation',
      'Highlighter',
      'Face Primer',
      'Powder & Setting Spray',
      'Contour',
      'Concealer',
      'Blush',
      'BB & CC cream',
    ],
    Eye: ['Brow Gel', 'Eye Palettes', 'Eyebrow pencil', 'Eyeliner', 'Pencil'],
    Lip: ['Lipstick', 'Liquid Lipstick', 'Lip Balm & Treatmentl', 'Lip Gloss', 'Lip Liner', 'Lip Oil'],
  },
  skincare: {
    Cleansers: ['Cleansers', 'Exfoliation', 'Face Wash', 'Makeup Removers', 'Toners & Lotions'],
    'Eye Care': ['Dark Circles', 'Eye Patches', 'Lifting/Anti-age Eye Creams', ''],
    Masks: ['Anti-age', 'Eye Patches', 'Face Masks', 'Hydrating'],
    Moisturizers: [
      'Face Creams',
      'Face Oils',
      'Mists',
      'Moisturizers',
      'Night Creams',
      'Anti-Aging',
      'Dark Spots',
      'Lifting',
      'Face Serums',
    ],
  },
  'Bath & Body': {
    'Bath & Shower': ['Gel', 'Hand Wash & Soap', 'Scrub & Exfoliation', 'Shampoo & Conditione'],
    'Body Care': [
      'Antiperspirants',
      'Body Lotion & Body Oils',
      'Body Moisturizers',
      'Cellulite & Stretch Marks',
      'Hand Cream & Foot Cream',
      'Masks & Special Treatment',
    ],
  },
  hair: {
    'Hair Styling': ['Gel', 'Hand Wash & Soap', 'Scrub & Exfoliation', 'Shampoo & Conditione'],
  },
  nail: {
    Nail: ['Cuticle care', 'Nail care', 'Nail color', 'Nail polish removers'],
  },
  'New Items': {
    'New Items': [],
  },
  accessories: {
    Accessories: [],
  },
};

function SingleCategory({ item, component, ref }) {
  const [showMoreCategory1, setShowMoreCategory1] = useState(null);
  const nestedRef = useRef(null);

  const handleNestedOpen = (event) => {
    setShowMoreCategory1(event.currentTarget);
  };

  const handleNestedClose = (event) => {
    const related = event.relatedTarget;
    if (nestedRef.current && (nestedRef.current === related || nestedRef.current.contains(related))) {
      return;
    }
    setShowMoreCategory1(null);
  };

  const open1 = Boolean(showMoreCategory1);
  return (
    <ListItem disablePadding sx={{ fontSize: '12px' }}>
      <ListItemButton
        onMouseEnter={handleNestedOpen}
        onMouseLeave={handleNestedClose}
        sx={{ height: '35px' }}
        ref={nestedRef}
      >
        <ListItemText
          primary={item}
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
        <Popper
          onMouseLeave={handleNestedClose}
          sx={{
            zIndex: 1100,
            p: '10px',
            width: 'calc(100vw - 360px)',
            maxHeight: 'calc(100vh - 250px)',
            // minHeight: '800px',
            overflow: 'scroll',
          }}
          open={open1}
          // anchorEl={showMoreCategory1}
          anchorEl={ref.current}
          disablePortal={true}
          placement="right-start"
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [-8],
              },
            },
          ]}
        >
          <Paper sx={{ zIndex: 1100, minHeight: '295px' }}>{component}</Paper>
        </Popper>
      </ListItemButton>
    </ListItem>
  );
}

export default function CategorySearch() {
  const [search, setSearch] = useState('');
  const [showMoreCategory, setShowMoreCategory] = useState(null);
  const nestedRef = useRef(null);
  const pathname = usePathname();
  useEffect(() => {
    setSearch('');
  }, [pathname]);

  const handleClick = (event) => {
    setShowMoreCategory(showMoreCategory ? null : event.currentTarget);
  };

  const handleClose = (event) => {
    // if (showMoreCategory?.contains(event.target)) return;
    setShowMoreCategory(null);
  };
  const open = Boolean(showMoreCategory);

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

  return (
    <Grid sx={{ p: '10px 25px' }} item xs={12} container>
      <ClickAwayListener onClickAway={handleClose}>
        <div>
          <Button
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
            onClick={handleClick}
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
          <Popper
            sx={{ width: '300px', zIndex: 1100 }}
            open={open}
            anchorEl={showMoreCategory}
            disablePortal={true}
          >
            <Paper ref={nestedRef} sx={{ width: '100%', zIndex: 1100, mt: '10px' }}>
              <List>
                {Object.keys(categories).map((name, index) => {
                  return (
                    <SingleCategory
                      key={index}
                      item={name}
                      ref={nestedRef}
                      component={<BasicList name={name} data={categories[name]} />}
                    />
                  );
                })}
              </List>
            </Paper>
          </Popper>
        </div>
      </ClickAwayListener>

      <InputBase
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        sx={{
          // width: '100%',
          height: '40px',
          fontSize: '14px',
          bgcolor: '#d2cccc17',
          borderRadius: '8px',
          p: '0 20px',
          border: 'solid 1px #ffffffff',
          '&.Mui-focused': {
            // bgcolor: 'red',
            border: 'solid 1px #030303dd',
          },
          flexGrow: 1,
        }}
        placeholder="Searching for... "
        endAdornment={<SearchIcon />}
      />
      {/* <SearchIcon /> */}
    </Grid>
  );
}
