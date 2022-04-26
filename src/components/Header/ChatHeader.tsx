import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {primary} from '../../constants/styles/colors';
import Close from '../../assets/images/icons/close.svg';
import ChatHeaderListItem from '../Chat/ChatHeaderListItem';

const ChatHeader = ({navigation, style, nounGuid, friendGuid}: any) => {
  return (
    <View style={[styles.headerStyle, style]}>
      <View style={styles.headerContainer}>
        <ChatHeaderListItem nounGuid={nounGuid} friendGuid={friendGuid} />
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={() => {
            navigation.pop();
          }}
          activeOpacity={0.7}>
          <Close style={styles.editIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  headerStyle: {
    flexDirection: 'column',
    backgroundColor: primary.color,
    height: 56,
  },
  headerText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginLeft: 24,
  },
  editIcon: {
    marginRight: 24,
  },
  closeContainer: {
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
});
