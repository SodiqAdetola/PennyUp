import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { FIREBASE_AUTH } from '../firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { sendPasswordResetEmail } from "firebase/auth";
import { Modal } from 'react-native';


const Login = ( { navigation } ) => {


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const auth = FIREBASE_AUTH;

    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');



    const LoginHandler = async () => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            console.log('User signed in')
            
        } catch (error) {
            console.log(error);
            alert('Sign in failed: ' + error.message)
        }
    }    

    const handlePasswordReset = async () => {
        if (!resetEmail) {
          alert("Please enter your email.");
          return;
        }
        try {
          await sendPasswordResetEmail(auth, resetEmail);
          alert("Password reset email sent!");
          setShowResetModal(false);
          setResetEmail('');
        } catch (error) {
          alert("Error: " + error.message);
        }
      };
      



  return (
    <View style={[styles.LoginPage]}>

        <View style={[styles.Logo]}>
            <Text style={[styles.LogoText]}>PennyUp</Text>
        </View>

        
        <KeyboardAvoidingView style={styles.InputContainer}>
        <View style={styles.InnerInputContainer}>
            <View>
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
                <TouchableOpacity onPress={() => setShowResetModal(true)}>
                    <Text style={[styles.white, styles.resetText]}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>
            

            <View >
                <TouchableOpacity style={[styles.button,]} onPress={LoginHandler}>
                    <Text style={[styles.buttonText]} >Login</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.link,]} onPress={ () => navigation.navigate('Register')}>
                <Text style={styles.white} >Don't have an account?</Text>
                <Text style={[styles.newAccountText]}> Create new account</Text>
            </TouchableOpacity>
            
        </View>
        </KeyboardAvoidingView>




        <Modal visible={showResetModal} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                <Text style={[{ fontSize: 18, marginBottom: 10},styles.white]}>Reset Password</Text>
                <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#888"
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    style={styles.resetInput}
                />

                <View style={[ styles.resetButtonContainer]}>

                    <TouchableOpacity onPress={() => setShowResetModal(false)}>
                        <Text style={[styles.resetButtonText]}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
                        <Text style={[styles.resetButtonText]}>Send Reset</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </Modal>


    </View>





  )
}

export default Login

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
        top: 40,
        alignItems: 'center',
    },

    LogoText: {
        color: 'white',
        fontSize: 60,
        fontWeight: '500'
    },

    InputContainer: {
        height: '60%',
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
        padding: '0',


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
    },

    resetText: {
        color: '#72b7ff',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.69)',
      },
      
      modalContainer: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#1C3A5B',
        alignItems: 'center',
      },
      resetInput: {
        width: '80%',
        backgroundColor: 'white',
        padding: 10,
        marginTop: 10,
        borderRadius: 10,

    },
    resetButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    resetButtonText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#72b7ff',
    },
      
})
