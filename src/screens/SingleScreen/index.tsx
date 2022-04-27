import React, {useEffect, useState} from 'react';

import {getData} from '../../utils/async-storage';
import {getLoginStore} from '../../store/slices/login';
import {useDispatch, useSelector} from 'react-redux';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Text, View} from 'react-native';

const SingleScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const loginStore = useSelector(getLoginStore);
  useEffect(() => {
    console.log('%c burası renderlandı', 'background: #222; color: #bada55');
    setTimeout(async () => {
      const getUserGuid = async () => {
        let userGuid;
        try {
          userGuid = await getData('s[userGuid]');
        } catch (e) {
          // Restoring token failed
        }
        return userGuid;
      };
      // await openOwnerDatabase();
      // const ownerData = await getRecordOwnerTable({
      //   ownerGuid: await getUserGuid(),
      // });
    }, 100);
  });
  const [state, setState] = useState(
    Array(20)
      .fill('')
      .map((_, i) => ({key: `${i}`, text: `item #${i}`})),
  );
  return (
    <>
      <SwipeListView
        data={state}
        renderItem={(data: any, rowMap: any) => (
          <View>
            <Text>I am {data.item.text} in a SwipeListView</Text>
          </View>
        )}
        renderHiddenItem={(data, rowMap) => (
          <View>
            <Text>Left</Text>
            <Text>Right</Text>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
      />
    </>
  );
};

export default SingleScreen;
