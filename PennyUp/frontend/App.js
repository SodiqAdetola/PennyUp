import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './authUtil';
//Icons
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';

//Screens
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/secure/Home';
import Leaderboard from './screens/secure/Leaderboard';
import Trades from './screens/secure/Trades';
import navHistory from './screens/secure/components/navHistory';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SecureTabs() {

  return (
    <Tab.Navigator 
    screenOptions={{ 
      headerShown: false, 
      tabBarShowLabel: true, 
      tabBarInactiveTintColor: '#0B2038',
      tabBarStyle: {
        height: 75,
      }
      }}
      >
      <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: () => (<AntDesign name="home" size={29} color="#0B2038" /> ) }}/>
      <Tab.Screen name="Trade" component={Trades} options={{ tabBarIcon: () => (<MaterialIcons name="currency-exchange" size={25} color="#0B2038" />) }}/>
      <Tab.Screen name="History" component={navHistory} options={{ tabBarIcon: () => (<MaterialIcons name="history" size={30} color="#0B2038" />) }}/>
      <Tab.Screen name="Leaderboard" component={Leaderboard} options={{ tabBarIcon: () => (<Ionicons name="podium-outline" size={30} color="black" />) }}/>
    </Tab.Navigator>

  );
}


export default function App() {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  //useEffect to detect when user logs in or out and set user & user token
  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        //if user exists, save/set user token
        try {
          const token = await user.getIdToken();
          console.log("User token:", token);
          // Store token securely
          await AsyncStorage.setItem('idToken', token);
          setToken(token);
        } catch (error) {
          console.error("Failed to get token:", error);
        }
      } else {
        setToken('');
        await AsyncStorage.removeItem('idToken'); 
      }
    });
    return unsubscribe;
  }, []);

  

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken()
        .then(token => console.log('Token refreshed:', token))
        .catch(error => console.error('Failed to refresh token:', error));
    }, 45 * 60 * 1000); // Every 45 minutes
  
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false}}>
        { user ? (
            <Stack.Screen name='SecureTabs' component={SecureTabs} initialParams={{token: token}}/>
         ) : (
          <>
            <Stack.Screen  name="Login" component={Login}/>
            <Stack.Screen  name="Register" component={Register}/>
          </>
          )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});