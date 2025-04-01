import React from 'react';
import { Modal, Text, View, Button, StyleSheet } from 'react-native';

const SellModal = ({ visible, onClose, stock, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Sell {stock?.stockName || "Stock"}</Text>
          <Text style={styles.modalText}>Purchase Price: ${stock?.purchasePrice}</Text>
          <Text style={styles.modalText}>Current Price: ${stock?.currentPrice}</Text>
          
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white',
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
