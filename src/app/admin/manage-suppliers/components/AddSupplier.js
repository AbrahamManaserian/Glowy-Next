'use client';

import { db } from '@/firebase';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { doc, getDoc, increment, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const SupplierInputs = ({ inputs, setInputs, requiredFields, setRequiredFields }) => {
  const hadleChangeInputs = async (e) => {
    if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
  };

  const handleInputBlur = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  return (
    <>
      <TextField
        key={`0${inputs.name}`}
        error={!!requiredFields && !inputs.name}
        defaultValue={inputs.name}
        name="name"
        onBlur={(e) => handleInputBlur(e)}
        onChange={(e) => hadleChangeInputs(e)}
        sx={{
          boxSizing: 'border-box',
          width: '100%',
        }}
        helperText={requiredFields && !inputs.name ? 'Required' : ' '}
        size="small"
        label="Name"
        variant="outlined"
      />
      <TextField
        key={`1${inputs.phone}`}
        error={!!requiredFields && !inputs.phone}
        defaultValue={inputs.phone}
        name="phone"
        onBlur={(e) => handleInputBlur(e)}
        onChange={(e) => hadleChangeInputs(e)}
        sx={{
          boxSizing: 'border-box',
          width: '100%',
        }}
        helperText={requiredFields && !inputs.phone ? 'Required' : ' '}
        size="small"
        label="Phone number"
        variant="outlined"
      />
      <TextField
        key={`2${inputs.address}`}
        error={!!requiredFields && !inputs.address}
        defaultValue={inputs.address}
        name="address"
        onBlur={(e) => handleInputBlur(e)}
        onChange={(e) => hadleChangeInputs(e)}
        sx={{
          boxSizing: 'border-box',
          width: '100%',
        }}
        helperText={requiredFields && !inputs.address ? 'Required' : ' '}
        size="small"
        label="Address"
        variant="outlined"
      />
    </>
  );
};

export default function AddSupplier() {
  const router = useRouter();
  const [requiredFields, setRequiredFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    setRequiredFields(false);
  }, [inputs]);

  const handleAddSupplier = async () => {
    if (!inputs.name || !inputs.phone) {
      setRequiredFields(true);
      return;
    }
    setLoading(true);
    try {
      const docRef = doc(db, 'details', 'suppliers');
      const docSnap = await getDoc(docRef);
      const newId = docSnap.data().lastId + 1;
      await updateDoc(docRef, {
        [`suppliers.${newId}`]: { ...inputs, id: newId, createdAt: Date.now() },
        lastId: increment(1),
      });
      setInputs({
        name: '',
        address: '',
        phone: '',
      });
      setLoading(false);
      router.refresh();
    } catch (error) {
      setLoading(false);
      alert(error);
      console.log(error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '200px' } }}>
      {loading && <CircularProgress sx={{ position: 'fixed', top: '50vh', right: '50%' }} />}
      <Typography mb={'10px'}>Add New Supplier </Typography>
      <SupplierInputs
        inputs={inputs}
        setInputs={setInputs}
        requiredFields={requiredFields}
        setRequiredFields={setRequiredFields}
      />

      <Button
        onClick={handleAddSupplier}
        color="success"
        sx={{ textTransform: 'capitalize', mt: '0px' }}
        variant="contained"
      >
        Add New Supplier
      </Button>
    </Box>
  );
}
