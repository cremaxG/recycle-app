import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../../../context/ThemeContext';
import WdText from '../WdText';
import WdIcon from '../WdIcon';

interface ThemeBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeBottomSheet: React.FC<ThemeBottomSheetProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        {/* Floating Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={[
            styles.closeButton,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
          activeOpacity={0.7}
        >
          <WdIcon name="close" size={22} color={theme.colors.text} />
        </TouchableOpacity>

        {/* Bottom Sheet */}
        <View
          style={[styles.sheet, { backgroundColor: theme.colors.background }]}
        >
          <View style={styles.header}>
            <WdText labelKey="Select Theme" fontSize={18} isBold />
          </View>

          {[
            { label: 'Light theme', value: 'light', icon: 'wb-sunny' },
            { label: 'Dark theme', value: 'dark', icon: 'nights-stay' },
            { label: 'Use device theme', value: 'system', icon: 'settings' },
          ].map(item => (
            <TouchableOpacity
              key={item.value}
              style={styles.option}
              onPress={() => {
                onSelect(item.value as 'light' | 'dark' | 'system');
                onClose();
              }}
              activeOpacity={0.6}
            >
              <WdIcon name={item.icon} size={22} color={theme.colors.appBg} />
              <WdText
                labelKey={item.label}
                fontSize={16}
                style={{ marginLeft: 12 }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    position: 'relative',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 32, // make space for floating button
  },
  header: {
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  closeButton: {
    position: 'absolute',
    top: -25,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 3, // shadow for Android
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
});

export default ThemeBottomSheet;
