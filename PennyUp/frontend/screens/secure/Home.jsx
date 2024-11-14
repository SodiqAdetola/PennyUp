import { Alert, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '../../../firebaseConfig'

const Home = ({ token }) => {


    const LogoutHandler = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            console.log("User signed out")
        } catch (error) {
            console.log(error)
            alert("Logout Error", error.message)
        }
    }

  return (
    <View>
            <Button title='Logout' onPress={LogoutHandler}/>
            <Text>Welcome</Text>
    </View>
  )
}   

export default Home

const styles = StyleSheet.create({})