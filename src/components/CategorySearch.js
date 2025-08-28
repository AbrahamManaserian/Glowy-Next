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
import { useRef, useState } from 'react';
import { SearchIcon } from './icons';
import BasicList from './testList';

const listItems = ['Abraham', 'Elen', 'Liana', 'Luse  '];

function SingleCategory({ item, component }) {
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
          sx={{ zIndex: 1900, pl: '10px' }}
          open={open1}
          anchorEl={showMoreCategory1}
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
          <Paper sx={{ width: '100%', zIndex: 1900 }}>{component}</Paper>
        </Popper>
      </ListItemButton>
    </ListItem>
  );
}

export default function CategorySearch() {
  const [showMoreCategory, setShowMoreCategory] = useState(null);
  const nestedRef = useRef(null);

  const handleClick = (event) => {
    setShowMoreCategory(showMoreCategory ? null : event.currentTarget);
  };

  const handleClose = (event) => {
    if (showMoreCategory?.contains(event.target)) return;
    setShowMoreCategory(null);
  };

  const open = Boolean(showMoreCategory);

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
            sx={{ width: '300px', zIndex: 1900 }}
            open={open}
            anchorEl={showMoreCategory}
            disablePortal={true}
          >
            <Paper sx={{ width: '100%', zIndex: 1900, mt: '10px' }}>
              <List>
                {listItems.map((name, index) => {
                  return <SingleCategory key={index} item={name} component={<BasicList name={name} />} />;
                })}
              </List>
            </Paper>
          </Popper>
        </div>
      </ClickAwayListener>

      <Box
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexGrow: 1,
          bgcolor: '#d2cccc17',

          borderRadius: '4px',
          p: '0 12px',
        }}
      >
        <InputBase sx={{ width: '100%', fontSize: '14px' }} placeholder="Searching for... " />
        <SearchIcon />
      </Box>
    </Grid>
  );
}
