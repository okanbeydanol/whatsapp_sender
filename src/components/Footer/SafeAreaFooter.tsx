import {StyleSheet, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const SafeOreoFooter = () => {
  return <SafeAreaView style={styles.safeArea} edges={['bottom']} />;
};

export default SafeOreoFooter;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
    margin: 0,
  },
  footerStyle: {
    height: 0,
  },
});
