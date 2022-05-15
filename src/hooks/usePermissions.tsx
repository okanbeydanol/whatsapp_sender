/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';
import {
  Alert,
  AppState,
  AppStateStatus,
  Linking,
  NativeEventSubscription,
  Permission,
  PermissionsAndroid,
} from 'react-native';
import {
  canDisplayOverOtherApps,
  isAccessibilityOn,
} from 'react-native-accessibility-manager-plugin';
import {checkNotifications} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import {
  getPermissionsStore,
  PERMISSIONS_CHANGE,
} from '../store/slices/permissions';
import {storeData} from '../utils/async-storage';

const usePermissions = () => {
  const dispatch = useDispatch();
  const permissions = useSelector(getPermissionsStore);
  const getPermissions = async (): Promise<{
    camera: boolean;
    location: boolean;
    contacts: boolean;
    storage: boolean;
    notification: boolean;
  }> => {
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
    return {
      camera: camera,
      location: location,
      contacts: contacts,
      storage: storage,
      notification: notification === 'granted' ? true : false,
    };
  };

  const check_permissions = () => {
    const PermissionsArray: Permission[] = [];
    if (!permissions.camera) {
      PermissionsArray.push(PermissionsAndroid.PERMISSIONS.CAMERA);
    }
    if (!permissions.contacts) {
      PermissionsArray.push(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
    }
    if (!permissions.location) {
      PermissionsArray.push(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
    if (!permissions.storage) {
      PermissionsArray.push(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
    }

    setTimeout(async () => {
      PermissionsAndroid.requestMultiple(PermissionsArray).then(async () => {
        const status = await getPermissions();
        if (
          !status.camera ||
          !status.storage ||
          !status.location ||
          !status.contacts ||
          !status.notification
        ) {
          let i = 1;
          let text = '';
          if (!status.camera) {
            text += `${i}. Kamera\n`;
            i++;
          }

          if (!status.storage) {
            text += `${i}. Depolama\n`;
            i++;
          }
          if (!status.location) {
            text += `${i}. Konum\n`;
            i++;
          }
          if (!status.contacts) {
            text += `${i}. Kişiler\n`;
            i++;
          }
          if (!status.notification) {
            text += `${i}. Bildirim\n`;
            i++;
          }

          Alert.alert(
            'Permissions',
            'Uygulamanın düzgün çalışabilmesi için aşağıdaki izinleri vermelisiniz.\n\nizinler:\n' +
              text,
            [
              {
                text: 'Open App Permission Settings',
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          const accessibility = await isAccessibilityOn();
          const displayOverOtherApps = await canDisplayOverOtherApps();
          storeAndDispatchPermissions({
            accessibility: accessibility,
            displayOverOtherApps: displayOverOtherApps,
          });
        }
      });
    }, 10);
  };

  const storeAndDispatchPermissions = async (extraData: {}) => {
    const {camera, location, contacts, storage, notification} =
      await getPermissions();
    storeData('[permissions]', {
      camera: camera,
      location: location,
      contacts: contacts,
      storage: storage,
      notification: notification,
      ...extraData,
    });
    dispatch(
      PERMISSIONS_CHANGE({
        camera: camera,
        location: location,
        contacts: contacts,
        storage: storage,
        notification: notification,
      }),
    );
  };

  //
  useEffect(() => {
    setTimeout(() => {
      const appState: NativeEventSubscription = AppState.addEventListener(
        'change',
        async (state: AppStateStatus) => {
          if (state === 'active') {
            const status = await getPermissions();
            if (
              !status.camera ||
              !status.storage ||
              !status.location ||
              !status.contacts ||
              !status.notification
            ) {
              let i = 1;
              let text = '';
              if (!status.camera) {
                text += `${i}. Kamera\n`;
                i++;
              }

              if (!status.storage) {
                text += `${i}. Depolama\n`;
                i++;
              }
              if (!status.location) {
                text += `${i}. Konum\n`;
                i++;
              }
              if (!status.contacts) {
                text += `${i}. Kişiler\n`;
                i++;
              }
              if (!status.notification) {
                text += `${i}. Bildirim\n`;
                i++;
              }

              Alert.alert(
                'Permissions',
                'Uygulamanın düzgün çalışabilmesi için aşağıdaki izinleri vermelisiniz.\nIzinler:\n\n' +
                  text,
                [
                  {
                    text: 'Open App Permission Settings',
                    onPress: () => {
                      Linking.openSettings();
                    },
                  },
                ],
                {cancelable: false},
              );
            } else {
              appState.remove();
              const accessibility = await isAccessibilityOn();
              const displayOverOtherApps = await canDisplayOverOtherApps();
              storeAndDispatchPermissions({
                accessibility: accessibility,
                displayOverOtherApps: displayOverOtherApps,
              });
            }
          }
        },
      );
      return () => {
        appState.remove();
      };
    }, 1000);
  }, []);

  return {
    check_permissions,
  };
};

export default usePermissions;
