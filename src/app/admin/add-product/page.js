'use client';

import { Grid, Typography } from '@mui/material';
import AddEditProductInputs from '../components/AddEditProductInputs';
import { useEffect, useState } from 'react';
import { useAdminData } from '../components/AdminContext';
import Resizer from 'react-image-file-resizer';
import { arrayUnion, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '@/firebase';
import { useRouter } from 'next/navigation';

const resizeFile = (file, quality) =>
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

export default function AddProductPage() {
  const [height, setHeight] = useState(0);
  const { data, setLoading } = useAdminData();
  const router = useRouter();

  const [inputs, setInputs] = useState({
    name: '',
    category: '',
    subCategory: '',
    brand: '',
    model: '',
    size: '',
    unit: '',
    type: '',
    coast: '',
    price: '',
    disacountedPrice: '',
    qouantity: '',
    supplier: '',
    images: [],
    smallImage: '',
    mainImage: '',
    descriptionAm: '',
    descriptionEn: '',
    descriptionRu: '',
    optionKey: '',
    optionValue: '',
    optionPrice: '',
    availableOptions: [],
  });

  const addProduct = async () => {
    console.log(inputs);
    if (!inputs.name || !inputs.mainImage) {
      // console.log(data['project-details'].lastProductId);
      // setRequiredFields(true);
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // try {
    //   setLoading(true);
    //   function getNextProductId(id) {
    //     const next = parseInt(id, 10) + 1; // increase by 1
    //     return next.toString().padStart(6, '0'); // keep 7 digits
    //   }

    //   const newId = getNextProductId(data['project-details'].lastProductId);
    //   const storage = getStorage();
    //   const mainImageStorageRef = ref(storage, `glowy-products/${newId}/main`);
    //   const smallImageStorageRef = ref(storage, `glowy-products/${newId}/small`);
    //   const productRef = doc(db, 'glowy-products', newId);
    //   const detailRef = doc(db, 'details', 'project-details');
    //   let smallImage = {};
    //   let mainImage = {};
    //   const imageArr = [];
    //   console.log(newId);

    //   await Promise.all(
    //     inputs.images.map(async (img, index) => {
    //       try {
    //         const imageStorageRef = ref(storage, `glowy-products/${newId}/images/${index}`);

    //         // console.log(img);

    //         await uploadBytes(imageStorageRef, img.file).then((snapshot) => {
    //           return getDownloadURL(snapshot.ref).then((url) => {
    //             imageArr.push({ ...inputs.images[index], file: url, id: index });
    //             // console.log(url);
    //           });
    //         });
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     })
    //   );

    //   await uploadBytes(mainImageStorageRef, inputs.mainImage.file).then((snapshot) => {
    //     return getDownloadURL(snapshot.ref).then((url) => {
    //       mainImage = { ...inputs.mainImage, file: url };
    //       // console.log(url);
    //     });
    //   });

    //   await uploadBytes(smallImageStorageRef, inputs.smallImage.file).then((snapshot) => {
    //     return getDownloadURL(snapshot.ref).then((url) => {
    //       smallImage = { ...inputs.smallImage, file: url };
    //       // console.log(url);
    //     });
    //   });

    //   const productData = {
    //     ...inputs,
    //     id: newId,
    //     createdAt: Date.now(),
    //     updatedAt: Date.now(),
    //     mainImage: mainImage,
    //     smallImage: smallImage,
    //     images: imageArr,
    //   };

    //   await setDoc(productRef, productData);

    //   await updateDoc(detailRef, {
    //     allProductsIds: arrayUnion({ id: newId, name: inputs.name }),
    //     lastProductId: newId,
    //   });

    //   router.refresh();
    //   setLoading(false);
    //   window.scrollTo({ top: 0, behavior: 'smooth' });
    // setInputs({
    //   name: '',
    //   category: '',
    //   subCategory: '',
    //   brand: '',
    //   model: '',
    //   size: '',
    //   unit: '',
    //   type: '',
    //   coast: '',
    //   price: '',
    //   disacountedPrice: '',
    //   qouantity: '',
    //   supplier: '',
    //   images: [],
    //   smallImage: '',
    //   mainImage: '',
    //   descriptionAm: '',
    //   descriptionEn: '',
    //   descriptionRu: '',
    // optionKey: '',
    // optionValue:'',
    // optionPrice: '',
    //  availableOptions: []

    // });
    // } catch (e) {
    //   setLoading(false);
    //   console.log(e);
    // }
  };

  const hadleChangeInputs = (e) => {
    if (e.target.name === 'category') {
      setInputs({
        name: '',
        category: e.target.value,
        subCategory: '',
        brand: '',
        model: '',
        size: '',
        unit: '',
        type: '',
        coast: '',
        price: '',
        disacountedPrice: '',
        qouantity: '',
        supplier: '',
        images: [],
        smallImage: '',
        mainImage: '',
        descriptionAm: '',
        descriptionEn: '',
        descriptionRu: '',
        optionKey: '',
        optionValue: '',
        optionPrice: '',
        availableOptions: [],
      });
    } else if (e.target.name === 'subCategory') {
      setInputs({
        name: inputs.name,
        category: inputs.category,
        subCategory: e.target.value,
        brand: '',
        model: '',
        size: '',
        unit: '',
        type: '',
        coast: '',
        price: '',
        disacountedPrice: '',
        qouantity: '',
        supplier: '',
        images: [],
        smallImage: '',
        mainImage: '',
        descriptionAm: '',
        descriptionEn: '',
        descriptionRu: '',
        optionKey: '',
        optionValue: '',
        optionPrice: '',
        availableOptions: [],
      });
    } else {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
  };

  const handleUploadMainImage = async (e) => {
    // console.log(e.target.files);
    const input = e.target;
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
        const imageDetails = { file: smallImage, width: smallImageLoad.width, height: smallImageLoad.height };
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
      // console.log(loadedImages);
      setInputs((prev) => ({
        ...prev,
        images: prev.images.concat(loadedImages),
      }));
    });
    setLoading(false);
  };

  useEffect(() => {
    const handleResize = () => setHeight(window.innerWidth);
    handleResize(); // set initial height
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <Typography sx={{ fontSize: '22px', fontWeight: 500, width: '100%' }}>Add new product</Typography>
      <AddEditProductInputs
        handleUploadMainImage={handleUploadMainImage}
        handleUploadImages={handleUploadImages}
        data={data.suppliers}
        inputs={inputs}
        setInputs={setInputs}
        hadleChangeInputs={hadleChangeInputs}
        buttonText="Add Product"
        height={height}
        handleClick={addProduct}
      />
    </Grid>
  );
}
