import { Alert, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '../../firebaseConfig'

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
    <View>
      <View>
        <Button title='Logout' onPress={LogoutHandler}/>   
      </View>

      <View>
        <Text>Welcome {username || 'User'}</Text>
      </View>
    </View>
  )
}   

export default Home

const styles = StyleSheet.create({
  
})