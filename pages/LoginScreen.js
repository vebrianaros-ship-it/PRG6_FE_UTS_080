import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const VALID_USERNAME = 'vebri';
  const VALID_PASSWORD = 'vebri123';

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        console.log('Previous login status:', isLoggedIn);
        if (isLoggedIn === 'true') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      } catch (error) {
        console.log('Check login error:', error);
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    console.log('Login attempt:', username, password);
    
    if (!username || !password) {
      Alert.alert('Error', 'Username dan password harus diisi');
      return;
    }

    setLoading(true);

    try {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('username', username);
        console.log('Login success, navigating to Home ...');
        
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        console.log('Login failed: wrong credentials');
        Alert.alert('Gagal', 'Username atau password salah!\n\nUsername: vebri\nPassword: vebri123');
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Error', 'Terjadi kesalahan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        {/* <Text style={styles.title}>FARM APPS 080</Text>
        <Text style={styles.subtitle}>Aplikasi Untuk Beli Hewan Kurban</Text> */}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    innerContainer: { width: '80%', alignItems: 'center' },
    // title: { fontSize: 28, fontWeight: 'bold', color: '#3498db', marginBottom: 10 },
    // subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
    form: { width: '100%' },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    
});