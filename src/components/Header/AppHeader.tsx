import {StyleSheet, View} from 'react-native';
import React from 'react';
import {primary} from '../../constants/styles/colors';
import {SafeAreaView} from 'react-native-safe-area-context';

const AppHeader = ({style, children}: any) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={[styles.headerStyle, style]}>{children}</View>
    </SafeAreaView>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: primary.color,
  },
  headerStyle: {
    fontFamily: 'Montserrat-Medium',
    height: 38,
  },
});
