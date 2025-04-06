import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const DeleteModal = ({ onCancel, onDelete }) => {
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!password) return;
    setIsDeleting(true);
    await onDelete(password);
    setIsDeleting(false);
  };

  return (
    <View style={styles.confirmationModal}>
      <Text style={styles.confirmTitle}>Delete Account?</Text>
      <Text style={styles.confirmText}>
        This will permanently delete your account and all associated data.
        Please enter your password to confirm.
      </Text>
      
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your password"
        placeholderTextColor="#888"
        autoFocus
      />
      
      <View style={styles.confirmButtons}>
        <TouchableOpacity 
          style={[styles.confirmButton, styles.cancelButton]} 
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.confirmButton, styles.dangerButton, isDeleting && { opacity: 0.7 }]} 
          onPress={handleDelete}
          disabled={!password || isDeleting}
        >
          <Text style={styles.buttonText}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  confirmationModal: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  confirmTitle: {
    marginTop: '25%',
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
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
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
  dangerButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeleteModal;