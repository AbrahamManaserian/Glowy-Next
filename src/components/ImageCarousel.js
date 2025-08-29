'use client';

import React, { useState, useEffect } from 'react';
// import useGetWindowWidth from '../hooks/useGetWindowWidth';
import { Box, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useGetWindowWidth } from '@/hooks/useGetWindowSize';

const ImageCarousel = ({ images, autoScroll = false, interval = 30 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(null); // Lock direction
  const [transition, setTransition] = useState('none');
  const [slidesToShow, setSlidesToShow] = useState(1);
  const windowWidth = useGetWindowWidth();

  const nextImage = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === images.length - slidesToShow) {
        setTransition('transform 0.1s ease-in-out');
      } else {
        setTransition('transform 0.3s ease-in-out');
      }
      return prevIndex === images.length - slidesToShow
        ? (prevIndex + slidesToShow) % images.length
        : (prevIndex + 1) % images.length;
    });
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        setTransition('transform 0.05s ease-in-out');
      } else {
        setTransition('transform 0.3s ease-in-out');
      }

      return prevIndex === 0 ? images.length - slidesToShow : prevIndex - 1;
    });
  };

  const handleStart = (x, y) => {
    // console.log('start');
    setStartPos({ x, y });
    setIsDragging(true);
    setIsHorizontal(null);
  };

  const handleMove = (x, y, event) => {
    const dy = y - startPos.y;
    const dx = x - startPos.x;

    // setCurrentTranslate(-currentIndex * 100 + (dx / window.innerWidth) * 200);
    if (!isHorizontal) {
      setIsHorizontal(Math.abs(dx) > Math.abs(dy));
    }

    // Only allow horizontal movement if locked to horizontal
    if (isHorizontal) {
      //   event.preventDefault();
      // console.log('asd');
      setCurrentTranslate(-currentIndex * 100 + (dx / window.innerWidth) * 200 - currentIndex);
    }
  };
  // const navigate = useNavigate();

  const handleEnd = (x) => {
    // console.log(startPos.x);
    if (!isDragging || !isHorizontal) {
      //   if (x - startPos.x === 0) {
      //     navigate(`/products?item=${currentIndex}`);
      //   }
      setIsDragging(false);
      setCurrentTranslate(-currentIndex * 100 - currentIndex); // Reset if not horizontal swipe
      return;
    }
    const swipeDistance = x - startPos.x;
    const minSwipeDistance = 40;

    if (swipeDistance > minSwipeDistance) {
      prevImage();
    } else if (swipeDistance < -minSwipeDistance) {
      nextImage();
    } else {
      console.log('asd');
      setCurrentTranslate(-currentIndex * 100 - currentIndex); // Snap back to current slide
    }

    setIsDragging(false);
  };

  const handleClickNavigate = (item, cordinat) => {
    if (cordinat - startPos.x === 0) {
      // navigate(`/product/${item}`);
    }
  };

  useEffect(() => {
    if (windowWidth >= 1100) {
      setSlidesToShow(5);
    } else if (windowWidth < 1100 && windowWidth >= 720) {
      setSlidesToShow(4);
    } else if (windowWidth < 720 && windowWidth >= 600) {
      setSlidesToShow(3);
    } else if (windowWidth < 600 && windowWidth >= 450) {
      setSlidesToShow(2);
    } else if (windowWidth < 450) {
      setSlidesToShow(1);
    }
  }, [windowWidth]);

  useEffect(() => {
    // console.log(currentIndex);
    // console.log(-currentIndex * 100 - currentIndex - 4.5);
    setCurrentTranslate(-currentIndex * 100);
  }, [currentIndex]);

  useEffect(() => {
    if (!autoScroll) return;

    const autoScrollInterval = setInterval(nextImage, interval);
    return () => clearInterval(autoScrollInterval);
  }, [autoScroll, interval]);

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (isDragging && isHorizontal) {
        e.preventDefault(); // Prevent vertical scrolling
      }
    };

    // Add touchmove listener with passive: false
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging, isHorizontal]);
  if (windowWidth === 0) return null;

  return (
    <div
      style={{
        ...styles.carouselContainer,
        borderRadius: '15px',
      }}
    >
      <div
        style={{
          ...styles.imageContainer,
          // alignContent: 'baseline',
          // alignItems: 'baseline',

          transform: `translateX(${currentTranslate / slidesToShow}%)`,
          transition: isDragging ? 'none' : transition,

          //   border: 'solid 1px',
        }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY, e)}
        onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => {
          if (isDragging) handleMove(e.clientX, e.clientY, e);
        }}
        onMouseUp={(e) => handleEnd(e.clientX)}
        onMouseLeave={(e) => {
          if (isDragging) handleEnd(e.clientX);
        }}
      >
        {images.map((image, index) => {
          return (
            <div
              style={{
                padding: '5px',
                flexShrink: 0,
                display: 'flex',
                width: `calc(${100 / slidesToShow}% - 10px)`,
                transition: 'all 0.8s',
                // alignItems: 'flex-end',
              }}
              key={index}
            >
              <Box
                // key={index}
                sx={{
                  p: '5px 0 20px 0',
                  // flexShrink: 0,
                  display: 'flex',
                  width: '100%',
                  // width: `calc(${100 / slidesToShow}% - 2px)`,
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: 'solid 1px white',
                  transition: 'all 0.5s',
                  '&:hover': {
                    border: 'solid 0.5px',
                  },
                  borderRadius: '10px',
                  bgcolor: 'white',
                  cursor: 'pointer',
                }}
                onClick={(e) => handleClickNavigate(index, e.clientX)}
                onDragStart={(e) => e.preventDefault()} // Prevent dragging
                //   onClick={(e) => handleClickNavigate(index, e.clientX)}
              >
                <Box
                  // onClick={(e) => handleClickNavigate(index, e.clientX)}
                  sx={{
                    display: 'flex',

                    height: windowWidth < 450 ? '50vh' : '45vh',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    //   bgcolor: '#f1f4f7de',
                    borderRadius: '15px',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'scale(1.08,1.08)',
                    },
                  }}
                >
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    style={{
                      ...styles.image,
                    }}
                    onDragStart={(e) => e.preventDefault()} // Prevent dragging
                  />
                </Box>

                <Typography
                  sx={{
                    textTransform: 'uppercase',
                    color: '#616161',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: '10px 0 0 0',
                  }}
                >
                  Arnak 10 Years
                </Typography>
              </Box>
            </div>
          );
        })}
      </div>

      <ArrowBackIosIcon
        sx={{
          ...styles.navButton,
          // right: '55px',
          right: 'calc(50% + 30px - 1rem)',
        }}
        onClick={prevImage}
      />
      <ArrowForwardIosIcon
        sx={{
          ...styles.navButton,
          // right: '10px',
          right: 'calc(50% - 20px - 1rem)',
        }}
        onClick={nextImage}
      />
    </div>
  );
};

const styles = {
  carouselContainer: {
    position: 'relative',
    width: '100%',
    margin: 'auto',
    overflow: 'hidden',
    userSelect: 'none',
    padding: '0 0 50px 0',
  },
  imageContainer: {
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
  },
  image: {
    // height: '70%',
    width: '70%',
    flexShrink: 0,
    pointerEvents: 'none', // Disable pointer events on images
  },
  navButton: {
    position: 'absolute',
    bottom: '0',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#9e9e9e',
    '&:hover': {
      color: '#424242',
    },
  },
};

export default ImageCarousel;
