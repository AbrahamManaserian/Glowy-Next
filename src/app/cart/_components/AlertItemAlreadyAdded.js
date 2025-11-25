'use client';

import { useGlobalContext } from '@/app/GlobalContext';
import { Box, Button, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

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

export default function AlertItemAlreadyAdded() {
  const { openItemAddedAlert, setOpenItemAddedAlert } = useGlobalContext();
  const handleClose = () => {
    setOpenItemAddedAlert(null);
  };

  return (
    <React.Fragment>
      <Dialog
        open={openItemAddedAlert}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Item is already in your cart'}</DialogTitle>
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
            {openItemAddedAlert && (
              <Image
                src={images[openItemAddedAlert]}
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
          <Button sx={{ textTransform: 'capitalize' }} onClick={handleClose}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
