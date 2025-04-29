import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const LogoutModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Logout</Text>

          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onClose} color='#72b7ff'/>
            <View style={styles.verticalLine}></View>
            <Button title="Confirm" onPress={onConfirm} color='#72b7ff'/>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: '#1C3A5B',
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    paddingBottom: 10,
    textAlign: "center",
    width: "80%",
    alignSelf: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    
  },
  verticalLine: {
    alignSelf: "center",
    height: "100%",
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",

  },
});
