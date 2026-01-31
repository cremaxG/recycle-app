import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  ViewToken,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import WdImage from '../../components/common/WdImage';
import WdText from '../../components/common/WdText';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type OnboardingItem = {
  key: string;
  image: any;
  titleKey: string;
  descKey: string;
};

const DATA: OnboardingItem[] = [
  {
    key: '1',
    image: require('../../assets/images/Onboarding1.png'),
    titleKey: 'onboarding.title1',
    descKey: 'onboarding.desc1',
  },
  {
    key: '2',
    image: require('../../assets/images/Onboarding2.png'),
    titleKey: 'onboarding.title2',
    descKey: 'onboarding.desc2',
  },
  {
    key: '3',
    image: require('../../assets/images/Onboarding3.png'),
    titleKey: 'onboarding.title3',
    descKey: 'onboarding.desc3',
  },
];

const OnboardingScreen: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const lastOffsetX = useRef(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setIndex(viewableItems[0].index || 0);
      }
    },
  ).current;

  const handleScrollEndDrag = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const direction = offsetX - lastOffsetX.current;

    lastOffsetX.current = offsetX;

    // User swiped LEFT (forward)
    if (direction > 0 && index === DATA.length - 1) {
      navigation.replace('Welcome');
    }
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <WdImage source={item.image} imageStyle={styles.image} />

      <WdText
        labelKey={item.titleKey}
        isBold
        fontSize={22}
        style={styles.title}
      />

      <WdText
        labelKey={item.descKey}
        fontSize={16}
        style={styles.description}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        onScrollEndDrag={handleScrollEndDrag}
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        {DATA.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === index ? theme.colors.appBg : theme.colors.placeholder,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  image: {
    width: 260,
    height: 260,
    resizeMode: 'contain',
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.7,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
});

export default OnboardingScreen;
