/* eslint-disable react-hooks/exhaustive-deps */
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ActionSheet from 'react-native-actions-sheet';
import {useLazyUserContactPhoneStatusChangeQuery} from '../../store/api/userApi';
import {
  DatabaseContactPhonesResponse,
  DatabaseContactResponse,
} from '../../utils/native-contact';
import AppFlag from '../Elements/AppFlag';
import Switch from './Switch';
import {batch, useDispatch, useSelector} from 'react-redux';
import {getLoginStore} from '../../store/slices/login';
import {DB_CONTACTS_PHONE_STATUS_CHANGE} from '../../store/slices/dbContacts';
import {primary} from '../../constants/styles/colors';

const ContactActionSheet = ({
  contact,
  id = 'action-sheet',
  innerRef,
  onClose,
}: any) => {
  //Dispatch
  const dispatch = useDispatch();
  const loginStore = useSelector(getLoginStore);
  //States
  const [selectedContact, setSelectedContact] =
    useState<DatabaseContactResponse>();
  //Queries
  const [change_contact_phone_status_trigger, change_contact_phone_status] =
    useLazyUserContactPhoneStatusChangeQuery();

  useEffect(() => {
    setSelectedContact(contact);
  }, [contact]);

  //UseEffect
  useEffect(() => {
    if (
      typeof change_contact_phone_status.data !== 'undefined' &&
      change_contact_phone_status.isSuccess &&
      !change_contact_phone_status.isFetching
    ) {
      batch(() => {
        dispatch(
          DB_CONTACTS_PHONE_STATUS_CHANGE({
            contact_id:
              selectedContact && selectedContact.contact_id
                ? selectedContact.contact_id
                : '',
            contact_phone_guid: change_contact_phone_status.originalArgs
              .contact_phone_guid
              ? change_contact_phone_status.originalArgs.contact_phone_guid
              : '',
          }),
        );
      });
    }
  }, [
    change_contact_phone_status.isFetching,
    change_contact_phone_status.isSuccess,
  ]);

  const switchChange = (data: {key: string; status: boolean}) => {
    if (typeof selectedContact !== 'undefined') {
      const findIndex = selectedContact?.contact_phones.findIndex(
        (o: {contact_phone_guid: string}) => o.contact_phone_guid === data.key,
      );
      const selectC = {...selectedContact};

      const contact_phone = {
        ...selectC.contact_phones[findIndex],
        active: data.status ? 1 : 0,
      };

      const contact_phones = [...selectC.contact_phones];
      contact_phones[findIndex] = {...contact_phone};

      selectC.contact_phones = [...contact_phones];
      change_contact_phone_status_trigger({
        user_guid: loginStore.userGuid,
        contact_id: selectedContact?.contact_id,
        contact_phone_guid: data.key,
      });
    }
  };
  return (
    <ActionSheet
      onClose={() => {
        onClose();
      }}
      containerStyle={styles.containerStyle}
      id={id}
      ref={innerRef}>
      <View>
        {selectedContact &&
          selectedContact.contact_phones.length > 0 &&
          selectedContact.contact_phones.map(
            (key: DatabaseContactPhonesResponse, index: number) => (
              <React.Fragment key={'Fragment' + index}>
                <View
                  style={{
                    height: 60,
                    marginLeft: 16,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <AppFlag
                      value={key.country_code}
                      style={{width: 28, height: 18}}
                    />
                    <Text style={{marginLeft: 16}}>{key.digit}</Text>
                  </View>
                  <View
                    style={{
                      marginRight: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Switch
                      state={{
                        status: +key.active === 1 ? true : false,
                        key: key.contact_phone_guid,
                        switchChange,
                        text1: 'Pasif',
                        text2: 'Aktif',
                        backgroundColorSwitch: primary.color,
                        borderColorSwitch: primary.color,
                        height: 22,
                        width: 100,
                        marginLeft: 20,
                      }}
                    />
                    {/* <Switchr
                      value={() => switchValue(key)}
                      onValueChange={() => switchValueChange(key)}
                    /> */}
                  </View>
                </View>
              </React.Fragment>
            ),
          )}
      </View>
    </ActionSheet>
  );
};

export default ContactActionSheet;

const styles = StyleSheet.create({
  textStyle: {
    color: '#000000',
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  buttonStyle: {
    width: Dimensions.get('window').width,
    borderRadius: 0,
    height: 60,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  containerStyle: {
    flex: 1,
    marginBottom: 300,
  },
});
