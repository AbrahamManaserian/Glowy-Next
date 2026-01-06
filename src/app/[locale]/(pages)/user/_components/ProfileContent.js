'use client';

import { useState, useContext, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslations } from 'next-intl';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/firebase';
import { GlobalContext } from '@/app/GlobalContext';
import Resizer from 'react-image-file-resizer';
import ProfileTab from './ProfileTab';

export default function ProfileContent() {
  const t = useTranslations('UserPage');
  const { setUserData, userData, user, loading: authLoading } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile State
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.fullName || '');
      setPhotoURL(userData.photoURL || '');
      setPhoneNumber(userData.phoneNumber || '');
      setAddress(userData.address || '');
      setBirthday(userData.birthday || '');
      setGender(userData.gender || '');
    }
  }, [userData]);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        500, // maxWidth
        500, // maxHeight
        'JPEG', // compressFormat
        80, // quality
        0, // rotation
        (uri) => {
          resolve(uri);
        },
        'blob' // outputType
      );
    });

  const handleAvatarChange = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageLoading(true);
      try {
        const resizedImage = await resizeFile(file);
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, resizedImage);
        const downloadURL = await getDownloadURL(storageRef);

        await updateProfile(auth.currentUser, { photoURL: downloadURL });

        setUserData((prevData) => ({ ...prevData, photoURL: downloadURL }));

        // Also update in Firestore
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { photoURL: downloadURL }, { merge: true });

        setMessage({ type: 'success', text: t('messages.profileUpdated') });
      } catch (error) {
        setMessage({ type: 'error', text: t('messages.uploadFailed') + error.message });
      }
      setImageLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // Update Auth Profile
      if (displayName !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName });
      }

      // Update Firestore Profile
      setUserData((prevData) => ({
        ...prevData,
        fullName: displayName,
        phoneNumber,
        address,
        birthday,
        gender,
      }));

      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          fullName: displayName,
          phoneNumber,
          address,
          birthday,
          gender,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#E57373' }} />
      </Box>
    );
  }

  return (
    <ProfileTab
      user={user}
      displayName={displayName}
      setDisplayName={setDisplayName}
      phoneNumber={phoneNumber}
      setPhoneNumber={setPhoneNumber}
      address={address}
      setAddress={setAddress}
      birthday={birthday}
      setBirthday={setBirthday}
      gender={gender}
      setGender={setGender}
      message={message}
      setMessage={setMessage}
      loading={loading}
      setLoading={setLoading}
      handleUpdateProfile={handleUpdateProfile}
      photoURL={photoURL}
      imageLoading={imageLoading}
      handleAvatarChange={handleAvatarChange}
    />
  );
}
