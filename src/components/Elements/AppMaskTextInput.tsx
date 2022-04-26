import {Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import {medium, tertiary} from '../../constants/styles/colors';
import MaskInput from 'react-native-mask-input';

const AppMaskTextInput = ({
  onChangeText,
  onChange,
  placeholder,
  textContentType,
  style,
  innerRef,
  value,
}: any) => {
  const phoneNumberMask = [
    '(',
    /\d/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ];
  const attributes = {
    value: value,
    onChangeText: onChangeText,
    onChange: onChange,
    mask: phoneNumberMask,
    placeholder: placeholder,
    textContentType: textContentType,
    style: {
      ...styles.textInputStyle,
      ...style,
    },
  };
  return <MaskInput ref={innerRef} {...attributes} />;
};

export default AppMaskTextInput;

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
