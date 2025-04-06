import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ResetModal = ({ onCancel, onReset }) => {
  return (
    <View style={styles.confirmationModal}>
      <Text style={styles.confirmTitle}>Reset Account?</Text>
      <Text style={styles.confirmText}>
        This will reset your account balance to the default amount and remove all your trade history.
        This action cannot be undone.
      </Text>
      <View style={styles.confirmButtons}>
        <TouchableOpacity style={[styles.confirmButton, styles.cancelButton]} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.confirmButton, styles.dangerButton]} onPress={onReset}>
          <Text style={styles.buttonText}>Reset</Text>
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

export default ResetModal;