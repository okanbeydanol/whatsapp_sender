/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {getLoginStore} from '../../store/slices/login';
import {useDispatch, useSelector} from 'react-redux';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Alert, Text, View} from 'react-native';
import {getUserStore, USER_CHANGE} from '../../store/slices/user';
import moment from 'moment';
import {useGetUserQuery} from '../../store/api/userApi';
import usePacket from '../../hooks/usePacket';
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
  return <></>;
};

export default MainScreen;
