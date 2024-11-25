import { Alert, StyleSheet, Text, View, TouchableOpacity, Button, ScrollView, SafeAreaView} from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '../../firebaseConfig'
import AntDesign from '@expo/vector-icons/AntDesign';

import axios from 'axios';
const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com'

const Home = () => {

  const [username, setUsername] = useState(null);

  useEffect ( () => {
    getUsername();
  }, [])


    const LogoutHandler = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            console.log("User signed out")
        } catch (error) {
            console.log(error)
            alert("Logout Error", error.message)
        }
    }



    const getUsername = async () => {
      const user = FIREBASE_AUTH.currentUser;
      console.log('Current user:', user)
  
      const firebaseUID = user.uid;
      console.log('Firebase UID:', firebaseUID)
    
      if (!firebaseUID) {
        console.error('No firebase UID')
        return;
      }
    
      try {
        const response = await axios.get(`${backendURL}/users/${firebaseUID}`)
        console.log('User data: ', response.data)
    
        if (response.data) {
          setUsername(response.data.username)
        } else {
          console.error('No data received')
        }
    
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    }
    


  return (
    <SafeAreaView style={[styles.container,]}>

      <View style={[styles.topContainer]}>
  
      <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={LogoutHandler}>
          <AntDesign name="logout" size={35} color="white" />
          </TouchableOpacity>
        </View>

        <View style={[styles.welcomeContainer]}>
          <Text style={[styles.welcomeText]} >Welcome {username}!</Text>
        </View>
      </View>

      <View Style={[styles.bottomContainer]}>

      </View>

    </SafeAreaView>

    

  )
}   

export default Home

const styles = StyleSheet.create({

  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#0B2038',
    alignItems: 'center'
  },

  topContainer: {
    height: '25%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    
  },

  logoutContainer: {
    alignItems: 'flex-end',
  },
  
  logoutButton: {

    borderRadius: 5,
    top: 20,
    right: 20,
  },

  welcomeText: {
    font: 'inter',
    fontSize: '45',
    fontWeight: '100',
    textAlign: 'center',
    color: 'white',
  },


  
})