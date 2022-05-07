/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  useGetUserQuery,
  useLazyGetUserContactsQuery,
  useLazyUpdateUserContactsQuery,
} from '../../store/api/userApi';

import {CONTACTS_CHANGE, getContactsStore} from '../../store/slices/contacts';
import {DB_CONTACTS_CHANGE} from '../../store/slices/dbContacts';
import {getLoginStore} from '../../store/slices/login';
import {getUserStore, USER_CHANGE} from '../../store/slices/user';
import {
  organizeContact,
  contactsGetDiffForDatabase,
} from '../../utils/native-contact';
import {
  badge,
  green,
  medium,
  primary,
  secondary,
  tertiary,
} from '../../constants/styles/colors';
import ActionButton from 'react-native-action-button-warnings-fixed';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {USER_LISTS} from '../../constants/typescript/user';
import {Card, Icon} from '@rneui/themed';
import moment from 'moment';
import usePacket from '../../hooks/usePacket';

const ContactScreen = ({navigation}: any) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const loginStore = useSelector(getLoginStore);
  const userStore = useSelector(getUserStore);
  const contactsStore = useSelector(getContactsStore);
  const usePacketHook = usePacket();
  const {data, isError, isSuccess, error} = useGetUserQuery({
    user_guid: loginStore.userGuid,
  });
  const [get_trigger, get_contacts] = useLazyGetUserContactsQuery();
  const [update_trigger, update_contacts] = useLazyUpdateUserContactsQuery();
  const openCreateList = () => {
    navigation.navigate('CreateList', {selectedContacts: []});
  };
  useEffect(() => {
    if (typeof data !== 'undefined' && isSuccess) {
      dispatch(USER_CHANGE(data));
    }
  }, [isSuccess]);

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
    if (
      contactsStore.length !== 0 &&
      update_contacts.isUninitialized &&
      userStore.user_guid !== null
    ) {
      if (typeof update_contacts.data === 'undefined') {
        setTimeout(async () => {
          const {contactsToUpload} = await contactsGetDiffForDatabase(
            typeof get_contacts.data !== 'undefined' ? get_contacts.data : [],
            contactsStore,
          );
          if (contactsToUpload.length > 0) {
            update_trigger({
              user_guid: loginStore.userGuid,
              contacts: contactsToUpload,
            });
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
      update_contacts.isSuccess &&
      userStore.user_guid !== null
    ) {
      dispatch(DB_CONTACTS_CHANGE(update_contacts.data));
    }
  }, [update_contacts.isSuccess]);

  useEffect(() => {
    if (
      typeof get_contacts.data !== 'undefined' &&
      get_contacts.isSuccess &&
      !get_contacts.isUninitialized &&
      !get_contacts.isLoading &&
      userStore.user_guid !== null
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
        '%c update_contacts.error',
        'background: #222; color: #bada55',
        update_contacts.error,
      );
      Alert.alert('Hata Var', 'OTP GONDERILEMIYOR', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [update_contacts.isError]);

  useEffect(() => {
    if (get_contacts.isError) {
      console.log(
        '%c get_contacts.error',
        'background: #222; color: #bada55',
        update_contacts.error,
      );
      Alert.alert('Hata Var', 'OTP GONDERILEMIYOR', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [get_contacts.isError]);

  useEffect(() => {
    console.log('%c error.error', 'background: #222; color: #bada55', error);
    if (isError && error) {
      Alert.alert('Hata Var', 'OTP GONDERILEMIYOR', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [isError]);

  return (
    <>
      <View style={styles.appHeader}>
        <View>
          <Text style={styles.appHeaderText}>Lists</Text>
        </View>
      </View>
      {loading ? (
        <View style={[styles.loading]}>
          <ActivityIndicator />
        </View>
      ) : (
        <KeyboardAwareScrollView
          keyboardOpeningTime={0}
          extraScrollHeight={0}
          extraHeight={0}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
          persistentScrollbar={false}
          contentContainerStyle={[styles.scrollView]}
          enableAutomaticScroll={false}
          enableResetScrollToCoords={false}>
          {userStore.lists &&
            userStore.lists.map((key: USER_LISTS, index: any) => (
              <React.Fragment key={'Fragment' + index}>
                <Card containerStyle={styles.cardContainer}>
                  <Card.Title style={styles.cardTitle}>{key.title}</Card.Title>
                  <Card.Divider />
                  <View style={styles.cardContainerWrapper}>
                    <View style={styles.cardWrapper}>
                      <Text style={styles.title}>Message Template Title</Text>
                      <Text style={styles.context}>{key.template.title}</Text>
                    </View>
                    <View>
                      <Text style={styles.title}>Selected User Count</Text>
                      <Text style={styles.context}>
                        {key.contacts.length} User Selected
                      </Text>
                    </View>
                  </View>
                  <View style={styles.editWrapper}>
                    <View>
                      <Text style={styles.title}>Message Type</Text>
                      <Text style={styles.context}>{key.template.type}</Text>
                    </View>
                    <View style={styles.editContainer}>
                      <Icon
                        name="trash"
                        size={28}
                        color={badge.color}
                        type="ionicon"
                        style={styles.addIconStyle}
                      />
                      <Icon
                        name="pencil"
                        size={28}
                        type="ionicon"
                        color={medium.color}
                        style={styles.addIconStyle}
                      />

                      <Icon
                        name="play"
                        type="ionicon"
                        size={34}
                        color={green.color}
                        style={styles.addIconStyle}
                      />
                    </View>
                  </View>
                </Card>
              </React.Fragment>
            ))}
        </KeyboardAwareScrollView>
      )}
      <View style={styles.openCreateList}>
        <ActionButton onPress={openCreateList} buttonColor={primary.color} />
      </View>
    </>
  );
};

export default ContactScreen;
const styles = StyleSheet.create({
  openCreateList: {
    width: 1,
    height: 1,
    position: 'absolute',
    bottom: 112,
    right: 0,
  },
  editWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  context: {
    color: medium.color,
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    fontWeight: '500',
  },
  cardWrapper: {marginRight: 32},
  cardContainer: {marginTop: 15},
  cardContainerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    color: secondary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    fontWeight: '500',
  },
  appHeaderText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    fontWeight: '500',
    color: tertiary.color,
  },
  scrollView: {},
  addIconStyle: {
    marginRight: 16,
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 80,
    padding: 10,
  },
  appHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: primary.color,
    height: 40,
  },
  addNewList: {
    position: 'absolute',
    right: 16,
    top: 20,
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
