import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import WdText from './WdText';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';

type InputVariant = 'default' | 'outlined' | 'underlined';

type Props = {
  labelKey: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  variant?: InputVariant;
  editable?: boolean;
  prependIcon?: {
    name: string;
    onPress?: () => void;
    size?: number;
    color?: string;
  };
  appendIcon?: {
    name: string;
    onPress?: () => void;
    size?: number;
    color?: string;
  };
};

const WdInput: React.FC<Props> = ({
  labelKey,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  variant = 'default',
  editable = true,
  prependIcon,
  appendIcon,
}) => {
  const { theme } = useTheme();
  const [secure, setSecure] = useState(secureTextEntry);

  const mode = variant === 'outlined' ? 'outlined' : 'flat';

  // Right icon for secure text toggle OR append icon
  const rightIcon = secureTextEntry
    ? () => (
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Icon
            name={secure ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={theme.colors.placeholder}
          />
        </TouchableOpacity>
      )
    : appendIcon
    ? () =>
        appendIcon.onPress ? (
          <TouchableOpacity onPress={appendIcon.onPress}>
            <Icon
              name={appendIcon.name}
              size={appendIcon.size || 20}
              color={appendIcon.color || theme.colors.placeholder}
            />
          </TouchableOpacity>
        ) : (
          <Icon
            name={appendIcon.name}
            size={appendIcon.size || 20}
            color={appendIcon.color || theme.colors.placeholder}
          />
        )
    : undefined;

  // Left icon for prepend
  const leftIcon = prependIcon
    ? () =>
        prependIcon.onPress ? (
          <TouchableOpacity onPress={prependIcon.onPress}>
            <Icon
              name={prependIcon.name}
              size={prependIcon.size || 20}
              color={prependIcon.color || theme.colors.placeholder}
            />
          </TouchableOpacity>
        ) : (
          <Icon
            name={prependIcon.name}
            size={prependIcon.size || 20}
            color={prependIcon.color || theme.colors.placeholder}
          />
        )
    : undefined;

  return (
    <View style={styles.container}>
      <WdText labelKey={labelKey} isBold fontSize={14} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secure}
        mode={mode}
        disabled={!editable}
        style={[styles.input]}
        underlineColor={error ? theme.colors.error : theme.colors.placeholder}
        outlineColor={error ? theme.colors.error : theme.colors.placeholder}
        activeUnderlineColor={theme.colors.primary}
        activeOutlineColor={theme.colors.primary}
        left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
        right={rightIcon ? <TextInput.Icon icon={rightIcon} /> : undefined}
      />

      {error && (
        <WdText
          label={error}
          fontSize={12}
          style={{ color: theme.colors.error, marginTop: 4 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
});

export default WdInput;
