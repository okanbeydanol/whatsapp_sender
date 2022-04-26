import React, {useEffect} from 'react';

import ChatConversationListItem from '../../components/Single/ChatConversationListItem';
import {getData} from '../../utils/async-storage';
import {getLoginStore} from '../../store/slices/login';
import {useDispatch, useSelector} from 'react-redux';
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
  return (
    <>
      <ChatConversationListItem navigation={navigation} />
    </>
  );
};

export default SingleScreen;
