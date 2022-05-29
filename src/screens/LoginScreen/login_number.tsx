/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
import {batch, useDispatch, useSelector} from 'react-redux';
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
import {getPermissionsStore} from '../../store/slices/permissions';
import usePermissions from '../../hooks/usePermissions';

const LoginScreen = ({navigation}: any) => {
  //Dispatch
  const dispatch = useDispatch();

  //Translation
  const {t, i18n} = useTranslation();
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

  //States
  const [digit, setDigit] = useState('2342423444');
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(true);

  //Selectors
  const countryStore = useSelector(getCountryStore);
  const deviceInfoStore = useSelector(getDeviceInfoStore);
  const permissionStore = useSelector(getPermissionsStore);

  //Hooks
  const permission = usePermissions();

  //Queries
  const [trigger, {data, isFetching, isError, isLoading, isSuccess, error}] =
    useLazyCheckPhoneQuery();

  //UseEffects
  //Check Permissions
  useEffect(() => {
    if (
      !permissionStore.camera ||
      !permissionStore.storage ||
      !permissionStore.location ||
      !permissionStore.contacts ||
      !permissionStore.notification
    ) {
      permission.check_permissions();
    } else {
      setLoading(false);
    }
  }, [permissionStore]);

  //Check if the user has granted the permissions open otp screen
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

  //Fetch location and update user and country
  useEffect(() => {
    if (countryStore && countryStore.value === null && !loading) {
      setTimeout(async () => {
        try {
          getData('[geocoderApiResult]').then(
            async (result: GeocoderResult | null) => {
              if (result === null) {
                Geolocation.getCurrentPosition(
                  async position => {
                    const geocoderResult: GeocoderResult = await reverseGeocode(
                      {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                      },
                    );
                    if (geocoderResult) {
                      const country: any = countries.find(
                        (o: any) =>
                          o.value.toLocaleLowerCase() ===
                          geocoderResult.addresses[0].address.countryCode.toLocaleLowerCase(),
                      );
                      if (country) {
                        OneSignal.sendTags({
                          country: geocoderResult.addresses[0].address.country,
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
                        batch(() => {
                          setLoadingButton(false);
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
                        });
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
              } else {
                const country: any = countries.find(
                  (o: any) =>
                    o.value.toLocaleLowerCase() ===
                    result.addresses[0].address.countryCode.toLocaleLowerCase(),
                );
                if (country) {
                  batch(() => {
                    setLoadingButton(false);
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
                  });
                }
              }
            },
          );
        } catch (err) {
          console.warn(err);
        }
      }, 10);
    }
  }, [dispatch, countryStore, loading]);

  //Fetch phone number Error
  useEffect(() => {
    if (isError) {
      console.log('%c error', 'background: #222; color: #bada55', error);
      Alert.alert(
        'Hata!',
        'Telefon kontrol edilirken bir hata ile karşılaşıldı!',
        [{text: 'OK', onPress: () => {}}],
      );
    }
  }, [isError]);

  //Functions
  //OpenCountryPicker
  const pickerPress = () => {
    navigation.navigate('CountriesModal');
  };

  //Save Data
  const save = () => {
    if (digit.length > 7) {
      setTimeout(() => {
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
            editable={!loading}
            onChangeText={(masked: string, unmasked: string) => {
              setDigit(unmasked); // you can use the unmasked value as well
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <AppButton
            isLoading={loading ? loading : loadingButton}
            onPress={save}
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
