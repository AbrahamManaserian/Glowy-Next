'use client';

import styled from '@emotion/styled';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useMemo } from 'react';
import NextImage from 'next/image';
import Resizer from 'react-image-file-resizer';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const resizeFile = (file, quality) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1100,
      1100,
      'JPEG',
      quality,
      0,
      (uri) => {
        resolve(uri);
      },
      'file'
    );
  });

export default function ImageInputs({ requiredFields, inputs, setInputs, height, setLoading }) {
  const handleUploadMainImage = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setLoading(true);
      const smallImage = await resizeFile(file, 20);
      const bigImage = await resizeFile(file, 60);
      setLoading(false);
      const smallImageLoad = new Image();
      smallImageLoad.src = URL.createObjectURL(smallImage);
      smallImageLoad.onload = () => {
        const imageDetails = {
          file: smallImage,
          width: smallImageLoad.width,
          height: smallImageLoad.height,
        };
        setInputs({
          ...inputs,
          mainImage: { file: bigImage, width: smallImageLoad.width, height: smallImageLoad.height },
          smallImage: imageDetails,
        });

        URL.revokeObjectURL(smallImageLoad.src); // cleanup
      };
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleUploadImages = async (files) => {
    const items = Array.from(files);
    const fileArray = items.slice(0, 6 - inputs.images.length);
    setLoading(true);
    const loadImage = async (file) =>
      await new Promise(async (resolve) => {
        const smallImage = await resizeFile(file, 60);

        const img = new Image();
        img.src = URL.createObjectURL(smallImage);

        img.onload = () => {
          resolve({ file: smallImage, width: img.width, height: img.height });
          URL.revokeObjectURL(img.src); // cleanup
        };
      });

    await Promise.all(fileArray.map(loadImage)).then((loadedImages) => {
      setInputs((prev) => ({
        ...prev,
        images: prev.images.concat(loadedImages),
      }));
    });
    setLoading(false);
  };

  const handleDeleteImage = (index) => {
    if (typeof inputs.images[index].file === 'string') {
      setDeletedImages([...deletedImages, inputs.images[index].id]);
    }
    setInputs({ ...inputs, images: inputs.images.filter((_, i) => i !== index) });
  };

  const mainImage = useMemo(() => {
    if (inputs.mainImage) {
      if (typeof inputs.mainImage.file === 'string') {
        return inputs.mainImage.file;
      } else {
        return URL.createObjectURL(inputs.mainImage.file);
      }
    }
  }, [inputs.mainImage]);

  const imagePreviews = useMemo(() => {
    return inputs.images.map((i) => (typeof i.file === 'string' ? i.file : URL.createObjectURL(i.file)));
  }, [inputs.images]);

  return (
    <>
      <div style={{ width: '100%' }}>
        <Button
          color={requiredFields && !inputs.mainImage ? 'error' : 'primary'}
          sx={{ textTransform: 'capitalize' }}
          component="label"
          role={undefined}
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload main image
          <VisuallyHiddenInput
            name="mainImage"
            accept="image/*"
            type="file"
            onChange={(e) => {
              handleUploadMainImage(e);
              e.target.value = '';
            }}
          />
        </Button>
      </div>
      <Typography
        color="error"
        sx={{
          visibility: requiredFields && !inputs.mainImage ? 'visible' : 'hidden',
          width: '100%',
          fontSize: '12px',
          // my: '3px',
        }}
      >
        Required
      </Typography>
      <Box
        sx={{
          position: 'relative',
          border: '1px solid #bdc5c9ff',
          width: { xs: '100%', sm: '250px' },
          height: { xs: `${height - 10}px`, sm: '250px' },
          p: '10px',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          boxSizing: 'border-box',
        }}
      >
        {inputs.mainImage && (
          <>
            <CloseOutlinedIcon
              onClick={() => setInputs({ ...inputs, mainImage: '', smallImage: '' })}
              sx={{ bgcolor: 'red', position: 'absolute', top: 0, right: 0, color: 'white' }}
            />

            <NextImage
              src={mainImage}
              alt="Preview"
              width={200}
              height={200}
              style={{
                width: inputs.mainImage.height < inputs.mainImage.width ? '100%' : 'auto',
                height: inputs.mainImage.height >= inputs.mainImage.width ? '100%' : 'auto',
              }}
            />
          </>
        )}
      </Box>

      <div style={{ width: '100%', margin: '15px 0' }}>
        <Button
          sx={{ textTransform: 'capitalize' }}
          component="label"
          role={undefined}
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload images
          <VisuallyHiddenInput
            accept="image/*"
            type="file"
            onChange={(event) => {
              handleUploadImages(event.target.files);
              event.target.value = '';
            }}
            multiple
          />
        </Button>
      </div>

      <Grid size={12} container spacing={2}>
        {[1, 2, 3, 4, 5, 6].map((img, index) => {
          return (
            <Box
              key={index}
              sx={{
                position: 'relative',
                border: '1px solid #bdc5c9ff',
                width: { xs: 'calc(50% - 10px)', sm: '150px' },
                height: { xs: `${height / 2 - 10}px`, sm: '150px' },
                // p: '10px',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                boxSizing: 'border-box',
              }}
            >
              {imagePreviews[index] && (
                <CloseOutlinedIcon
                  onClick={() => handleDeleteImage(index)}
                  sx={{ bgcolor: 'red', position: 'absolute', top: 0, right: 0, color: 'white' }}
                />
              )}
              {imagePreviews[index] && (
                <NextImage
                  src={imagePreviews[index]}
                  alt="Preview"
                  width={200}
                  height={200}
                  style={{
                    width: inputs.images[index].height < inputs.images[index].width ? '100%' : 'auto',
                    height: inputs.images[index].height >= inputs.images[index].width ? '100%' : 'auto',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Grid>
    </>
  );
}
