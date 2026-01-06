'use client';

import { useState, useContext } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail } from 'firebase/auth';
import { auth } from '@/firebase';
import { GlobalContext } from '@/app/GlobalContext';
import SettingsTab from './SettingsTab';

export default function SettingsContent() {
  const { user } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [emailMessage, setEmailMessage] = useState({ type: '', text: '' });

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Email Change State
  const [newEmail, setNewEmail] = useState('');
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      setEmailMessage({ type: 'error', text: 'Please enter a new email address.' });
      return;
    }
    if (!currentPasswordForEmail) {
      setEmailMessage({ type: 'error', text: 'Please enter your current password to confirm.' });
      return;
    }

    setLoading(true);
    setEmailMessage({ type: '', text: '' });

    try {
      // 1. Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPasswordForEmail);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // 2. Send verification email to the new address
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail.trim());

      setEmailMessage({
        type: 'success',
        text: `Verification email sent to ${newEmail}. Please check your inbox and click the link to finalize the change.`,
      });
      setNewEmail('');
      setCurrentPasswordForEmail('');
    } catch (error) {
      console.error('Error updating email:', error);
      if (error.code === 'auth/wrong-password') {
        setEmailMessage({ type: 'error', text: 'Incorrect password. Please try again.' });
      } else if (error.code === 'auth/email-already-in-use') {
        setEmailMessage({ type: 'error', text: 'This email is already in use by another account.' });
      } else if (error.code === 'auth/requires-recent-login') {
        setEmailMessage({ type: 'error', text: 'Please sign out and sign in again to perform this action.' });
      } else {
        setEmailMessage({ type: 'error', text: 'Failed to update email: ' + error.message });
      }
    }
    setLoading(false);
  };

  return (
    <SettingsTab
      user={user}
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      newEmail={newEmail}
      setNewEmail={setNewEmail}
      currentPasswordForEmail={currentPasswordForEmail}
      setCurrentPasswordForEmail={setCurrentPasswordForEmail}
      loading={loading}
      setLoading={setLoading}
      message={message}
      setMessage={setMessage}
      emailMessage={emailMessage}
      setEmailMessage={setEmailMessage}
      handleUpdateEmail={handleUpdateEmail}
    />
  );
}
