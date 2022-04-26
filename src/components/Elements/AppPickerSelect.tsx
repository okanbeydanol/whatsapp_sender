import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {primary} from '../../constants/styles/colors';
import countries from '../../assets/countries_details.json';
import AppFlag from './AppFlag';
const AppPickerSelect = ({
  onPress,
  title,
  style,
  textColor = '#fff',
  value,
}: any) => {
  const country = countries.find(
    data =>
      data.value.toLocaleLowerCase() ===
      (value !== null ? value.toLocaleLowerCase() : 'tr'),
  );

  const styles = StyleSheet.create({
    textStyle: {
      color: textColor,
      fontFamily: 'Montserrat-Medium',
      fontSize: 13,
      textTransform: 'capitalize',
      fontWeight: '500',
      marginLeft: 6,
    },
    buttonStyle: {
      width: Dimensions.get('window').width - 60,
      borderRadius: 9,
      height: 45,
      backgroundColor: primary.color,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconStyle: {
      width: 40,
      maxWidth: 50,
      maxHeight: 50,
      marginLeft: 16,
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.buttonStyle, style]}>
      <AppFlag
        style={{width: 20, height: 14, marginLeft: 8}}
        value={country?.value.toLocaleLowerCase()}
      />
      <Text style={styles.textStyle}>
        {country !== null ? country?.label : title}
      </Text>
    </TouchableOpacity>
  );
};

export default AppPickerSelect;
