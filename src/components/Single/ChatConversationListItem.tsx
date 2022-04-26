import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import {listen_slice_user_retrive_conversations} from '../../store/slices/socket/socket-brain';
import AppHeader from '../Header/AppHeader';
import SingleHeader from '../Header/SingleHeader';
import SingleListItem from './ListItem';

const ChatConversationListItem = ({navigation}: any) => {
  let retriveConversations = useSelector(
    listen_slice_user_retrive_conversations,
  );
  console.log(
    '%c  retriveConversations',
    'background: #222; color: #bada55',
    retriveConversations,
  );

  return (
    <>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}>
        <>
          <AppHeader style={styles.appHeader} />
          <SingleHeader navigation={navigation} />
        </>
        <>
          {retriveConversations.map((key: any, index: any) => (
            <React.Fragment key={'Fragment' + index}>
              <SingleListItem
                item={key}
                friendGuid={key.friendGuid}
                nounGuid={key.nounGuid}
                navigation={navigation}
              />
            </React.Fragment>
          ))}
        </>
      </ScrollView>
    </>
  );
};

export default ChatConversationListItem;

const styles = StyleSheet.create({
  appHeader: {
    height: 10,
  },
});
