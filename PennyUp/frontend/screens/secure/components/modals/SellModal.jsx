import React from 'react';
import { Modal, Text, View, Button, StyleSheet } from 'react-native';

const SellModal = ({ visible, onClose, stock, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Sell {stock?.stockName || "Stock"}</Text>
          
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: "#1C3A5B",
    padding: 20,
    borderRadius: 10,
    width: '80%',

  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white',
    textAlign: 'center',

  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  verticalLine: {
    width: 1,
    height: 30,
    backgroundColor: '#ddd',
  },
});

export default SellModal;
