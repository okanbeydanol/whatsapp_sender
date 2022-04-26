import {Dimensions, StyleSheet, TextInput} from 'react-native';
import React from 'react';
import {medium, tertiary} from '../../constants/styles/colors';

const AppTextInput = ({
  onChangeText,
  value,
  placeholder,
  keyboardType,
  autoComplete,
  textContentType,
  style,
  multiline,
  numberOfLines,
  onChange,
  innerRef,
}: any) => {
  const attributes = {
    onChange: onChange,
    onChangeText: onChangeText,
    value: value,
    placeholder: placeholder,
    keyboardType: keyboardType,
    textContentType: textContentType,
    autoComplete: autoComplete,
    ref: innerRef,
    style: {
      ...styles.textInputStyle,
      ...style,
    },
    multiline: multiline,
    numberOfLines: numberOfLines,
  };
  return <TextInput {...attributes} />;
};

export default AppTextInput;

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  textInputStyle: {
    width: Dimensions.get('window').width - 60,
    backgroundColor: tertiary.color,
    borderRadius: 9,
    color: medium.color,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingStart: 16,
  },
});
