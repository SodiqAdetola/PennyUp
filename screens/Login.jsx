import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { FIREBASE_AUTH } from '../firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'

const Login = ( { navigation } ) => {


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const auth = FIREBASE_AUTH;

    const LoginHandler = async () => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
            alert('Sign in failed: ' + error.message)
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
        alignItems: 'center',
    },

    LogoText: {
        color: 'white',
        fontSize: 50,
        fontWeight: '500'
    },

    InputContainer: {
        height: '60%',
        width: '100%',
        alignItems: 'center',
        borderTopWidth: 5,
        borderRadius: '20px',
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

        borderRadius: '25px',
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
        borderWidth: '1px',
        borderColor: 'white',
        borderRadius: '5px',

        
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
        marginBottom: '50',
    },

    white: {
        color: 'white',
    }
})
