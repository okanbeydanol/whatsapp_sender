/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import {useEffect} from 'react';
import {Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useLazyCheckUserPacketQuery} from '../store/api/userApi';
import {getUserStore, USER_CHANGE} from '../store/slices/user';

const usePacket = () => {
  const userStore = useSelector(getUserStore);
  const dispatch = useDispatch();
  const [trigger, {data, isError, isSuccess, error}] =
    useLazyCheckUserPacketQuery();

  useEffect(() => {
    if (typeof data !== 'undefined' && isSuccess) {
      console.log('%c data', 'background: #222; color: #bada55', data);
      if (data.user_guid !== null) {
        dispatch(USER_CHANGE(data));
      }
    }
  }, [data, isSuccess]);
  useEffect(() => {
    console.log('%c error', 'background: #222; color: #bada55', error);
    if (isError) {
      Alert.alert('Hata Var', 'OTP GONDERILEMIYOR', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [isError]);

  const check_packet_status = (
    callback?: (leftTime: number) => void,
  ): NodeJS.Timer => {
    const date = moment(userStore.packet_end_time);
    const now = moment();
    const diff = date.diff(now, 'seconds'); // 1
    let leftTime = diff;
    const interval: NodeJS.Timer = setInterval(() => {
      if (leftTime <= 0) {
        console.log('%c burda aq', 'background: #222; color: #bada55');
        //Premium bitti Regular Kullanıcı Yap
        clearInterval(interval);
        console.log('%c Interval Bitti', 'background: #222; color: #bada55');
        // trigger({
        //   type: 'FINISH',
        //   user_guid: userStore.user_guid,
        // });
      }
      callback && callback(leftTime);

      leftTime--;
    }, 1000);
    return interval;
  };
  return {
    check_packet_status,
  };
};

export default usePacket;
