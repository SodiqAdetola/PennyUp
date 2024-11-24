import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH } from '../firebaseConfig'

import axios from 'axios';
const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com/'


const Register = ( { navigation } ) => {

  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const auth = FIREBASE_AUTH;


  const registerHandler = async () => {
    if (username == '') {
        alert(' Please enter a Username!')
        return;
    }
    if (password != confirmPassword) {
        alert(' Password does not match!')
        return;
    }
    
    try {
        const response = await createUserWithEmailAndPassword(auth, email, confirmPassword);
        const user = response.user;
        const firebaseUID = user.uid;

        console.log(response,'user registered')

        //Create new user in backend
        const backendUser = await axios.post(`${backendURL}/users`, {
            firebaseUID,
            username
        })

      } catch(error) {
        alert('Sign up failed: ' + error.message)
    }
    
  }


return (
  <View style={[styles.LoginPage]}>

      <View style={[styles.Logo]}>
          <Text style={[styles.LogoText]}>PennyUp</Text>
      </View>

      
      <KeyboardAvoidingView style={styles.InputContainer}>
      <View style={styles.InnerInputContainer}>
          <View>

              <TextInput 
              placeholder='Username' 
              value={username} 
              onChangeText={text => setUserName(text)} 
              style={styles.input}
              />

              <TextInput 
              placeholder='Email' 
              value={email} 
              onChangeText={text => setEmail(text)} 
              style={styles.input}
              />

              <TextInput 
              placeholder='Password' 
              value={password} 
              onChangeText={text => setPassword(text)} 
              style={styles.input}
              secureTextEntry
              />

              <TextInput 
              placeholder='Confirm Password' 
              value={confirmPassword} 
              onChangeText={text => setConfirmPassword(text)} 
              style={styles.input}
              secureTextEntry
              />
          </View>

          <View >
              <TouchableOpacity style={[styles.button,]} onPress={registerHandler}>
                  <Text style={[styles.buttonText]} >Register</Text>
              </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.link,]} onPress={ () => navigation.goBack()}>
              <Text style={styles.white} >Already have an account?</Text>
              <Text style={[styles.newAccountText]}> Log in</Text>
          </TouchableOpacity>
          
      </View>
      </KeyboardAvoidingView>

  </View>


)
}

export default Register

const styles = StyleSheet.create({

  LoginPage: {
      width: '100%',
      height: '100%',
      flex: 1,
      justifyContent: 'space-around',
      backgroundColor: '#001E44',
  },

  Logo: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },

  LogoText: {
      color: 'white',
      fontSize: 50,
      fontWeight: '500'
  },

  InputContainer: {
      height: '75%',
      width: '100%',
      alignItems: 'center',
      borderTopWidth: 5,
      borderRadius: 20,
      borderColor: 'white',
      backgroundColor: 'white',
  },

  InnerInputContainer: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      backgroundColor: '#213b5d',

      justifyContent: 'space-around',
      alignItems: 'center',

      borderRadius: 25,
      background: 'white',
      margin: 0,
      padding: 0,


  },

  input: {
      minWidth: '80%',
      backgroundColor: 'white',
      padding: 20,
      marginTop: 10,
      borderRadius: 10,

  },

  button: {
      minWidth: '60%',
      backgroundColor: '#001E44',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,

      
  },

  buttonText: {
      textAlign: 'center',
      color: 'white',
      fontSize: 20,
  },

  link: {
    flexDirection: 'row',
  },

  newAccountText: {
      color: '#72b7ff',
      marginBottom: 50,
  },

    white: {
        color: 'white',
    }
})
