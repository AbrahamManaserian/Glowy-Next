'use client';

import { Grid, Typography } from '@mui/material';
import Resizer from 'react-image-file-resizer';
import { useEffect, useMemo, useState } from 'react';
import { arrayUnion, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '@/firebase';
import { useAdminData } from '../components/AdminContext';
import AddEditProductInputs from '../components/AddEditProductInputs';
import { useRouter } from 'next/navigation';

const fragranceBrands = [
  'Acqua di Parma',
  'Aesop',
  'Amouage',
  'Armani',
  'Bentley',
  'Bond No. 9',
  'Burberry',
  'Bvlgari',
  'Byredo',
  'Calvin Klein',
  'Carolina Herrera',
  'Cartier',
  'Chanel',
  'Chloé',
  'Clive Christian',
  'Creed',
  'Dior',
  'Diptyque',
  'Dolce & Gabbana',
  'Givenchy',
  'Guerlain',
  'Gucci',
  'Hermès',
  'Hugo Boss',
  'Initio Parfums Privés',
  'Jean Paul Gaultier',
  'Jo Malone London',
  'Kayali',
  'Kilian Paris',
  'Lancôme',
  'Le Labo',
  'Louis Vuitton',
  'Maison Francis Kurkdjian',
  'Maison Margiela',
  'Mancera',
  'Montale',
  'Montblanc',
  'Mugler',
  'Narciso Rodriguez',
  'Paco Rabanne',
  'Parfums de Marly',
  'Penhaligon’s',
  'Prada',
  'Tiffany & Co.',
  'Tiziana Terenzi',
  'Tom Ford',
  'Valentino',
  'Versace',
  'Yves Saint Laurent',
  'Zara',
];

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

export const categoriesObj = {
  fragrance: {
    fragrance: {
      brands: fragranceBrands,
      type: [
        {
          type: 'Eau de Parfum',
          availableOptionsKey: 'Size',
        },
        {
          type: 'Eau de Toilette',
          availableOptionsKey: 'Size',
        },
      ],
      gender: ['Men', 'Women', 'Uni'],
      category: 'Fragrance',
    },
    carFresheners: {
      type: [],
      availableOptionsKey: 'size',
      category: 'Car Air Fresheners',
    },
    homeFresheners: {
      availableOptionsKey: 'size',
      category: 'Home Air Fresheners',
    },
    deodorant: {
      availableOptionsKey: 'size',
      category: 'Deodorant',
    },
    category: 'Fragrance',
  },

  // makeup: {
  //   face: {
  //     category: 'Face',
  //     type: [
  //       {
  //         type: 'Foundation',
  //         availableOptionsKey: 'Color',
  //       },
  //       {
  //         type: 'Highlighter',
  //         availableOptionsKey: '',
  //       },
  //       {
  //         type: 'Face Primer',
  //         availableOptionsKey: '',
  //       },
  //       {
  //         type: 'Powder & Setting Spray',
  //         availableOptionsKey: 'Color',
  //       },
  //       {
  //         type: 'Contour',
  //         availableOptionsKey: 'Color',
  //       },
  //       {
  //         type: 'Blush',
  //         availableOptionsKey: 'Color',
  //       },
  //       {
  //         type: 'Concealer',
  //         availableOptionsKey: '',
  //       },
  //       {
  //         type: 'BB & CC cream',
  //         availableOptionsKey: 'Color',
  //       },
  //     ],
  //   },

  //   Eye: {
  //     'Brow Gel': 'brow-gel',
  //     'Eye Palettes': 'eye-palettes',
  //     'Eyebrow pencil': 'eyebrow-pencil',
  //     Eyeliner: 'eyeliner',
  //     Pencil: 'pencil',
  //     routTo: 'eye',
  //   },
  //   Lip: {
  //     Lipstick: 'lipstick',
  //     'Liquid Lipstick': 'liquid-lipstick',
  //     'Lip Balm & Treatmentl': 'lip-balm-treatmentl',
  //     'Lip Gloss': 'lip-gloss',
  //     'Lip Liner': 'lip-liner',
  //     'Lip Oil': 'lip-oil',
  //     routTo: 'lip',
  //   },
  //   category: 'Makeup',
  // },

  // Skincare: {
  //   Cleansers: {
  //     Cleansers: 'cleansers',
  //     Exfoliation: 'exfoliation',
  //     'Face Wash': 'face-wash',
  //     'Makeup Removers': 'makeup-removers',
  //     'Toners & Lotions': 'toners-lotions',
  //     routTo: 'cleansers',
  //   },

  //   'Eye Care': {
  //     'Dark Circles': 'dark-circles',
  //     'Eye Patches': 'eye-patches',
  //     'Lifting/Anti-age Eye Creams': 'lifting-anti-age-eye-creams',
  //     routTo: 'eye-care',
  //   },
  //   Masks: {
  //     'Anti-age': 'anti-age',
  //     'Eye Patches': 'eye-patches',
  //     'Face Masks': 'face-masks',
  //     Hydrating: 'hydrating',
  //     routTo: 'masks',
  //   },
  //   Moisturizers: {
  //     'Face Creams': 'face-creams',
  //     'Face Oils': 'face-oils',
  //     Mists: 'mists',
  //     Moisturizers: 'moisturizers',
  //     'Night Creams': 'night-creams',
  //     'Anti-Aging': 'anti-aging',
  //     'Dark Spots': 'dark-spots',
  //     Lifting: 'lifting',
  //     'Face Serums': 'face-serums',
  //     routTo: 'masks',
  //   },
  //   routTo: 'moisturizers',
  // },
  // 'Bath & Body': {
  //   'Bath & Shower': {
  //     Gel: 'gel',
  //     'Hand Wash & Soap': 'hand-wash-soap',
  //     'Scrub & Exfoliation': 'scrub-exfoliation',
  //     'Shampoo & Conditione': 'shampoo-conditione',
  //     routTo: 'bath-shower',
  //   },
  //   'Body Care': {
  //     Antiperspirants: 'antiperspirants',
  //     'Body Lotion & Body Oils': 'body-lotion-body-oils',
  //     'Body Moisturizers': 'body-moisturizers',
  //     'Cellulite & Stretch Marks': 'cellulite-stretch-marks',
  //     'Hand Cream & Foot Cream': 'hand-cream–foot-ream',
  //     'Masks & Special Treatment': 'masks-special-treatment',
  //     routTo: 'body-care',
  //   },
  //   routTo: 'bath-body',
  // },
  // Hair: {
  //   'Hair Styling': {
  //     Gel: 'gel',
  //     'Hand Wash & Soap': 'hand-wash-soap',
  //     'Scrub & Exfoliation': 'scrub-exfoliation',
  //     'Shampoo & Conditione': 'shampoo-conditione',
  //     routTo: 'hair-styling',
  //   },
  //   routTo: 'hair',
  // },
  // Nail: {
  //   Nail: {
  //     'Cuticle care': 'cuticle-care',
  //     'Nail care': 'nail-care',
  //     'Nail color': 'nail-color',
  //     'Nail polish removers': 'nail-polish-removers',
  //     routTo: 'nail',
  //   },
  //   routTo: 'nail',
  // },
  // 'New Items': {
  //   'New Items': { routTo: 'new-items' },
  //   routTo: 'new-items',
  // },
  // Accessories: {
  //   Accessories: { routTo: 'accessories' },
  //   routTo: 'accessories',
  // },
};

export default function AddProduct() {
  const { setLoading } = useAdminData();
  const data = { suppliers: { suppliers: {} } };
  const router = useRouter();
  const [lastProductId, setLastProductId] = useState('');
  const [height, setHeight] = useState(0);
  const [requiredFields, setRequiredFields] = useState(false);
  const [optionalInputs, setOptionalInputs] = useState({});
  const [inputs, setInputs] = useState({
    brand: '',
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
                imageArr.push({ ...inputs.images[index], file: url, id: index });
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
        brand: '',
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
        optionalInputs={optionalInputs}
        setOptionalInputs={setOptionalInputs}
      />
    </Grid>
  );
}
