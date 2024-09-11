import * as React from 'react';
import { exchangeCodeAsync, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';

export default function LoginScreen() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState(null); // State to store user profile data
  const [loading, setLoading] = React.useState(false); // State for loading indicator

  const storeToken = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing the token', error);
    }
  };

  const retrieveToken = async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error retrieving the token', error);
    }
  };

  const removeToken = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing the token', error);
    }
  };

  const navigation = useNavigation();
  const discovery = useAutoDiscovery('https://login.microsoftonline.com/common/v2.0');
  const redirectUri = 'exp://tasken';
  const clientId = '2fb75217-e2f4-455a-8f2d-105f1cd4c455';
  const { accessToken, setAccessToken } = useAuth();
  const { refreshToken, setRefreshToken } = useAuth();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientId,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri: redirectUri,
    },
    discovery
  );

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const storedAccessToken = await retrieveToken('accessToken');
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
        setIsLoggedIn(true);
        fetchUserProfile(storedAccessToken); // Fetch profile data if already logged in
      }
    };
    checkLoginStatus();
  }, [setAccessToken]);

  React.useEffect(() => {
    if (response?.type === 'success' && discovery) {
      const { code } = response.params;
      const extraParams = request?.codeVerifier ? { code_verifier: request.codeVerifier } : undefined;
      setLoading(true); // Set loading state to true while fetching tokens
      exchangeCodeAsync(
        {
          clientId: clientId,
          code: code,
          redirectUri: redirectUri,
          extraParams: extraParams,
        },
        discovery
      )
        .then(async (res) => {
          console.log('Token Response:', res);
          if (res.refreshToken) await storeToken('refreshToken', res.refreshToken);
          await storeToken('accessToken', res.accessToken);
          setAccessToken(res.accessToken);
          setRefreshToken(res.refreshToken ?? null);
          setIsLoggedIn(true);
          setLoading(false); // Set loading state to false after tokens are fetched
          setUserProfile(null);
          fetchUserProfile(res.accessToken);
          navigation.navigate('index', { loginStatus: 'Login successful!' });
        })
        .catch((error) => {
          console.error('Failed to exchange code:', error);
          setLoading(false); // Set loading state to false if there's an error
        });
    }
  }, [response, discovery, request, redirectUri, navigation, setAccessToken, setRefreshToken]);

  const handleLogout = async () => {
    try {
      setAccessToken(null);
      setRefreshToken(null);
      await removeToken('accessToken');
      await removeToken('refreshToken');
      console.log(accessToken);
      console.log(refreshToken);
      await WebBrowser.openBrowserAsync('https://login.microsoftonline.com/common/oauth2/v2.0/logout');
      setUserProfile(null);
      setIsLoggedIn(false);
      navigation.navigate('loginWithMicrosoft');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const fetchUserProfile = async (token: any) => {
    if (token) {
      try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const userData = await response.json();
        console.log('User Profile Data:', userData);
        setUserProfile(userData); // Update state with user data
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#187C84', '#A4A4A4']} locations={[0.21, 1]} style={styles.gradient}>
        <View style={styles.content}>
          <Image source={require('../assets/images/title_img.gif')} style={styles.title_img} />
          <Text style={styles.label}>Welcome to eSaleReport</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" /> // Show loading indicator
          ) : isLoggedIn ? (
            <>
              {userProfile && (
                <Text style={styles.userProfile}>
                  Welcome, {userProfile.displayName}!
                </Text>
              )}
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.button_label}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity disabled={!request} style={styles.button} onPress={() => promptAsync()}>
              <Text style={styles.button_label}>Login with Microsoft</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

// Example styles (adjust as needed)
const styles = {
  container: {
    flex: 1,
    position: 'relative',
  },
  userProfile: {
    color: 'white',
    fontSize: 18,
    marginBottom: '5%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
  },
  title_img: {
    width: 300,
    height: 150,
    marginBottom: '5%',
    borderRadius: 20,
  },
  label: {
    color: 'white',
    fontSize: 33,
    fontWeight: 'bold',
  },
  button: {
    marginTop: '10%',
    backgroundColor: '#187C84',
    padding: '4%',
    borderRadius: 10,
    paddingHorizontal: '20%',
    alignItems: 'center',
    marginBottom: '5%',
    elevation: 5,
  },
  button_label: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
};
