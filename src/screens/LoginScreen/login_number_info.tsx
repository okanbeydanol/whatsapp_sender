/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {batch, useDispatch} from 'react-redux';
import {primary} from '../../constants/styles/colors';
import AppHeader from '../../components/Header/AppHeader';
import AppButton from '../../components/Elements/AppButton';
import AppTextInput from '../../components/Elements/AppTextInput';
import {LoginType, LOGIN_SUCCESS} from '../../store/slices/login';
import {useLazyUpdateUserNameQuery} from '../../store/api/loginApi';

const LoginScreenNumberInfo = ({route, navigation}: any) => {
  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;
  const dispatch = useDispatch();
  const {userGuid} = route.params;
  const fullnameRef: any = useRef<TextInput>(null);

  const [trigger, {data, isFetching, isError, isLoading, isSuccess, error}] =
    useLazyUpdateUserNameQuery();
  useEffect(() => {
    if (typeof data !== 'undefined' && isSuccess) {
      dispatch(
        LOGIN_SUCCESS({
          type: LoginType.LOGIN_SUCCESS,
          userGuid: userGuid,
          loading: true,
        }),
      );
    }
  }, [data, isSuccess]);
  useEffect(() => {
    if (isError) {
      Alert.alert('Hata Var', 'OTP GONDERILEMIYOR', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [isError]);

  const onPress = async () => {
    if (
      fullnameRef.current &&
      fullnameRef.current.value &&
      fullnameRef.current.value.length > 5
    ) {
      trigger({
        user_guid: userGuid,
        fullname: fullnameRef?.current?.value,
      });
    }
  };
  return (
    <>
      <AppHeader />
      <>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>apprizone’a hoşgeldin</Text>
        </View>
        <View style={styles.inputContainer}>
          <AppTextInput
            placeholder={t('login:fullname_placeholder')}
            style={styles.inputStyle}
            innerRef={fullnameRef}
            onChangeText={(value: string) =>
              (fullnameRef.current.value = value)
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <AppButton
            isLoading={isLoading}
            onPress={onPress}
            title={t('login:buttonText')}
          />
        </View>
      </>
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
  imageStyle: {
    width: 51,
    height: 51,
    resizeMode: 'contain',
    marginRight: 8,
  },
  inputStyle: {
    width: Dimensions.get('window').width - 60,
  },
  title: {
    color: primary.color,
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    fontWeight: '700',
  },
});

export default LoginScreenNumberInfo;
