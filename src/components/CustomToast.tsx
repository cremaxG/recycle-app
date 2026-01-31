import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={[styles.toastContainer, styles.success]}
      contentContainerStyle={styles.content}
      text1Style={styles.text1}
      text2Style={styles.text2}
      renderLeadingIcon={() => (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color="#4CAF50"
          style={styles.icon}
        />
      )}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={[styles.toastContainer, styles.error]}
      contentContainerStyle={styles.content}
      text1Style={styles.text1}
      text2Style={styles.text2}
      renderLeadingIcon={() => (
        <Ionicons
          name="close-circle"
          size={24}
          color="#F44336"
          style={styles.icon}
        />
      )}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={[styles.toastContainer, styles.info]}
      contentContainerStyle={styles.content}
      text1Style={styles.text1}
      text2Style={styles.text2}
      renderLeadingIcon={() => (
        <Ionicons
          name="information-circle"
          size={24}
          color="#2196F3"
          style={styles.icon}
        />
      )}
    />
  ),
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={[styles.toastContainer, styles.warning]}
      contentContainerStyle={styles.content}
      text1Style={styles.text1}
      text2Style={styles.text2}
      renderLeadingIcon={() => (
        <Ionicons
          name="alert-circle"
          size={24}
          color="#FF9800"
          style={styles.icon}
        />
      )}
    />
  ),
};

export default toastConfig;

const styles = StyleSheet.create({
  toastContainer: {
    borderLeftWidth: 4,
    borderRadius: 12,
    marginHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    paddingHorizontal: 10,
  },
  text1: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  text2: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  icon: {
    marginLeft: 8,
    marginRight: -6,
  },
  success: {
    borderLeftColor: '#4CAF50',
    backgroundColor: '#E6F4EA',
  },
  error: {
    borderLeftColor: '#F44336',
    backgroundColor: '#FDECEA',
  },
  info: {
    borderLeftColor: '#2196F3',
    backgroundColor: '#E8F4FD',
  },
  warning: {
    borderLeftColor: '#FF9800',
    backgroundColor: '#FFF4E5',
  },
});
