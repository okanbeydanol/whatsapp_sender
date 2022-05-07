/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {getLoginStore} from '../../store/slices/login';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getUserStore, USER_CHANGE} from '../../store/slices/user';
import moment from 'moment';
import {useGetUserQuery} from '../../store/api/userApi';
import usePacket from '../../hooks/usePacket';
import {medium, primary, tertiary} from '../../constants/styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button-warnings-fixed';

const MainScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const loginStore = useSelector(getLoginStore);
  const usePacketHook = usePacket();
  const userStore = useSelector(getUserStore);
  const {data, isError, isSuccess, error} = useGetUserQuery({
    user_guid: loginStore.userGuid,
  });
  useEffect(() => {
    if (typeof data !== 'undefined' && isSuccess) {
      console.log('%c data', 'background: #222; color: #bada55', data);
      dispatch(USER_CHANGE(data));
    }
  }, [isSuccess]);

  useEffect(() => {
    console.log('%c error', 'background: #222; color: #bada55', error);
    if (isError) {
      Alert.alert('Hata Var', 'OTP GONDERILEMIYOR', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [isError]);

  useEffect(() => {
    if (userStore.user_guid !== null) {
      const date = moment(userStore.packet_end_time);
      const now = moment();
      const diff = date.diff(now, 'seconds'); // 1
      if (+diff > 0) {
        const interval = usePacketHook.check_packet_status();
        return () => {
          clearInterval(interval);
        };
      }
    }
  }, [userStore]);

  const [state, setState] = useState(
    Array(20)
      .fill('')
      .map((_, i) => ({key: `${i}`, text: `item #${i}`})),
  );
  const addNewTimer = () => {};
  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          backgroundColor: primary.color,
          height: 40,
        }}>
        <View>
          <Text
            style={{
              fontFamily: 'Montserrat-Medium',
              fontSize: 16,
              fontWeight: '500',
              color: tertiary.color,
            }}>
            Timers
          </Text>
        </View>
      </View>
      <View style={{flex: 1, backgroundColor: '#f3f3f3'}}>
        <ActionButton buttonColor={primary.color} />
      </View>
    </>
  );
};

export default MainScreen;
const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 80,
    padding: 10,
  },
  appHeader: {height: 50},
  addNewList: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  iconStyle: {
    marginRight: 6,
  },
  buttonStyle: {
    borderRadius: 5,
    marginRight: 16,

    padding: 4,
    flexDirection: 'row',
  },
  buttonTextStyle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    fontWeight: '500',
    color: '#999fb4',
  },
});
