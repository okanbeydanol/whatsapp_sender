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
  openAutoStartSettings,
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
  console.log(
    '%c permissions2222',
    'background: #222; color: #bada55',
    permissions,
  );
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
            ref.current.scrollTo(3, true);
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
        ref.current?.scrollTo(1, true);
      } else if (!permissions.displayOverOtherApps) {
        ref.current?.scrollTo(3, true);
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
          Uygulamanın Whatsapp'ı uygulamasını açıp mesajı gönderebilmesi için
          gereken bir izin. (Accessibility Service)
        </Text>
        <View style={styles.infoContainer}>
          <View style={styles.buttonContainer}>
            <Text style={styles.permissionText}>İzin Statusu: </Text>
            {permissions.accessibility ? (
              <Text style={styles.permissionStatusAccess}>Başarılı</Text>
            ) : (
              <Text style={styles.permissionDenied}>Başarısız</Text>
            )}
          </View>
          {permissions.accessibility ? (
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => {
                if (ref.current) {
                  ref.current?.scrollTo(2, true);
                }
              }}>
              <Text style={styles.openBtnText}>Sıradaki İzin!</Text>
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
              <Text style={styles.openBtnText}>Ayarları Aç!</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.slide1}>
        <Image
          width={Dimensions.get('window').width - 180}
          style={styles.dMedia}
          source={require('../../assets/images/autostart.png')}
        />
        <Text style={styles.text}>
          Uygulamanın Whatsapp'ı uygulamasını açıp mesajı gönderebilmesi için
          kullandığımız servisin hata vermemesi için açmanız önerilir. Aksi
          halde sürekli izin yenileme sayfası açılabilir. (Otomatik Başlatma)
          Eğer İzin sayfası açılmıyorsa bir sonraki izine geçebilirsiniz.
        </Text>
        <View style={styles.infoContainer}>
          <TouchableOpacity
            style={styles.openBtn}
            onPress={() => {
              if (ref.current) {
                ref.current?.scrollTo(3, true);
              }
            }}>
            <Text style={styles.openBtnText}>Sıradaki İzin!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.openBtn}
            onPress={() => {
              openAutoStartSettings().catch((err: any) => {
                console.log('%c err', 'background: #222; color: #bada55', err);
              });
            }}>
            <Text style={styles.openBtnText}>Ayarları Aç!</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.slide2}>
        <Image
          width={Dimensions.get('window').width - 180}
          style={styles.dMedia}
          source={require('../../assets/images/permissonsent.png')}
        />
        <Text style={styles.text}>
          Gerektiği zamanda Whatsapp ve bu uygulama arasında geçiş yapabilmemiz
          için ve uygulamayı arkaplanda çalıştırabilmek gerekli olan bir izin.
          (Diğer Uygulamaların üstünde göster)
        </Text>
        <View style={styles.infoContainer}>
          <View style={styles.buttonContainer}>
            <Text style={styles.permissionText}>İzin Status: </Text>
            {permissions.displayOverOtherApps ? (
              <Text style={styles.permissionStatusAccess}>Başarılı</Text>
            ) : (
              <Text style={styles.permissionDenied}>Başarısız</Text>
            )}
          </View>
          {permissions.displayOverOtherApps ? (
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => {
                if (ref.current) {
                  ref.current?.scrollTo(1, true);
                }
              }}>
              <Text style={styles.openBtnText}>Sıradaki İzin!</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => {
                openDisplayOverOtherAppsPermissionSettings().catch(
                  (err: any) => {
                    console.log(
                      '%c err',
                      'background: #222; color: #bada55',
                      err,
                    );
                  },
                );
              }}>
              <Text style={styles.openBtnText}>Ayarları Aç!</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Swiper>
  );
};

export default PermissionScreen;
