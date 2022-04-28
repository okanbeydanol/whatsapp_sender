/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  Dimensions,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {medium, primary, tertiary} from '../../constants/styles/colors';
import AppHeader from '../../components/Header/AppHeader';
import AppMaskTextInput from '../../components/Elements/AppMaskTextInput';
import AppPickerSelect from '../../components/Elements/AppPickerSelect';
import AppButton from '../../components/Elements/AppButton';
import Geolocation from 'react-native-geolocation-service';
import {GeocoderResult, reverseGeocode} from '../../utils/geocoderApi';
import {getData, storeData} from '../../utils/async-storage';
import {COUNTRY_CHANGE, getCountryStore} from '../../store/slices/country';
import countries from '../../assets/countries_details.json';
import OneSignal from 'react-native-onesignal';
import {useLazyCheckPhoneQuery} from '../../store/api/loginApi';
import {getDeviceInfoStore} from '../../store/slices/deviceInfo';

const LoginScreen = ({navigation}: any) => {
  const countryStore = useSelector(getCountryStore);
  const deviceInfoStore = useSelector(getDeviceInfoStore);
  const {t, i18n} = useTranslation();
  const [digit, setDigit] = useState('2342423444');

  const pickerPress = () => {
    navigation.navigate('CountriesModal');
  };
  console.log('render');
  const [trigger, {data, isFetching, isError, isLoading, isSuccess, error}] =
    useLazyCheckPhoneQuery();

  useEffect(() => {
    if (typeof data !== 'undefined' && isSuccess) {
      if (countryStore.label !== null && countryStore.value !== null) {
        OneSignal.sendTags({
          digit: digit,
          areaCode: countryStore.label,
          countryCode: countryStore.value?.toLocaleLowerCase(),
        });
      }
      if (data.not.freeze_account === null || +data.not.freeze_account === 0) {
        console.log(
          '%c Your Code Is: ',
          'background: #222; color: #bada55',
          data.not.description,
        );
        navigation.navigate('LoginScreenNumberOtp', {
          digit: digit,
          areaCode: countryStore.label,
          countryCode: countryStore.value?.toLocaleLowerCase(),
          otp: data.not.description,
          fullname: data.not.fullname,
          userGuid: data.not.user_guid,
          uniqueId: deviceInfoStore?.uniqueId,
          fingerprint: deviceInfoStore?.fingerprint,
          latitude: countryStore.latitude,
          longitude: countryStore.longitude,
          city_name: countryStore.city_name,
        });
      } else {
        Alert.alert('Ban', 'Hesabın bnalandı yetkili ile iletişime geç', [
          {text: 'OK', onPress: () => {}},
        ]);
      }
    }
  }, [data, isSuccess]);

  const onPress = () => {
    if (digit.length > 7) {
      setTimeout(() => {
        console.log('%c negidiyor', 'background: #222; color: #bada55', {
          digit: digit,
          areaCode: countryStore.label,
          countryCode: countryStore.value?.toLocaleLowerCase(),
          uniqueId: deviceInfoStore?.uniqueId,
          fingerprint: deviceInfoStore?.fingerprint,
          latitude: countryStore.latitude,
          longitude: countryStore.longitude,
          city_name: countryStore.city_name,
        });
        trigger({
          digit: digit,
          areaCode: countryStore.label,
          countryCode: countryStore.value?.toLocaleLowerCase(),
          uniqueId: deviceInfoStore?.uniqueId,
          fingerprint: deviceInfoStore?.fingerprint,
          latitude: countryStore.latitude,
          longitude: countryStore.longitude,
          city_name: countryStore.city_name,
        });
      }, 100);
    } else {
      Alert.alert('Boş Bırakma', 'Doldur', [{text: 'OK', onPress: () => {}}]);
    }
  };
  useEffect(() => {
    if (isError) {
      console.log('%c error', 'background: #222; color: #bada55', error);
      Alert.alert('Hata Var', '', [{text: 'OK', onPress: () => {}}]);
    }
  }, [isError]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (countryStore && countryStore.value === null) {
      setTimeout(async () => {
        try {
          getData('[geocoderApiResult]').then(
            async (result: GeocoderResult | null) => {
              if (result === null) {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                  {
                    title: 'Cool Location Permission',
                    message: 'We will select your country using your location!',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                  },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  Geolocation.getCurrentPosition(
                    async position => {
                      const geocoderResult: GeocoderResult =
                        await reverseGeocode({
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude,
                        });
                      if (geocoderResult) {
                        const country: any = countries.find(
                          (o: any) =>
                            o.value.toLocaleLowerCase() ===
                            geocoderResult.addresses[0].address.countryCode.toLocaleLowerCase(),
                        );
                        if (country) {
                          OneSignal.sendTags({
                            country:
                              geocoderResult.addresses[0].address.country,
                            countryCode:
                              geocoderResult.addresses[0].address.countryCode,
                            countrySecondarySubdivision:
                              geocoderResult.addresses[0].address
                                .countrySecondarySubdivision,
                            countrySubdivisionName:
                              geocoderResult.addresses[0].address
                                .countrySubdivisionName,
                            postalCode:
                              geocoderResult.addresses[0].address.postalCode,
                            streetNumber:
                              geocoderResult.addresses[0].address.streetNumber,
                          });
                          storeData('[geocoderApiResult]', geocoderResult);
                          dispatch(
                            COUNTRY_CHANGE({
                              value: country.value,
                              label: country.label,
                              country_name: country.country_name,
                              latitude:
                                geocoderResult.addresses[0].position.split(
                                  ',',
                                )[0],
                              longitude:
                                geocoderResult.addresses[0].position.split(
                                  ',',
                                )[1],
                              city_name:
                                geocoderResult.addresses[0].address
                                  .countrySubdivisionName,
                            }),
                          );
                        }
                      }
                    },
                    (err: any) => {
                      console.warn(err.code, err.message);
                    },
                    {
                      enableHighAccuracy: true,
                      timeout: 15000,
                      maximumAge: 10000,
                    },
                  );
                }
              } else {
                const country: any = countries.find(
                  (o: any) =>
                    o.value.toLocaleLowerCase() ===
                    result.addresses[0].address.countryCode.toLocaleLowerCase(),
                );
                if (country) {
                  dispatch(
                    COUNTRY_CHANGE({
                      value: country.value,
                      label: country.label,
                      country_name: country.country_name,
                      latitude: result.addresses[0].position.split(',')[0],
                      longitude: result.addresses[0].position.split(',')[1],
                      city_name:
                        result.addresses[0].address.countrySubdivisionName,
                    }),
                  );
                }
              }
            },
          );
        } catch (err) {
          console.warn(err);
        }
      }, 10);
    }
  }, [dispatch, countryStore]);

  // const changeLanguage = value => {
  //   i18n
  //     .changeLanguage(value)
  //     .then(() => setLanguage(value))
  //     .catch(err =>
  // };
  //
  // const selectedLanguageCode = i18n.language;
  // const [selectedValue, setSelectedValue] = useState(
  //   selectedLanguageCode.toUpperCase(),
  // );
  // NativeSyntheticEvent<TextInputChangeEventData>

  return (
    <>
      <AppHeader />
      <>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Whatsapp Sender</Text>
        </View>
        <View style={styles.inputContainer}>
          <AppPickerSelect
            value={countryStore.value}
            title="asd"
            textColor={medium.color}
            style={styles.pickerStyle}
            onPress={pickerPress}
          />
          <AppMaskTextInput
            placeholder={t('login:number_placeholder')}
            style={styles.inputStyle}
            value={digit}
            onChangeText={(masked: string, unmasked: string) => {
              setDigit(unmasked); // you can use the unmasked value as well
            }}
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
  pickerStyle: {
    width: 72,
    marginRight: 6,
    backgroundColor: tertiary.color,
  },
  inputStyle: {
    width: Dimensions.get('window').width - 132,
  },
  title: {
    color: primary.color,
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    fontWeight: '700',
  },
});

export default LoginScreen;
