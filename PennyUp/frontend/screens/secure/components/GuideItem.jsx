import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, SafeAreaView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { useFocusEffect } from '@react-navigation/native'; 

const GuideItem = ({ guide }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      
      setIsExpanded(false);
    }, [setIsExpanded])
  )
 

  // Toggle expand/collapse of the guide item
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Open guide modal
  const openFullGuide = () => {
    setModalVisible(true);
  };

  // Close guide modal
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.guideItem}
        activeOpacity={0.8}
        onPress={handleToggleExpand}
      >
        <View style={styles.iconContainer}>
          <AntDesign name="book" size={30} color="#0B2038" />
        </View>
        
        <View style={styles.guideContent}>
          <Text style={styles.guideTitle}>{guide.title || 'No title available'}</Text>
          <Text style={styles.guideSummary}>{guide.summary || 'No summary available'}</Text>

          {isExpanded && (
            <View style={styles.expandedSection}>
              <Text style={styles.guidePrologue}>{guide.prologue}</Text>
              <TouchableOpacity style={styles.readMoreButton} onPress={openFullGuide}>
                <Text style={styles.readMoreButtonText}>Read Full Guide</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Full Guide Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{guide.title}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="#0B2038" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Markdown style={markdownStyles}>
              {guide.content}
            </Markdown>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default GuideItem;

const styles = StyleSheet.create({
  guideItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideContent: {
    flex: 1
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B2038',
    marginBottom: 6,
    lineHeight: 22,
  },
  guideSummary: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  expandedSection: {
    marginTop: 10,
  },
  guidePrologue: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
    width: '125%',
    right: 70,
    
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#0B2038',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    left: 40,
  },
  readMoreButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B2038',
    flex: 1,
    paddingRight: 16,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
});


const markdownStyles = {
  body: {
    fontSize: 14,
    color: '#333',
    width: '95%',
    alignSelf: 'center',
  },
  heading1: {
    textAlign: 'center',
  },
  heading2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B2038',
    marginBottom: 12,
    marginTop: 16,
  },
  heading3: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  paragraph: {
    marginBottom: 12,
  },
  list_item: {
    marginBottom: 6,
  },
  strong: {
    fontWeight: 'bold',
  },
};