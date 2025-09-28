'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useGlobalContext } from '@/app/GlobalContext';
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { handleAddItemToCart } from '@/app/functions/hadleAddItemToCart';

const images = [
  '/images/w536b1l7mqqhu3f49c175z70yk5ld05f.webp',
  '/images/ov4x8tqv11m5xi1kcm868rz43f7isui0.webp',
  '/images/12.webp',
  '/images/w33w5wkxtoc8ine2mnc4pbfwqt40rfsh.webp',
  '/images/ov4x8tqv11m5xi1kcm868rz43f7isui0.webp',
  '/images/w536b1l7mqqhu3f49c175z70yk5ld05f.webp',
  '/images/w33w5wkxtoc8ine2mnc4pbfwqt40rfsh.webp',
  '/images/12.webp',
];

export default function AlertAddCartItem({ item }) {
  const { openCartAlert, setOpenCartAlert, setCart } = useGlobalContext();
  const handleClose = () => {
    setOpenCartAlert(null);
  };

  return (
    <React.Fragment>
      <Dialog
        open={openCartAlert || openCartAlert === 0}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '110px',
            borderBottom: '1px dashed #dde2e5ff',
            overflow: 'hidden',
            p: { xs: '0 16px', sm: '0 24px' },
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              padding: '5px',
              boxSizing: 'border-box',
              bgcolor: '#d2cccc30',
              //   bgcolor: 'red',
              // m: '10px 15px 10px 25px',
              borderRadius: '10px',
              width: '100px',
              height: '100px',
              overflow: 'hidden',
            }}
          >
            {(openCartAlert || openCartAlert === 0) && (
              <Image
                src={images[openCartAlert]}
                alt=""
                width={200}
                height={200}
                style={{ width: '100%', height: 'auto' }}
              />
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'column',
              boxSizing: 'border-box',
              height: '80px',
              justifyContent: 'space-between',
              overflow: 'hidden',
              ml: '15px',
            }}
          >
            <div>
              <Typography
                sx={{
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '240px',
                  color: '#191818f6',
                  fontWeight: 300,
                }}
              >
                Armani Stronger With yuo Absolutely
              </Typography>
              <Typography
                sx={{
                  fontSize: '15px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '220px',
                  mt: '2px',
                }}
              >
                $ 230.00
              </Typography>
            </div>
          </Box>
        </Box>

        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button
            onClick={() => handleAddItemToCart(openCartAlert + '', setCart, setOpenCartAlert)}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
