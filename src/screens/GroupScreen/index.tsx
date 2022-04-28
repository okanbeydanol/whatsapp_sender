/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {PermissionsAndroid, ScrollView, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppFlag from '../../components/Elements/AppFlag';
import AppHeader from '../../components/Header/AppHeader';

import {CONTACTS_CHANGE, getContactsStore} from '../../store/slices/contacts';
import {getLoginStore} from '../../store/slices/login';
import {getUserStore} from '../../store/slices/user';
import {organizeContact} from '../../utils/native-contact';

const GroupScreen = ({navigation}: any) => {
  const loginStore = useSelector(getLoginStore);
  const userStore = useSelector(getUserStore);
  const contactsStore = useSelector(getContactsStore);
  const dispatch = useDispatch();
  useEffect(() => {
    if (contactsStore.length === 0) {
      if (loginStore.userGuid !== null && userStore.user_guid !== null) {
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
    }
  }, [contactsStore.length]);

  return (
    <>
      <AppHeader />

      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        style={{padding: 16}}>
        <View style={{marginBottom: 300}}>
          {contactsStore.map((key: any, index: any) => (
            <React.Fragment key={'Fragment' + index}>
              <Text style={{marginTop: 12}}>{key.fullName}</Text>
              {key.contacts.map((key2: any, index2: any) => (
                <React.Fragment key={'Fragment' + -index2}>
                  <Text> - {key2.digit} </Text>
                  <AppFlag value={key2.countryCode} />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default GroupScreen;
