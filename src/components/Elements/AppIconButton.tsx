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
import {Icon} from '@rneui/themed';
interface AppButtonProps {
  data: AppButtonPropsData;
  style: any;
  isLoading?: boolean;
}
interface AppButtonPropsData {
  text: string;
  name: string;
  size: number;
  color: string;
  handler: () => void;
}
const AppIconButton = ({style, isLoading, data}: AppButtonProps) => {
  const styles = StyleSheet.create({
    textStyle: {
      color: '#000000',
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
      onPress={() => {
        data.handler();
      }}
      style={[styles.buttonStyle, style]}>
      <Icon
        name={data.name}
        size={data.size}
        color={data.color}
        style={styles.iconStyle}
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.textStyle}>{data.text}</Text>
          <ActivityIndicator color={secondary.color} style={styles.loading} />
        </View>
      ) : (
        <View>
          <Text style={styles.textStyle}>{data.text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AppIconButton;
