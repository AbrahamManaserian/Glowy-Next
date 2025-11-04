'use client';

import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useAdminData } from '../components/AdminContext';
import { categories } from '@/components/ui/CategoriesDekstop';
import AddEditProductInputs from '../components/AddEditProductInputs';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import NextImage from 'next/image';
import { resizeFile } from '../add-product/page';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/navigation';

const categoriesObj = categories;

export default function ChangeProductPage() {
  const [deletedImages, setDeletedImages] = useState([]);
  const [height, setHeight] = useState(0);
  const [requiredFields, setRequiredFields] = useState(false);
  const [product, setProduct] = useState(null);
  const { data, setLoading } = useAdminData();
  const router = useRouter();

  const [inputs, setInputs] = useState({
    name: '',
    category: '',
    subCategory: '',
    type: '',
    description: '',
    descriptionEn: '',
    descriptionRu: '',
    images: [],
    price: null,
    disacuntedPrice: null,
    smallImage: '',
    mainImage: '',
    quantity: null,
    supplier: '',
    cost: null,
  });

  useEffect(() => {
    setDeletedImages([]);
    if (product) {
      async function getProduct() {
        const productRef = doc(db, 'glowy-products', product.id);
        const productData = await getDoc(productRef);
        if (productData.exists()) {
          setInputs(productData.data());
        }
      }
      getProduct();
    } else {
      setInputs({
        name: '',
        category: '',
        subCategory: '',
        type: '',
        description: '',
        descriptionEn: '',
        descriptionRu: '',
        images: [],
        price: null,
        disacuntedPrice: null,
        smallImage: '',
        mainImage: '',
        quantity: null,
        supplier: '',
        cost: null,
      });
    }
  }, [product]);
  useEffect(() => {
    if (requiredFields) {
      setRequiredFields(false);
    }
  }, [inputs]);
useEffect(() => {
  const handleResize = () => setHeight(window.innerWidth);
  handleResize(); // set initial height
  window.addEventListener('resize', handleResize);

  return () => window.removeEventListener('resize', handleResize);
}, []);

  const handleChangeCategory = (event) => {
    // console.log(categoriesObj[event.target.value]);
    setInputs({ ...inputs, category: event.target.value, subCategory: '', type: '' });
  };

  const handleChangeSubCategory = (event) => {
    setInputs({ ...inputs, subCategory: event.target.value, type: '' });
  };

  const handleChangeSelect = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    // console.log(event.target.name);
  };

  const handleUploadImage = async (files) => {
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
      // console.log(loadedImages);
      setInputs((prev) => ({
        ...prev,
        images: prev.images.concat(loadedImages),
      }));
    });
    setLoading(false);
  };
  // console.log(inputs);
  // console.log(deletedImages);
  const handleDeleteImage = (index) => {
    if (typeof inputs.images[index].file === 'string') {
      setDeletedImages([...deletedImages, inputs.images[index].id]);
    }
    setInputs({ ...inputs, images: inputs.images.filter((_, i) => i !== index) });
  };

  const hadleChangeInputs = async (e) => {
    if (e.target.name === 'mainImage') {
      setLoading(true);
      const smallImage = await resizeFile(e.target.files[0], 20);
      const bigImage = await resizeFile(e.target.files[0], 60);
      setLoading(false);
      const smallImageLoad = new Image();
      smallImageLoad.src = URL.createObjectURL(smallImage);
      smallImageLoad.onload = () => {
        const imageDetail = { file: smallImage, width: smallImageLoad.width, height: smallImageLoad.height };
        setInputs({
          ...inputs,
          mainImage: { file: bigImage, width: smallImageLoad.width, height: smallImageLoad.height },
          smallImage: imageDetail,
        });
        URL.revokeObjectURL(smallImageLoad.src); // cleanup
      };
    } else {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
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
    return inputs.images.map((i) => {
      if (typeof i.file === 'string') {
        return i.file;
      } else {
        return URL.createObjectURL(i.file);
      }
    });
  }, [inputs.images]);

  const editProduct = async () => {
    if (!product || !inputs.cost || !inputs.name || !inputs.category || !inputs.price || !inputs.mainImage) {
      setRequiredFields(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // alert('asd');
      return;
    }
    const storage = getStorage();
    const imageArr = [];
    let mainImage = { ...inputs.mainImage };
    let smallImage = { ...inputs.smallImage };
    setLoading(true);
    try {
      if (typeof inputs.mainImage.file !== 'string') {
        const mainImageStorageRef = ref(storage, `glowy-products/${product.id}/main`);

        await uploadBytes(mainImageStorageRef, inputs.mainImage.file).then((snapshot) => {
          return getDownloadURL(snapshot.ref).then((url) => {
            mainImage.file = url;
            // console.log(url);
          });
        });

        const smallImageStorageRef = ref(storage, `glowy-products/${product.id}/small`);
        await uploadBytes(smallImageStorageRef, inputs.smallImage.file).then((snapshot) => {
          return getDownloadURL(snapshot.ref).then((url) => {
            smallImage.file = url;
            // console.log(url);
          });
        });
      }
      const usedIds = inputs.images.map((item) => item.id);
      const availableImgIds = [];
      [0, 1, 2, 3, 4, 5].forEach((item, index) => {
        if (!usedIds.includes(item) && !deletedImages.includes(item)) {
          availableImgIds.push(item);
        }
      });

      await Promise.all(
        inputs.images.map(async (img, index) => {
          if (typeof img.file !== 'string') {
            try {
              let imgId = deletedImages.length > 0 ? deletedImages[deletedImages.length - 1] : null;
              if (imgId === null) {
                imgId = availableImgIds[availableImgIds.length - 1];
                availableImgIds.pop();
              }
              deletedImages.pop();

              const imageStorageRef = ref(storage, `glowy-products/${inputs.id}/images/${imgId}`);

              await uploadBytes(imageStorageRef, img.file).then((snapshot) => {
                return getDownloadURL(snapshot.ref).then((url) => {
                  imageArr.push({ ...img, file: url, id: imgId });
                  // console.log(url);
                });
              });
            } catch (error) {
              console.log(error);
            }
          } else {
            imageArr.push(img);
          }
        })
      );
      await Promise.all(
        deletedImages.map(async (img, index) => {
          try {
            const desertRef = ref(storage, `glowy-products/${inputs.id}/images/${img}`);
            deleteObject(desertRef);
          } catch (error) {
            console.log(error);
          }
        })
      );
      const productRef = doc(db, 'glowy-products', inputs.id);

      await setDoc(productRef, {
        ...inputs,
        updatedAt: Date.now(),
        mainImage: mainImage,
        smallImage: smallImage,
        images: imageArr,
      });
      setProduct(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      router.refresh();
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  return (
    <Grid
      sx={{
        p: { xs: '0 15px 60px 15px', sm: '0 25px 60px 25px' },
        boxSizing: 'border-box',
        mt: '20px',
      }}
      minHeight={'100vh'}
      alignContent={'flex-start'}
      container
      size={12}
    >
      <Typography sx={{ fontSize: '22px', fontWeight: 500, width: '100%' }}>Edit product</Typography>
      <Typography sx={{ fontSize: '16px', fontWeight: 500, width: '100%', textAlign: 'center', mt: '20px' }}>
        Type Product Name or Id
      </Typography>
      <Autocomplete
        size="small"
        options={data['project-details'].allProductsIds}
        getOptionLabel={(option) => `${option.id} - ${option.name}`}
        value={product}
        onChange={(event, newValue) => setProduct(newValue)}
        renderInput={(params) => <TextField {...params} label="Select product" placeholder="Choose..." />}
        sx={{ width: { xs: '100%', sm: '400px' }, m: '20px auto' }}
      />

      <AddEditProductInputs
        inputs={inputs}
        requiredFields={requiredFields}
        hadleChangeInputs={hadleChangeInputs}
        setInputs={setInputs}
        handleChangeCategory={handleChangeCategory}
        categoriesObj={categories}
        handleChangeSubCategory={handleChangeSubCategory}
        handleChangeSelect={handleChangeSelect}
        data={data.suppliers}
        handleUploadImage={handleUploadImage}
        imagePreviews={imagePreviews}
        height={height}
        mainImage={mainImage}
        handleDeleteImage={handleDeleteImage}
        handleClick={editProduct}
        buttonText="Edit Product"
      />
    </Grid>
  );
}
