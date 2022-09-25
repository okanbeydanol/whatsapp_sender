/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';
import {Alert, Linking} from 'react-native';
import {getVersion} from 'react-native-device-info';
import {BASE_URL} from '../constants';
import {useLazyGetAppVersionQuery} from '../store/api/userApi';
const useAppUpdate = () => {
  const [app_version_trigger, app_version] = useLazyGetAppVersionQuery();
  console.log('%c appversion', 'background: #222; color: #bada55', app_version);
  const check_app_update = () => {
    if (
      typeof app_version.data === 'undefined' &&
      !app_version.isSuccess &&
      !app_version.isFetching &&
      !app_version.isError
    ) {
      app_version_trigger({});
    }
  };

  //Get user error
  useEffect(() => {
    if (app_version.isError && app_version.error) {
      console.log(
        '%c  error2',
        'background: #222; color: #bada55',
        app_version.error,
      );
      Alert.alert('Hata Var', 'APP VERSION çekilemiyor!', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [app_version.isError]);

  useEffect(() => {
    if (
      typeof app_version.data !== 'undefined' &&
      app_version.isSuccess &&
      !app_version.isFetching
    ) {
      const version = getVersion();
      const result = compareVersion(version, app_version.data);
      if (result === -1) {
        Alert.alert(
          'Update Available',
          'Uygulamanın yeni bir sürümü var.',
          [
            {
              text: 'Update',
              onPress: () => {
                Linking.openURL(BASE_URL + 'app-release.apk');
              },
            },
          ],
          {cancelable: false},
        );
      }
      console.log('%c result', 'background: #222; color: #bada55', result);
    }
  }, [app_version.isFetching, app_version.isSuccess]);

  const compareVersion = (a: string, b: string): number => {
    const aComponents = a.split('.');
    const bComponents = b.split('.');

    const len = Math.min(aComponents.length, bComponents.length);

    for (let i = 0; i < len; i++) {
      // A bigger than B
      if (parseInt(aComponents[i]) > parseInt(bComponents[i])) {
        return 1;
      }

      // B bigger than A
      if (parseInt(aComponents[i]) < parseInt(bComponents[i])) {
        return -1;
      }
    }

    if (aComponents.length > bComponents.length) {
      return 1;
    }

    if (aComponents.length < bComponents.length) {
      return -1;
    }

    return 0;
  };

  return {
    check_app_update,
  };
};

export default useAppUpdate;
