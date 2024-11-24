import { Alert, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '../../firebaseConfig'

import axios from 'axios';
const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com/'

const Home = () => {

  const [username, setUsername] = useState(null);


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
      if (user) {
        const firebaseUID = user.uid;
      }

      try {
        const response = await axios.get(`${backendURL}users/${firebaseUID}`)
        console.log('User data: ', response.data)
        setUsername(response.data.username)

      } catch (error) {
        console.error('Error fetching user data: ',error);
      }
    }



  return (
    <View>
            <Button title='Logout' onPress={LogoutHandler}/>
            <Text>Welcome {username}</Text>
    </View>
  )
}   

export default Home

const styles = StyleSheet.create({})