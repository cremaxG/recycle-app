import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import WdText from './WdText';

type Props = {
  source: ImageSourcePropType;
  labelKey?: string;
  labelValues?: Record<string, any>;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

const WdImage: React.FC<Props> = ({
  source,
  labelKey,
  labelValues,
  imageStyle,
  containerStyle,
  labelStyle,
}) => {
  return (
    <View style={containerStyle}>
      <Image source={source} style={imageStyle} />
      {labelKey && (
        <WdText
          labelKey={labelKey}
          labelValues={labelValues}
          style={labelStyle}
        />
      )}
    </View>
  );
};

export default WdImage;
