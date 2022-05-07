import {
  Dimensions,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
} from 'react-native';
import React, {LegacyRef} from 'react';
import {medium, tertiary} from '../../constants/styles/colors';
interface AppButtonProps {
  onChangeText?: (text: string) => void;
  value?: any;
  placeholder?: string;
  textColor?: string;
  isLoading?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?:
    | 'birthdate-day'
    | 'birthdate-full'
    | 'birthdate-month'
    | 'birthdate-year'
    | 'cc-csc'
    | 'cc-exp'
    | 'cc-exp-day'
    | 'cc-exp-month'
    | 'cc-exp-year'
    | 'cc-number'
    | 'email'
    | 'gender'
    | 'name'
    | 'name-family'
    | 'name-given'
    | 'name-middle'
    | 'name-middle-initial'
    | 'name-prefix'
    | 'name-suffix'
    | 'password'
    | 'password-new'
    | 'postal-address'
    | 'postal-address-country'
    | 'postal-address-extended'
    | 'postal-address-extended-postal-code'
    | 'postal-address-locality'
    | 'postal-address-region'
    | 'postal-code'
    | 'street-address'
    | 'sms-otp'
    | 'tel'
    | 'tel-country-code'
    | 'tel-national'
    | 'tel-device'
    | 'username'
    | 'username-new'
    | 'off'
    | undefined;
  textContentType?:
    | 'none'
    | 'URL'
    | 'addressCity'
    | 'addressCityAndState'
    | 'addressState'
    | 'countryName'
    | 'creditCardNumber'
    | 'emailAddress'
    | 'familyName'
    | 'fullStreetAddress'
    | 'givenName'
    | 'jobTitle'
    | 'location'
    | 'middleName'
    | 'name'
    | 'namePrefix'
    | 'nameSuffix'
    | 'nickname'
    | 'organizationName'
    | 'postalCode'
    | 'streetAddressLine1'
    | 'streetAddressLine2'
    | 'sublocality'
    | 'telephoneNumber'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'oneTimeCode'
    | undefined;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
  onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  innerRef?: any;
}
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
}: AppButtonProps) => {
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
