import AsyncStorage from '@react-native-async-storage/async-storage';

const VALID_USERNAME = 'vebri';
const VALID_PASSWORD = 'vebri123';

export const loginUser = async (username, password) => {
  try {
    console.log('loginUser called:', username, password);
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('username', username);
      console.log('AsyncStorage saved');
      return { success: true, message: 'Login berhasil' };
    }
    console.log('Invalid credentials');
    return { success: false, message: 'Username atau password salah' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Terjadi kesalahan: ' + error.message };
  }
};

export const checkLoginStatus = async () => {
  try {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    console.log('checkLoginStatus:', isLoggedIn);
    return isLoggedIn === 'true';
  } catch (error) {
    console.error('Check login error:', error);
    return false;
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('username');
    console.log('Logout success');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

export const getUsername = async () => {
  try {
    return await AsyncStorage.getItem('username');
  } catch (error) {
    return null;
  }
};