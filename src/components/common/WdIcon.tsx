import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import WdText from './WdText';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  labelKey?: string;
  labelValues?: Record<string, any>;
  labelStyle?: TextStyle;
  isBold?: boolean;
}

const WdIcon: React.FC<IconProps> = ({
  name,
  size = 24,
  style,
  labelKey,
  labelValues,
  labelStyle,
  isBold = false,
  color,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Icon name={name} size={size} color={color ? color : theme.colors.text} />
      {labelKey ? (
        <WdText
          labelKey={labelKey}
          labelValues={labelValues}
          style={labelStyle}
          isBold={isBold}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default WdIcon;
