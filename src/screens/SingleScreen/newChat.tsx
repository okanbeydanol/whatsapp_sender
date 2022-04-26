import React from 'react';
import NewChatChooseListItem from '../../components/NewChat/NewChatListItem';

const NewChatScreen = ({navigation}: any) => {
  return (
    <>
      <NewChatChooseListItem navigation={navigation} />
    </>
  );
};

export default NewChatScreen;
