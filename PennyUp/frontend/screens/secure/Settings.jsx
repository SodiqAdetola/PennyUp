import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { FIREBASE_AUTH } from '../../firebaseConfig'
import axios from 'axios'
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com'

const Settings = ({ userData, onClose, updateUserData, backendURL }) => {
  const [username, setUsername] = useState(userData?.username || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Update user information
  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty')
      return
    }

    try {
      const firebaseUID = FIREBASE_AUTH.currentUser.uid
      const response = await axios.put(`${backendURL}/users/update`, {
        firebaseUID,
        username
      })

      if (response.data) {
        Alert.alert('Success', 'Username updated successfully')
        updateUserData({ ...userData, username })
      }
    } catch (error) {
      console.error('Error updating username:', error)
      Alert.alert('Error', 'Failed to update username')
    }
  }

  // Handle password change
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All password fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match')
      return
    }

    try {
      const user = FIREBASE_AUTH.currentUser
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      )
      
      // Reauthenticate user
      await reauthenticateWithCredential(user, credential)
      
      // Update password
      await user.updatePassword(newPassword)
      
      Alert.alert('Success', 'Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error updating password:', error)
      Alert.alert('Error', error.message)
    }
  }

  // Reset account (set account balance back to default)
  const handleResetAccount = async () => {
    try {
      const firebaseUID = FIREBASE_AUTH.currentUser.uid
      const response = await axios.put(`${backendURL}/users/resetAccount`, {
        firebaseUID
      })

      if (response.data) {
        Alert.alert('Success', 'Account has been reset successfully')
        updateUserData(response.data)
        setShowResetConfirm(false)
      }
    } catch (error) {
      console.error('Error resetting account:', error)
      Alert.alert('Error', 'Failed to reset account')
      setShowResetConfirm(false)
    }
  }

  // Delete user account
  const handleDeleteAccount = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser
      const firebaseUID = user.uid

      // Delete from backend first
      await axios.delete(`${backendURL}/users/${firebaseUID}`)
      
      // Then delete Firebase auth user
      await deleteUser(user)
      
      Alert.alert('Account Deleted', 'Your account has been permanently deleted')
      // User will be automatically redirected to login screen after auth state changes
    } catch (error) {
      console.error('Error deleting account:', error)
      Alert.alert('Error', 'Failed to delete account. You may need to re-authenticate.')
      setShowDeleteConfirm(false)
    }
  }

  // Confirmation modal UI for reset
  const ResetConfirmation = () => (
    <View style={styles.confirmationModal}>
      <Text style={styles.confirmTitle}>Reset Account?</Text>
      <Text style={styles.confirmText}>
        This will reset your account balance to the default amount and remove all your trade history.
        This action cannot be undone.
      </Text>
      <View style={styles.confirmButtons}>

        <TouchableOpacity style={[styles.confirmButton, styles.cancelButton]} onPress={() => setShowResetConfirm(false)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.confirmButton, styles.dangerButton]} onPress={handleResetAccount}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>

      </View>
    </View>
  )

  // Confirmation modal UI for delete
  const DeleteConfirmation = () => (
    <View style={styles.confirmationModal}>
      <Text style={styles.confirmTitle}>Delete Account?</Text>
      <Text style={styles.confirmText}>
        This will permanently delete your account and all associated data.
        This action cannot be undone.
      </Text>
      <View style={styles.confirmButtons}>

        <TouchableOpacity style={[styles.confirmButton, styles.cancelButton]} onPress={() => setShowDeleteConfirm(false)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.confirmButton, styles.dangerButton]} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>

      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <AntDesign name="arrowleft" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder}></View>
      </View>

      {showResetConfirm ? (
        <ResetConfirmation />
      ) : showDeleteConfirm ? (
        <DeleteConfirmation />
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor="#888"
              />
              <TouchableOpacity style={styles.button} onPress={handleUpdateUsername}>
                <Text style={styles.buttonText}>Update Username</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Change Password</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Enter current password"
                placeholderTextColor="#888"
              />
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Enter new password"
                placeholderTextColor="#888"
              />
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm new password"
                placeholderTextColor="#888"
              />
              <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Management</Text>
            <View style={styles.inputGroup}>

              <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={() => setShowResetConfirm(true)}>
                <Text style={styles.buttonText}>Reset Account</Text>
              </TouchableOpacity>
              <Text style={styles.helperText}>
                Resets your account balance to the default value and clears trade history.
              </Text>
              
              <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={() => setShowDeleteConfirm(true)}>
                <Text style={styles.buttonText}>Delete Account</Text>
              </TouchableOpacity>
              <Text style={styles.helperText}>
                Permanently deletes your account and all associated data.
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0B2038',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0B2038',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#0B2038',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
    width: '50%',
  },
  warningButton: {
    backgroundColor: '#FFA500',
  },
  dangerButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  confirmationModal: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B2038',
    marginBottom: 20,
  },
  confirmText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    width: '30%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#888',
  },
})