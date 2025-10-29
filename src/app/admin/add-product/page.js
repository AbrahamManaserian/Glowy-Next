'use client';

import { categories } from '@/components/ui/CategoriesDekstop';
import { Grid, Typography } from '@mui/material';
import Resizer from 'react-image-file-resizer';
import { useEffect, useMemo, useState } from 'react';
import { arrayUnion, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '@/firebase';
import { useAdminData } from '../components/AdminContext';
import AddEditProductInputs from '../components/AddEditProductInputs';
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

const categoriesObj = categories;

export default function AddProduct() {
  const { data, setLoading } = useAdminData();
  const router = useRouter();
  const [lastProductId, setLastProductId] = useState('');
  const [height, setHeight] = useState(0);
  const [requiredFields, setRequiredFields] = useState(false);
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
    const getLastProductId = async () => {
      try {
        const docRef = doc(db, 'details', 'project-details');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // console.log('Document data:', docSnap.data());
          setLastProductId(docSnap.data().lastProductId);
        } else {
          // docSnap.data() will be undefined in this case
          console.log('No such document!');
          setLastProductId('000000');
        }
      } catch (e) {
        console.log(e);
      }
    };
    getLastProductId();
  }, []);
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

  const handleDeleteImage = (index) => {
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
    if (inputs.mainImage) return URL.createObjectURL(inputs.mainImage.file);
  }, [inputs.mainImage]);

  const imagePreviews = useMemo(() => {
    return inputs.images.map((i) => URL.createObjectURL(i.file));
  }, [inputs.images]);

  const handleAddProduct = async () => {
    if (!lastProductId) {
      return;
    }

    if (!inputs.cost || !inputs.name || !inputs.category || !inputs.price || !inputs.mainImage) {
      setRequiredFields(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // alert('asd');
      return;
    }
    setLoading(true);
    function getNextProductId() {
      const next = parseInt(lastProductId, 10) + 1; // increase by 1
      return next.toString().padStart(6, '0'); // keep 7 digits
    }

    try {
      const newId = getNextProductId();
      const storage = getStorage();
      const imageArr = [];

      await Promise.all(
        inputs.images.map(async (img, index) => {
          try {
            const imageStorageRef = ref(storage, `glowy-products/${newId}/images/${index}`);

            // console.log(img);

            await uploadBytes(imageStorageRef, img.file).then((snapshot) => {
              return getDownloadURL(snapshot.ref).then((url) => {
                imageArr.push({ ...inputs.images[index], file: url });
                // console.log(url);
              });
            });
          } catch (error) {
            console.log(error);
          }
        })
      );

      const mainImageStorageRef = ref(storage, `glowy-products/${newId}/main`);
      let mainImage = {};

      await uploadBytes(mainImageStorageRef, inputs.mainImage.file).then((snapshot) => {
        return getDownloadURL(snapshot.ref).then((url) => {
          mainImage = { ...inputs.mainImage, file: url };
          // console.log(url);
        });
      });

      const smallImageStorageRef = ref(storage, `glowy-products/${newId}/small`);
      let smallImage = {};
      await uploadBytes(smallImageStorageRef, inputs.smallImage.file).then((snapshot) => {
        return getDownloadURL(snapshot.ref).then((url) => {
          smallImage = { ...inputs.smallImage, file: url };
          // console.log(url);
        });
      });

      // console.log(imageArr);
      const category = categoriesObj[inputs.category].routTo;
      const subCategory = inputs.subCategory ? categoriesObj[inputs.category][inputs.subCategory].routTo : '';
      const type = inputs.type ? categoriesObj[inputs.category][inputs.subCategory][inputs.type] : '';

      const productData = {
        ...inputs,
        // category: category,
        // subCategory: subCategory,
        // type: type,
        id: newId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mainImage: mainImage,
        smallImage: smallImage,
        images: imageArr,
      };

      const productRef = doc(db, 'glowy-products', newId);
      const detailRef = doc(db, 'details', 'project-details');
      // console.log(categoriesObj[inputs.category][inputs.subCategory].routTo);

      await setDoc(productRef, productData);

      await updateDoc(detailRef, {
        allProductsIds: arrayUnion({ id: newId, name: inputs.name }),
        lastProductId: newId,
      });
      setLastProductId(newId);
      router.refresh();
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  // console.log(inputs);
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
        inputs={inputs}
        requiredFields={requiredFields}
        hadleChangeInputs={hadleChangeInputs}
        setInputs={setInputs}
        handleChangeCategory={handleChangeCategory}
        categoriesObj={categoriesObj}
        handleChangeSubCategory={handleChangeSubCategory}
        handleChangeSelect={handleChangeSelect}
        data={data.suppliers}
        handleUploadImage={handleUploadImage}
        imagePreviews={imagePreviews}
        height={height}
        mainImage={mainImage}
        handleDeleteImage={handleDeleteImage}
        handleClick={handleAddProduct}
        buttonText="Add Product"
      />
    </Grid>
  );
}
