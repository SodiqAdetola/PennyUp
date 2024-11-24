import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH } from './firebaseConfig';

export const refreshToken = async () => {
  try {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const newToken = await user.getIdToken(true); // Force refresh
      await AsyncStorage.setItem('idToken', newToken);
      console.log('Token refreshed:', newToken);
      return newToken; // Return new token if needed
    }
    throw new Error('No user logged in');
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};