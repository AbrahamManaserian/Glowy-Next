'use client';

import { Box, Grid } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import useEmblaCarousel from 'embla-carousel-react';

import { useCallback, useEffect, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export const ProductImageComp = ({ images, idNum }) => {
  const [state, setState] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    window.history.pushState(null, '');
  };

  const handleClose = () => {
    setOpen(false);
    window.history.back();
  };

  useEffect(() => {
    const onPopState = () => {
      setOpen(false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const [imgIndex, setImgIndex] = useState(0);
  const [emblaRefBig, emblaApiBig] = useEmblaCarousel({ loop: false, align: 'center', startIndex: 0 });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'center', dragFree: true });

  const scrollPrev = useCallback(() => {
    return emblaApiBig && emblaApiBig.scrollPrev();
  }, [emblaApiBig]);

  useEffect(() => {
    if (!emblaApiBig || !emblaApi) return;
    if (emblaApiBig.selectedScrollSnap() - emblaApi.selectedScrollSnap() > 2) {
      emblaApi.scrollNext();
    } else {
      emblaApi.scrollPrev();
    }
  }, [imgIndex]);

  useEffect(() => {
    if (!emblaApiBig) return;
    emblaApiBig.on('select', (EmblaEventType) => {
      // emblaApi.scrollTo(emblaApiBig.selectedScrollSnap());
      setImgIndex(emblaApiBig.selectedScrollSnap());
    });
  }, [emblaApiBig]);

  const scrollNext = useCallback(() => emblaApiBig && emblaApiBig.scrollNext(), [emblaApiBig]);

  const handleClickCarouselScroll = (action, index) => {
    if (index || index === 0) {
      emblaApiBig.scrollTo(index);
      setImgIndex(index);
    } else {
      if (action === 'next') {
        if (imgIndex === images.length - 1) return;

        setImgIndex(imgIndex + 1);
        scrollNext();
      } else {
        if (imgIndex === 0) return;

        setImgIndex(imgIndex - 1);
        scrollPrev();
      }
    }
  };

  return (
    <Grid
      sx={{ borderRadius: '25px', mt: '20px' }}
      size={{ xs: 12, sm: 12, md: 6 }}
      container
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: '5px', width: '100%' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <ChevronLeftIcon
            onClick={() => handleClickCarouselScroll()}
            sx={{
              color: '#747982ff',
              fontSize: '30px',
              cursor: 'pointer',
              mr: '5px',
              position: 'absolute',
              top: 'calc(50% - 10px)',
              left: '10px',
              WebkitTapHighlightColor: 'transparent',
              zIndex: 10,
            }}
          />
          <NavigateNextIcon
            onClick={() => handleClickCarouselScroll('next')}
            sx={{
              color: '#747982ff',
              fontSize: '30px',
              cursor: 'pointer',
              position: 'absolute',
              top: 'calc(50% - 10px)',
              right: '10px',
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'relative',
              margin: '0 auto',
              width: '100%',
            }}
          >
            <div
              ref={emblaRefBig}
              style={{
                overflow: 'hidden',
              }}
            >
              <Box sx={{ display: 'flex' }}>
                {images.map((img, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        flex: `0 0 ${100}%`,
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          height: { xs: '50vh', sm: '60vh' },
                          justifyContent: 'center',
                          cursor: 'zoom-in',
                        }}
                        onClick={handleOpen}
                      >
                        <img
                          width={500}
                          height={500}
                          style={{
                            width: 'auto',
                            height: '100%',
                            objectFit: 'cover',
                            overflow: 'hidden',
                            borderRadius: '10px',
                          }}
                          src={img.file}
                          alt="image"
                        />
                      </Box>
                    </div>
                  );
                })}
              </Box>
            </div>
          </div>
        </div>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ width: { xs: '95%', sm: '60%' }, position: 'relative' }}>
          <div
            style={{
              position: 'relative',
              margin: '0 auto',
              width: '100%',
            }}
          >
            <div
              ref={emblaRef}
              style={{
                overflow: 'hidden',
              }}
            >
              <Box sx={{ display: 'flex' }}>
                {images.map((img, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => handleClickCarouselScroll('', index)}
                      style={{
                        flex: `0 0 20%`,
                        boxSizing: 'border-box',
                        padding: '5px',
                      }}
                    >
                      <Box
                        sx={{
                          WebkitTapHighlightColor: 'transparent',
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'center',
                          opacity: imgIndex === index ? 1 : 0.5,
                          border: 1.5,
                          cursor: 'pointer',
                          borderRadius: '8px',
                          borderColor: imgIndex === index ? '#ff3d00' : 'rgba(216, 66, 21, 0)',
                          transition: ' all 0.5s ease',
                          overflow: 'hidden',
                          p: '5px',
                        }}
                      >
                        <img
                          width={200}
                          height={200}
                          style={{ width: '100%', height: 'auto', overflow: 'hidden', objectFit: 'contain' }}
                          src={img.file}
                          alt="image"
                        />
                      </Box>
                    </div>
                  );
                })}
              </Box>
            </div>
          </div>
        </Box>
      </Box>
      <Lightbox
        open={open}
        close={handleClose}
        index={imgIndex}
        on={{
          view: ({ index }) => setImgIndex(index),
        }}
        slides={images.map((img) => ({ src: img.file }))}
        plugins={[Zoom, Thumbnails]}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
        }}
        render={{
          iconPrev: () => <ChevronLeftIcon sx={{ fontSize: 32, color: 'white', opacity: 0.7 }} />,
          iconNext: () => <NavigateNextIcon sx={{ fontSize: 32, color: 'white', opacity: 0.7 }} />,
          iconClose: () => <CloseIcon sx={{ fontSize: 28, color: 'white', opacity: 0.7 }} />,
          iconZoomIn: () => <ZoomInIcon sx={{ fontSize: 28, color: 'white', opacity: 0.7 }} />,
          iconZoomOut: () => <ZoomOutIcon sx={{ fontSize: 28, color: 'white', opacity: 0.7 }} />,
        }}
      />
    </Grid>
  );
};
