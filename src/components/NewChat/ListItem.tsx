import React from 'react';
import {primary, secondary} from '../../constants/styles/colors';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ListItem} from '@rneui/themed';
import profileImage from '../../assets/images/blank-profile.png';
import useSocketContacts from '../../hooks/useSocketContacts';
import {getLoginStore} from '../../store/slices/login';
import {useSelector} from 'react-redux';
//Burası Main Function
const NewChatListItem = ({item, navigation}: any) => {
  const socketBrain = useSocketContacts();
  const loginStore = useSelector(getLoginStore);

  const goChat = async () => {
    const nounInfo = await socketBrain.check_or_create_contact(
      item.contactGuid,
      loginStore.userGuid,
    );
    console.log('%c nounInfo', 'background: #222; color: #bada55', nounInfo);
    navigation.navigate('ChatScreen', {
      nounGuid: item.contactGuid,
      friendGuid: nounInfo.contact.friendGuid,
    });
  };
  return (
    <>
      <TouchableOpacity activeOpacity={0.7} onPress={goChat}>
        <ListItem>
          <Image
            style={styles.avatar}
            source={
              item !== null && item.image === null
                ? profileImage
                : {uri: 'data:image/jpeg;base64,' + item.image}
            }
          />

          <ListItem.Content style={styles.listItemContent}>
            <Text style={styles.name}>{item.fullName}</Text>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    </>
  );
};
export default NewChatListItem;

const styles = StyleSheet.create({
  listItemContent: {
    flex: 1,
    height: 30,
  },
  avatar: {
    width: 35,
    height: 35,
  },
  name: {
    textAlign: 'left',
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    color: secondary.color,
    fontFamily: 'Montserrat-Medium',
    fontSize: 9,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 6,
  },
});
