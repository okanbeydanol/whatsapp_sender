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
import {useDispatch} from 'react-redux';
import {primary} from '../../constants/styles/colors';
import AppHeader from '../../components/Header/AppHeader';
import AppButton from '../../components/Elements/AppButton';
import AppTextInput from '../../components/Elements/AppTextInput';
import {LoginType, LOGIN_SUCCESS} from '../../store/slices/login';
import {useLazyUpdateUserSignatureQuery} from '../../store/api/loginApi';

const LoginScreenNumberSignature = ({route, navigation}: any) => {
  //Route Params
  const {userGuid} = route.params;

  //Dispatch
  const dispatch = useDispatch();

  //UseTranslation
  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;

  //Refs
  const signatureRef: any = useRef<TextInput>(null);

  //Queries
  const [trigger, {data, isFetching, isError, isLoading, isSuccess, error}] =
    useLazyUpdateUserSignatureQuery();

  //UseEffects
  //Update User Name Success
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

  //Update User Name Error
  useEffect(() => {
    if (isError) {
      console.log('%c error', 'background: #222; color: #bada55', error?.data);
      Alert.alert(
        'Hata Var',
        'İmza update edilirken bir sorunla karşılaşıldı!',
        [{text: 'OK', onPress: () => {}}],
      );
    }
  }, [isError]);

  //Trigger name update
  const onPress = async () => {
    if (
      signatureRef.current &&
      signatureRef.current.value &&
      signatureRef.current.value.length > 3
    ) {
      trigger({
        user_guid: userGuid,
        signature: signatureRef?.current?.value,
      });
    }
  };
  return (
    <>
      <AppHeader />
      <>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Whatsapp Sender</Text>
        </View>
        <View style={styles.inputContainer}>
          <AppTextInput
            placeholder="Whatsapp signature..."
            style={styles.inputStyle}
            innerRef={signatureRef}
            onChangeText={(value: string) =>
              (signatureRef.current.value = value)
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

export default LoginScreenNumberSignature;
