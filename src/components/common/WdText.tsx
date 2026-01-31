import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

type Props = {
  label?: string;
  labelKey?: string;
  fontSize?: number;
  color?: string;
  isBold?: boolean;
  numberOfLines?: number;
  style?: TextStyle | TextStyle[];
};

const WdText: React.FC<Props> = ({
  label,
  labelKey,
  fontSize = 14,
  color,
  isBold = false,
  numberOfLines,
  style,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const text = labelKey ? t(labelKey) : label;

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontSize,
          color: color || theme.colors.text,
          fontWeight: isBold ? '700' : '400',
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
};

export default WdText;
