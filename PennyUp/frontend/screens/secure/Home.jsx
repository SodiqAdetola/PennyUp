import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '../../firebaseConfig'
import AntDesign from '@expo/vector-icons/AntDesign'
import axios from 'axios'

import LogoutModal from './components/LogoutModal'
import News from './components/News'
import Guides from './components/Guides'
import Settings from './Settings'

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com'

const Home = () => {
  const [username, setUsername] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('news') // To track active tab: 'news', 'guides', or 'settings'
  const [showSettings, setShowSettings] = useState(false)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    getUserData()
  }, [])

  const LogoutHandler = async () => {
    try {
      await signOut(FIREBASE_AUTH)
      console.log("User signed out")
    } catch (error) {
      console.log(error)
      alert("Logout Error", error.message)
    }
  }

  const getUserData = async () => {
    const user = FIREBASE_AUTH.currentUser
    console.log('Current user:', user)

    const firebaseUID = user.uid
    console.log('Firebase UID:', firebaseUID)

    if (!firebaseUID) {
      console.error('No firebase UID')
      return
    }

    try {
      const response = await axios.get(`${backendURL}/users/${firebaseUID}`)
      console.log('User data: ', response.data)

      if (response.data) {
        setUsername(response.data.username)
        setUserData(response.data)
      } else {
        console.error('No data received')
      }
    } catch (error) {
      console.error('Error fetching user data: ', error)
    }
  }

  // Handle logout confirmation
  const handleLogoutConfirm = () => {
    setIsModalVisible(false)
    LogoutHandler()
  }

  // Handle modal close without logging out
  const handleLogoutCancel = () => {
    setIsModalVisible(false)
  }

  // Toggle settings screen
  const toggleSettings = () => {
    setShowSettings(!showSettings)
  }

  // Update user data in the parent component
  const updateUserData = (updatedData) => {
    setUserData(updatedData)
    setUsername(updatedData.username)
  }

  return (
    <SafeAreaView style={styles.container}>
      {showSettings ? (
        <Settings 
          userData={userData} 
          onClose={toggleSettings} 
          updateUserData={updateUserData}
          backendURL={backendURL}
        />
      ) : (
        <>
          <View style={styles.topContainer}>
            <View style={styles.headerContainer}>
              <TouchableOpacity style={styles.settingsButton} onPress={toggleSettings}>
                <AntDesign name="setting" size={35} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.logoutButton} onPress={() => setIsModalVisible(true)}>
                <AntDesign name="logout" size={35} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome {username}!</Text>
            </View>
          </View>

          {/* Bottom content section (70% of screen) */}
          <View style={styles.bottomContainer}>
            <View style={styles.tabButtonContainer}>
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'news' ? styles.activeTab : null]} 
                onPress={() => setActiveTab('news')}
              >
                <Text style={[styles.tabButtonText, activeTab === 'news' ? styles.activeTabText : null]}>News</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'guides' ? styles.activeTab : null]} 
                onPress={() => setActiveTab('guides')}
              >
                <Text style={[styles.tabButtonText, activeTab === 'guides' ? styles.activeTabText : null]}>Guides</Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'news' ? <News /> : <Guides />}
          </View>

          <LogoutModal
            visible={isModalVisible}
            onClose={handleLogoutCancel}
            onConfirm={handleLogoutConfirm}
          />
        </>
      )}
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
    height: '30%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingsButton: {
    borderRadius: 5,
  },
  logoutContainer: {
    alignItems: 'flex-end',
  },
  logoutButton: {
    borderRadius: 5,
  },
  welcomeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeText: {
    fontSize: 40,
    maxWidth: '80%',
    alignSelf: 'center',
    fontWeight: '100',
    textAlign: 'center',
    color: 'white',
  },

  // news/guides section styles
  bottomContainer: {
    height: '70%',
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
   
  },
  tabButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    width: '40%',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#0B2038',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B2038',
    textAlign: 'center',
  },
  activeTabText: {
    color: 'white',
  }
})