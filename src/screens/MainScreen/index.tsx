/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {getLoginStore} from '../../store/slices/login';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, Text, View} from 'react-native';
import {getUserStore, USER_CHANGE} from '../../store/slices/user';
import moment from 'moment';
import {useGetUserQuery} from '../../store/api/userApi';
import usePacket from '../../hooks/usePacket';
import {primary, tertiary} from '../../constants/styles/colors';
import ActionButton from 'react-native-action-button-warnings-fixed';

const MainScreen = () => {
  //Dispatch
  const dispatch = useDispatch();

  //Selectors
  const loginStore = useSelector(getLoginStore);
  const userStore = useSelector(getUserStore);

  //Hooks
  const usePacketHook = usePacket();

  //Queries
  const {data, isError, isSuccess} = useGetUserQuery({
    user_guid: loginStore.userGuid,
  });

  //UseEffects

  //Dispatch user change
  useEffect(() => {
    if (typeof data !== 'undefined' && isSuccess) {
      dispatch(USER_CHANGE(data));
    }
  }, [isSuccess]);

  //Query user change Error
  useEffect(() => {
    if (isError) {
      Alert.alert('Hata!', 'OTP GÖNDERELEMİYOR!', [
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
