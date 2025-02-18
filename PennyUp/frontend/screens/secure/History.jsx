import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth';
import axios from 'axios';


const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';

const History = () => {
  const [broughtTrades, setBroughtTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const getBroughtTrades =  async () => {
    const auth = getAuth();
    const firebaseUID = auth.currentUser.uid;
  
    try {
   const userData = await axios.get(`${backendURL}/users/${firebaseUID}`)
   
   const tradeIDs = userData.data.broughtTrades

   if (tradeIDs.length > 0) {
    const 
   }
   setBroughtTrades(userBroughtTrades)
  
   } catch(err) {
    console.error('Error fetching user data:', err)
    setError(err)
   }
  
  }



  useEffect (() => {

})






  return (
    <SafeAreaView style={[styles.container,]}>

      <Text style={[styles.white, ]}>History</Text>

    </SafeAreaView>
  )
}

export default History

const styles = StyleSheet.create({

  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#0B2038',
    alignItems: 'center',
  },

  white: {
    color: 'white',
  },

})