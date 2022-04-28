import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import AppHeader from '../../components/Header/AppHeader';
import {LoginType, LOGOUT} from '../../store/slices/login';
import {removeData} from '../../utils/async-storage';

const SettingsScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  return (
    <>
      <AppHeader />
      <View>
        <TouchableOpacity
          style={{width: 100, height: 100, backgroundColor: '#000000'}}
          onPress={() => {
            removeData('s[userGuid]');
            dispatch(
              LOGOUT({
                type: LoginType.LOGOUT,
              }),
            );
          }}
          activeOpacity={0.7}
        />
      </View>
    </>
  );
};

export default SettingsScreen;
