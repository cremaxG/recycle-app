import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// type Props = {
//   navigation: any; // or your navigation prop type
// };

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
