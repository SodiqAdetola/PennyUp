import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";

const SellModal = ({ visible, onClose, onConfirm, stock }) => {

  const handleConfirm = () => {

    onConfirm();
    
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Sell {stock?.longName}</Text>

          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onClose} />
            <View style={styles.verticalLine}></View>
            <Button title="Confirm" onPress={handleConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SellModal;

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
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    color: "black",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    
  },
  verticalLine: {
    alignSelf: "center",
    height: "75%",
    width: 1,
    backgroundColor: "white",
  },
});
