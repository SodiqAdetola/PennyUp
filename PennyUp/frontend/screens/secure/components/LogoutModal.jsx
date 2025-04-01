import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const LogoutModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Logout</Text>

          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onClose} />
            <View style={styles.verticalLine}></View>
            <Button title="Confirm" onPress={onConfirm} />
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
    backgroundColor: "#1C3A5B",
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  verticalLine: {
    alignSelf: "center",
    height: "50%",
    width: 1,
    backgroundColor: "white",
  },
});
