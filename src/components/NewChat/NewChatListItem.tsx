/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AppHeader from '../Header/AppHeader';
import NewChatHeader from '../Header/NewChatHeader';
import NewChatListItem from './ListItem';
import Group from '../../assets/images/tabs/group.svg';
import {secondary} from '../../constants/styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import useSocketContacts from '../../hooks/useSocketContacts';
import {organizeContact} from '../../utils/native-contact';
import {storeData} from '../../utils/async-storage';
import {getLoginStore} from '../../store/slices/login';

const NewChatChooseListItem = ({navigation}: any) => {
  const loginStore = useSelector(getLoginStore);
  // const contactsUpdateStore = useSelector(getDBContactsUpdate);
  // const socketBrain = useSocketContacts();
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   setTimeout(async () => {
  //     const Contacts = await organizeContact(loginStore.userGuid);
  //     let contacts = [];
  //     // contacts = await socketBrain.get_contacts_DB_socket(Contacts.contacs);
  //     // dispatch(DB_CONTACT_UPDATE({contacts: contacts.contacts}));
  //     storeData('s[contactIsSync]', 1);
  //   }, 10);
  // }, [dispatch]);
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
          <NewChatHeader navigation={navigation} />
        </>
        <>
          <TouchableOpacity activeOpacity={0.7}>
            <View style={styles.newGroupButton}>
              <Group style={styles.groupIcon} />
              <Text style={styles.groupText}>Yeni grup oluştur</Text>
            </View>
          </TouchableOpacity>
        </>
        <>
          {/* {contactsUpdateStore.contacts.length > 0 ? (
            contactsUpdateStore.contacts.map((key: any, index: any) => (
              <React.Fragment key={'Fragment' + index}>
                <NewChatListItem navigation={navigation} item={key} />
              </React.Fragment>
            ))
          ) : (
            <Text>Yokkkkkkkk</Text>
          )} */}
        </>
      </ScrollView>
    </>
  );
};

export default NewChatChooseListItem;

const styles = StyleSheet.create({
  appHeader: {
    height: 10,
  },
  groupIcon: {
    marginRight: 16,
  },
  groupText: {
    color: secondary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    fontWeight: '600',
  },
  newGroupButton: {
    height: 40,
    width: Dimensions.get('window').width - 34,
    marginLeft: 17,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
