'use client';

import { Button, Grid, TextField, Typography } from '@mui/material';
import ExtraProductOptions from '../components/ExtraProductOptions';
import { useEffect, useState } from 'react';
import { useAdminData } from '../components/AdminContext';
import Resizer from 'react-image-file-resizer';
import { arrayUnion, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '@/firebase';
import { useRouter } from 'next/navigation';
import InitialProductInputs from '../components/InitialProductInputs';
import CategoriesInputs from '../components/CategoriesInputs';
import DescriptionInput from '../components/DescriptionInput';
import ImageInputs from '../components/ImageInputs';

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

const categoriesObj = {
  fragrance: {
    category: 'Fragrance',
    fragrance: {
      category: 'Fragrance',
      brands: fragranceBrands,
      type: ['Men', 'Women', 'Uni'],
    },
    carFresheners: {
      category: 'Car Air Fresheners',
      type: [],
    },
    homeFresheners: {
      category: 'Home Air Fresheners',
      type: [],
    },
    deodorant: {
      category: 'Deodorant',
      type: [],
    },
  },

  makeup: {
    face: {
      category: 'Face',
      type: [
        'Foundation',
        'Highlighter',
        'Face Primer',
        'Powder & Setting Spray',
        'Contour',
        'Blush',
        'Concealer',
        'BB & CC cream',
      ],
    },

    eye: {
      category: 'Eye',
      type: ['Brow Gel', 'Eye Palettes', 'Eyebrow pencil', 'Eyeliner', 'Pencil'],
    },
    lip: {
      category: 'Lip',
      type: ['Lipstick', 'Liquid Lipstick', 'Lip Balm & Treatmentl', 'Lip Gloss', 'Lip Liner', 'Lip Oil'],
    },
    category: 'Makeup',
  },

  Skincare: {
    Cleansers: {
      Cleansers: 'cleansers',
      Exfoliation: 'exfoliation',
      'Face Wash': 'face-wash',
      'Makeup Removers': 'makeup-removers',
      'Toners & Lotions': 'toners-lotions',
      routTo: 'cleansers',
    },

    'Eye Care': {
      'Dark Circles': 'dark-circles',
      'Eye Patches': 'eye-patches',
      'Lifting/Anti-age Eye Creams': 'lifting-anti-age-eye-creams',
      routTo: 'eye-care',
    },
    Masks: {
      'Anti-age': 'anti-age',
      'Eye Patches': 'eye-patches',
      'Face Masks': 'face-masks',
      Hydrating: 'hydrating',
      routTo: 'masks',
    },
    Moisturizers: {
      'Face Creams': 'face-creams',
      'Face Oils': 'face-oils',
      Mists: 'mists',
      Moisturizers: 'moisturizers',
      'Night Creams': 'night-creams',
      'Anti-Aging': 'anti-aging',
      'Dark Spots': 'dark-spots',
      Lifting: 'lifting',
      'Face Serums': 'face-serums',
      routTo: 'masks',
    },
    routTo: 'moisturizers',
  },
  'Bath & Body': {
    'Bath & Shower': {
      Gel: 'gel',
      'Hand Wash & Soap': 'hand-wash-soap',
      'Scrub & Exfoliation': 'scrub-exfoliation',
      'Shampoo & Conditione': 'shampoo-conditione',
      routTo: 'bath-shower',
    },
    'Body Care': {
      Antiperspirants: 'antiperspirants',
      'Body Lotion & Body Oils': 'body-lotion-body-oils',
      'Body Moisturizers': 'body-moisturizers',
      'Cellulite & Stretch Marks': 'cellulite-stretch-marks',
      'Hand Cream & Foot Cream': 'hand-cream–foot-ream',
      'Masks & Special Treatment': 'masks-special-treatment',
      routTo: 'body-care',
    },
    routTo: 'bath-body',
  },
  Hair: {
    'Hair Styling': {
      Gel: 'gel',
      'Hand Wash & Soap': 'hand-wash-soap',
      'Scrub & Exfoliation': 'scrub-exfoliation',
      'Shampoo & Conditione': 'shampoo-conditione',
      routTo: 'hair-styling',
    },
    routTo: 'hair',
  },
  Nail: {
    Nail: {
      'Cuticle care': 'cuticle-care',
      'Nail care': 'nail-care',
      'Nail color': 'nail-color',
      'Nail polish removers': 'nail-polish-removers',
      routTo: 'nail',
    },
    routTo: 'nail',
  },
  'New Items': {
    'New Items': { routTo: 'new-items' },
    routTo: 'new-items',
  },
  Accessories: {
    Accessories: { routTo: 'accessories' },
    routTo: 'accessories',
  },
};

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
  const [requiredFields, setRequiredFields] = useState(false);
  const [requiredOption, setRequiredOption] = useState(false);
  const [height, setHeight] = useState(0);
  const { data, setLoading } = useAdminData();
  const router = useRouter();
  const [options, setOptions] = useState({
    optionKey: '',
    optionValue: '',
    optionPrice: '',
    optionDisacountedPrice: '',
    optionCoast: '',
    optionQouantity: '',
    availableOptions: [],
  });
  const [inputs, setInputs] = useState({
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
    extraInputs: {},
  });

  const addProduct = async () => {
    console.log(inputs);
    console.log(options);
    if (!inputs.brand || !inputs.model || !inputs.mainImage || !inputs.category || !inputs.subCategory) {
      setRequiredFields(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);
      function getNextProductId(id) {
        const next = parseInt(id, 10) + 1; // increase by 1
        return next.toString().padStart(6, '0'); // keep 7 digits
      }

      const newId = getNextProductId(data['project-details'].lastProductId);
      const storage = getStorage();
      const mainImageStorageRef = ref(storage, `glowy-products/${newId}/main`);
      const smallImageStorageRef = ref(storage, `glowy-products/${newId}/small`);
      const productRef = doc(db, 'glowy-products', newId);
      const detailRef = doc(db, 'details', 'project-details');
      let smallImage = {};
      let mainImage = {};
      const imageArr = [];
      console.log(newId);

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

      await uploadBytes(mainImageStorageRef, inputs.mainImage.file).then((snapshot) => {
        return getDownloadURL(snapshot.ref).then((url) => {
          mainImage = { ...inputs.mainImage, file: url };
          // console.log(url);
        });
      });

      await uploadBytes(smallImageStorageRef, inputs.smallImage.file).then((snapshot) => {
        return getDownloadURL(snapshot.ref).then((url) => {
          smallImage = { ...inputs.smallImage, file: url };
          // console.log(url);
        });
      });

      const productData = {
        ...inputs,
        id: newId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mainImage: mainImage,
        smallImage: smallImage,
        images: imageArr,
        availableOptions: options.availableOptions,
      };

      await setDoc(productRef, productData);

      await updateDoc(detailRef, {
        allProductsIds: arrayUnion({ id: newId, name: inputs.brand + ' - ' + inputs.model }),
        lastProductId: newId,
      });

      router.refresh();
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setInputs({
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
        extraInputs: {},
      });
      setOptions({
        optionKey: '',
        optionValue: '',
        optionPrice: '',
        optionDisacountedPrice: '',
        optionCoast: '',
        optionQouantity: '',
        availableOptions: [],
      });
      setRequiredFields(false);
      setRequiredOption(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const handleChangeOptions = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.value });
  };

  const hadleChangeInputs = (e) => {
    if (e.target.name === 'category') {
      setInputs({
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
        extraInputs: {},
      });
      setOptions({
        optionKey: '',
        optionValue: '',
        optionPrice: '',
        optionDisacountedPrice: '',
        optionCoast: '',
        optionQouantity: '',
        availableOptions: [],
      });
    } else if (e.target.name === 'subCategory') {
      setInputs({
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
        extraInputs: {},
      });
      setOptions({
        optionKey: '',
        optionValue: '',
        optionPrice: '',
        optionDisacountedPrice: '',
        optionCoast: '',
        optionQouantity: '',
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

      <Grid
        sx={{
          maxWidth: '1150px',
          margin: '0 auto',
          flexWrap: 'wrap',
          overflow: 'hidden',
          mt: '40px',
          boxSizing: 'border-box',
          py: '10px',
        }}
        container
        size={12}
      >
        <CategoriesInputs
          inputs={inputs}
          requiredFields={requiredFields}
          hadleChangeInputs={hadleChangeInputs}
          categoriesObj={categoriesObj}
        />
        <InitialProductInputs
          inputs={inputs}
          hadleChangeInputs={hadleChangeInputs}
          suppliers={data.suppliers.suppliers || {}}
          brands={categoriesObj?.[inputs.category]?.[inputs.subCategory]?.brands || []}
          requiredFields={requiredFields}
        />
        {Object.keys(inputs.extraInputs).length !== 0 && (
          <div style={{ width: '100%' }}>
            <Typography mb="10px">Extra Inputs</Typography>

            {Object.keys(inputs.extraInputs).map((key, index) => {
              return (
                <TextField
                  key={index}
                  defaultValue={inputs[key]}
                  name={key}
                  onBlur={(e) => hadleChangeInputs(e)}
                  onChange={(e) => {
                    if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                      hadleChangeInputs(e);
                    }
                  }}
                  sx={{
                    boxSizing: 'border-box',
                    width: { xs: 'calc(50% - 10px)', sm: 'calc(20% - 10px)' },
                    mr: { xs: 0, sm: '10px' },
                    mr: '10px',

                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                      {
                        WebkitAppearance: 'none', // Chrome, Safari, Edge
                      },
                  }}
                  size="small"
                  label={inputs.extraInputs[key]}
                  variant="outlined"
                  error={!inputs[key] && requiredFields ? true : false}
                  helperText={!inputs[key] && requiredFields ? 'Required' : ' '}
                />
              );
            })}
          </div>
        )}
        <ExtraProductOptions
          requiredOption={requiredOption}
          setRequiredOption={setRequiredOption}
          inputs={inputs}
          setInputs={setInputs}
          options={options}
          setOptions={setOptions}
          handleChangeOptions={handleChangeOptions}
        />
        <ImageInputs
          requiredFields={requiredFields}
          inputs={inputs}
          setInputs={setInputs}
          handleUploadMainImage={handleUploadMainImage}
          handleUploadImages={handleUploadImages}
          height={height}
        />
        <DescriptionInput inputs={inputs} hadleChangeInputs={hadleChangeInputs} />
        <Button
          onClick={addProduct}
          color="success"
          sx={{ textTransform: 'capitalize', mt: '20px' }}
          variant="contained"
        >
          Add Product
        </Button>
      </Grid>
    </Grid>
  );
}
