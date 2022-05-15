/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef} from 'react';
import {
  AppState,
  AppStateStatus,
  Dimensions,
  NativeEventSubscription,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  canDisplayOverOtherApps,
  isAccessibilityOn,
  openAccessibilitySettings,
  openDisplayOverOtherAppsPermissionSettings,
} from 'react-native-accessibility-manager-plugin';
import {checkNotifications} from 'react-native-permissions';
import Image from 'react-native-scalable-image';

import Swiper from 'react-native-swiper';
import {useDispatch, useSelector} from 'react-redux';
import {primary} from '../../constants/styles/colors';
import {
  getPermissionsStore,
  PERMISSIONS_CHANGE,
} from '../../store/slices/permissions';
import {storeData} from '../../utils/async-storage';

const PermissionScreen = () => {
  //Dispatch
  const dispatch = useDispatch();

  //Selectors
  const permissions = useSelector(getPermissionsStore);

  //Refs
  let ref: any = useRef();

  //UseEffects
  //Check if the app is in foreground and if the user has granted the permissions
  useEffect(() => {
    const appState: NativeEventSubscription = AppState.addEventListener(
      'change',
      async (state: AppStateStatus) => {
        if (state === 'active') {
          if (!permissions.accessibility) {
            ref.current.scrollTo(1, true);
          } else {
            ref.current.scrollTo(2, true);
          }
          const accessibilityOn = await isAccessibilityOn();
          const displayOverOtherApps = await canDisplayOverOtherApps();
          const storage = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
          const location = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          const contacts = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          );
          const camera = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          const notification = await (await checkNotifications()).status;
          storeData('[permissions]', {
            accessibility: accessibilityOn,
            displayOverOtherApps: displayOverOtherApps,
            location: location,
            contacts: contacts,
            camera: camera,
            storage: storage,
            notification: notification === 'granted' ? true : false,
          });
          dispatch(
            PERMISSIONS_CHANGE({
              accessibility: accessibilityOn,
              displayOverOtherApps: displayOverOtherApps,
              location: location,
              contacts: contacts,
              camera: camera,
              storage: storage,
              notification: notification === 'granted' ? true : false,
            }),
          );
        }

        return () => {
          appState.remove();
        };
      },
    );
  }, [dispatch]);

  useEffect(() => {
    if (ref.current) {
      if (!permissions.accessibility) {
        ref.current.scrollTo(1, true);
      } else {
        ref.current.scrollTo(2, true);
      }
    }
  }, [ref]);

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: primary.color,
    },
    slide1: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: primary.color,
      marginTop: 120,
    },
    slide2: {
      flex: 1,
      backgroundColor: primary.color,
      alignItems: 'center',
      marginTop: 120,
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9',
    },
    text: {
      color: '#fff',
      fontFamily: 'Montserrat-Medium',
      fontSize: 16,
      fontWeight: '600',
      padding: 36,
      textAlign: 'center',
    },
    dMedia: {},
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    infoContainer: {
      marginTop: 'auto',
      marginBottom: 42,
    },
    openBtn: {
      width: Dimensions.get('window').width - 180,
      height: 45,
      backgroundColor: '#97CAE5',
      borderRadius: 12,
      marginTop: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    openBtnText: {
      color: primary.color,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 16,
      fontWeight: '600',
    },
    permissionText: {
      color: '#fff',
      fontFamily: 'Montserrat-Medium',
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 16,
    },
    permissionDenied: {
      color: '#DC143C',
      fontFamily: 'Montserrat-Medium',
      fontSize: 16,
      fontWeight: '500',
    },
    permissionStatusAccess: {
      color: '#9ACD32',
      fontFamily: 'Montserrat-Medium',
      fontSize: 16,
      fontWeight: '500',
    },
  });
  return (
    <Swiper
      ref={ref}
      showsPagination={false}
      style={styles.wrapper}
      showsButtons={true}>
      <View style={styles.slide1}>
        <Image
          width={Dimensions.get('window').width - 180}
          style={styles.dMedia}
          source={require('../../assets/images/permissiontime.png')}
        />
        <Text style={styles.text}>
          Uygulamayı arkaplanda çalıştırabilmek için ve gerektiği zamanda
          uygulamayı uyandırabilmemiz için gerekli olan bir izin.
        </Text>
        <View style={styles.infoContainer}>
          <View style={styles.buttonContainer}>
            <Text style={styles.permissionText}>Permission: </Text>
            {permissions.accessibility ? (
              <Text style={styles.permissionStatusAccess}>Denied</Text>
            ) : (
              <Text style={styles.permissionDenied}>Denied</Text>
            )}
          </View>
          {permissions.accessibility ? (
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => {
                ref.current.scrollTo(2, true);
              }}>
              <Text style={styles.openBtnText}>Next Permission</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => {
                openAccessibilitySettings().catch((err: any) => {
                  console.log(
                    '%c err',
                    'background: #222; color: #bada55',
                    err,
                  );
                });
              }}>
              <Text style={styles.openBtnText}>Open Settings</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.slide2}>
        <Image
          width={Dimensions.get('window').width - 180}
          style={styles.dMedia}
          source={require('../../assets/images/permissonsent.png')}
        />
        <Text style={styles.text}>
          Uygulamanın whatsapp uygulamasını açıp mesajı gönderebilmesi için
          gereken bir izin
        </Text>
        <View style={styles.infoContainer}>
          <View style={styles.buttonContainer}>
            <Text style={styles.permissionText}>Permission: </Text>
            {permissions.displayOverOtherApps ? (
              <Text style={styles.permissionStatusAccess}>Granted</Text>
            ) : (
              <Text style={styles.permissionDenied}>Denied</Text>
            )}
          </View>
          {permissions.displayOverOtherApps ? (
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => {
                ref.current.scrollTo(1, true);
              }}>
              <Text style={styles.openBtnText}>Next Permission</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => {
                openDisplayOverOtherAppsPermissionSettings();
              }}>
              <Text style={styles.openBtnText}>Open Settings</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Swiper>
  );
};

export default PermissionScreen;
