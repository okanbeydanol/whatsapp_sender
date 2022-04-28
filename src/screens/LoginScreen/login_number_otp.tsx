/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {batch, useDispatch} from 'react-redux';
import {medium, primary, tertiary} from '../../constants/styles/colors';
import AppHeader from '../../components/Header/AppHeader';
import AppButton from '../../components/Elements/AppButton';
import {LoginType, LOGIN_SUCCESS} from '../../store/slices/login';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useLazyLoginOrCreateQuery} from '../../store/api/loginApi';
import {USER_CHANGE} from '../../store/slices/user';

const LoginScreenNumberOtp = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;
  const {
    digit,
    areaCode,
    countryCode,
    otp,
    userGuid,
    fullname,
    uniqueId,
    fingerprint,
    latitude,
    longitude,
    city_name,
  } = route.params;
  const [trigger, {data, isFetching, isError, isLoading, isSuccess, error}] =
    useLazyLoginOrCreateQuery();

  useEffect(() => {
    if (typeof data !== 'undefined' && isSuccess) {
      console.log('%c data', 'background: #222; color: #bada55', data);
      if (userGuid !== null && fullname !== null) {
        if (data.freeze_account === null || +data.freeze_account === 0) {
          dispatch(
            LOGIN_SUCCESS({
              type: LoginType.LOGIN_SUCCESS,
              userGuid: userGuid,
              loading: true,
            }),
          );
        } else {
          Alert.alert('Ban', 'Hesabın bnalandı yetkili ile iletişime geç', [
            {text: 'OK', onPress: () => {}},
          ]);
        }
      } else {
        navigation.popToTop();
        navigation.navigate('LoginScreenNumberInfo', {
          userGuid: data.user_guid,
        });
      }
    }
  }, [data, isSuccess]);
  useEffect(() => {
    console.log('%c error', 'background: #222; color: #bada55', error);
    if (isError) {
      Alert.alert('Hata Var', 'OTP GONDERILEMIYOR', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [isError]);

  const complete = () => {
    let errorResult = false;
    if (!value || !value.length) {
      errorResult = true;
    }
    if (+otp !== +value) {
      errorResult = true;
    }
    if (errorResult) {
      Alert.alert('Alert Title', 'My Alert Msg', [
        {text: 'OK', onPress: () => setValue('')},
      ]);
    } else {
      trigger({
        digit: digit,
        areaCode: areaCode,
        countryCode: countryCode.toLocaleLowerCase(),
        uniqueId: uniqueId,
        fingerprint: fingerprint,
        latitude: latitude,
        longitude: longitude,
        city_name: city_name,
      });
      console.log('%c triggerladı', 'background: #222; color: #bada55', {
        digit: digit,
        areaCode: areaCode,
        countryCode: countryCode.toLocaleLowerCase(),
        uniqueId: uniqueId,
        fingerprint: fingerprint,
        latitude: latitude,
        longitude: longitude,
        city_name: city_name,
      });
    }
  };
  // const changeLanguage = value => {
  //   i18n
  //     .changeLanguage(value)
  //     .then(() => setLanguage(value))
  //     .catch(err =>
  // };

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: 6});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    if (ref) {
      ref.current?.focus();
    }
  }, [ref]);

  useEffect(() => {
    if (value.length === 6) {
      complete();
    }
  }, [value]);

  return (
    <>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}>
        <AppHeader />
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title2}>Whatsapp Sender</Text>
          </View>
          <View style={styles.inputContainer}>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={6}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </View>
          <View style={styles.inputContainer}>
            <AppButton onPress={complete} title={t('login:buttonText')} />
          </View>
        </>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  titleContainer: {
    marginTop: 52,
    width: 190,
    marginLeft: 30,
  },
  pickerStyle: {
    width: 72,
    marginRight: 6,
  },
  inputStyle: {},
  root: {flex: 1, padding: 0},
  title: {textAlign: 'center', fontSize: 30, justifyContent: 'center'},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    backgroundColor: tertiary.color,
    borderRadius: 9,
    color: medium.color,
    height: 45,
    paddingTop: 12,
    marginRight: 12,
    paddingStart: 16,
  },
  focusCell: {
    borderColor: '#000',
  },
  title2: {
    color: primary.color,
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    fontWeight: '700',
  },
});

export default LoginScreenNumberOtp;
