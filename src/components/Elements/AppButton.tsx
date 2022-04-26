import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {primary, secondary} from '../../constants/styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const AppButton = ({
  onPress,
  title,
  style,
  textColor = '#fff',
  isLoading,
}: any) => {
  const styles = StyleSheet.create({
    textStyle: {
      color: textColor,
      fontFamily: 'Montserrat-Medium',
      fontSize: 13,
      textTransform: 'capitalize',
      fontWeight: '500',
    },
    buttonStyle: {
      width: Dimensions.get('window').width - 60,
      borderRadius: 9,
      height: 45,
      backgroundColor: primary.color,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    iconStyle: {
      width: 40,
      maxWidth: 50,
      maxHeight: 50,
      marginLeft: 16,
    },
    loading: {
      position: 'absolute',
    },
    loadingContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <TouchableOpacity
      disabled={isLoading}
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.buttonStyle, style]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.textStyle}>{title}</Text>
          <ActivityIndicator color={secondary.color} style={styles.loading} />
        </View>
      ) : (
        <View>
          <Text style={styles.textStyle}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
