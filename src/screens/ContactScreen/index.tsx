/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppHeader from '../../components/Header/AppHeader';
import {
  useLazyGetUserContactsQuery,
  useLazyUpdateUserContactsQuery,
} from '../../store/api/userApi';

import {CONTACTS_CHANGE, getContactsStore} from '../../store/slices/contacts';
import {DB_CONTACTS_CHANGE} from '../../store/slices/dbContacts';
import {getLoginStore} from '../../store/slices/login';
import {getUserStore} from '../../store/slices/user';
import {
  organizeContact,
  contactsGetDiffForDatabase,
} from '../../utils/native-contact';
import Icon from 'react-native-vector-icons/FontAwesome';
import {medium, primary} from '../../constants/styles/colors';

const ContactScreen = ({navigation}: any) => {
  const [loading, setLoading] = useState(true);
  const loginStore = useSelector(getLoginStore);
  const userStore = useSelector(getUserStore);
  const contactsStore = useSelector(getContactsStore);
  const [get_trigger, get_contacts] = useLazyGetUserContactsQuery();
  const [update_trigger, update_contacts] = useLazyUpdateUserContactsQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      get_contacts.isUninitialized &&
      loginStore.userGuid !== null &&
      userStore.user_guid !== null &&
      !get_contacts.isSuccess &&
      typeof get_contacts.data === 'undefined'
    ) {
      get_trigger({
        user_guid: loginStore.userGuid,
      });
    }
  });

  useEffect(() => {
    if (contactsStore.length !== 0 && update_contacts.isUninitialized) {
      if (typeof update_contacts.data === 'undefined') {
        setTimeout(async () => {
          const {contactsToUpload} = await contactsGetDiffForDatabase(
            typeof get_contacts.data !== 'undefined' ? get_contacts.data : [],
            contactsStore,
          );
          if (contactsToUpload.length > 0) {
            // update_trigger({
            //   user_guid: loginStore.userGuid,
            //   contacts: contactsToUpload,
            // });
          } else {
            dispatch(DB_CONTACTS_CHANGE(get_contacts.data));
          }
        }, 10);
      }
    }
  }, [contactsStore, get_contacts]);

  useEffect(() => {
    if (
      typeof update_contacts.data !== 'undefined' &&
      update_contacts.isSuccess
    ) {
      dispatch(DB_CONTACTS_CHANGE(update_contacts.data));
      console.log(
        '%c Hepsi çekildi update edildi',
        'background: #222; color: #bada55',
        update_contacts.data,
      );
      setTimeout(async () => {}, 10);
    }
  }, [update_contacts.isSuccess]);

  useEffect(() => {
    if (
      typeof get_contacts.data !== 'undefined' &&
      get_contacts.isSuccess &&
      !get_contacts.isUninitialized &&
      !get_contacts.isLoading
    ) {
      setLoading(false);
      setTimeout(async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: 'Cool Photo App READ_CONTACTS Permission',
              message:
                'Cool Photo App needs access to your READ_CONTACTS ' +
                'so you can take awesome pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            if (userStore.country_info !== null) {
              const contacts = await organizeContact(
                loginStore.userGuid,
                userStore.country_info?.iso2,
                userStore.phone_number,
              );
              dispatch(CONTACTS_CHANGE(contacts.contacts));
            }
          } else {
            console.log('READ_CONTACTS permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }, 10);
    }
  }, [get_contacts.isSuccess]);

  useEffect(() => {
    if (update_contacts.isError) {
      console.log(
        '%c data',
        'background: #222; color: #bada55',
        update_contacts.error.data,
      );
      Alert.alert('Hata Var', 'OTP GONDERILEMIYOR', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [update_contacts.isError]);

  useEffect(() => {
    if (get_contacts.isError) {
      console.log(
        '%c data',
        'background: #222; color: #bada55',
        get_contacts.error.data,
      );
      Alert.alert('Hata Var', 'OTP GONDERILEMIYOR', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [get_contacts.isError]);
  const closePress = () => {
    navigation.navigate('CreateList');
  };
  const children = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buttonStyle}
          onPress={closePress}>
          <Icon
            name="plus"
            size={19}
            color={medium.color}
            style={styles.iconStyle}
          />
          <Text style={styles.buttonTextStyle}>Add New List</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <>
      <AppHeader children={children()} style={styles.appHeader} />
      {loading ? (
        <View style={[styles.loading]}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          persistentScrollbar={false}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          style={{padding: 16}}>
          <View style={{marginBottom: 300}}></View>
        </ScrollView>
      )}
    </>
  );
};

export default ContactScreen;
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 80,
    padding: 10,
  },
  appHeader: {height: 50},
  header: {
    backgroundColor: primary.color,
    height: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
  },
  iconStyle: {
    marginRight: 6,
  },
  buttonStyle: {
    borderRadius: 5,
    marginRight: 16,

    padding: 4,
    flexDirection: 'row',
  },
  buttonTextStyle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    fontWeight: '500',
    color: '#999fb4',
  },
});
