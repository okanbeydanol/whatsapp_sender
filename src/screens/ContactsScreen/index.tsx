/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppHeader from '../../components/Header/AppHeader';
import {Icon} from '@rneui/themed';
import {medium, primary, tertiary} from '../../constants/styles/colors';
import {batch, useSelector} from 'react-redux';

import {ContactTabScreenProps} from '../../navigation/types';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {getDBContactsStore} from '../../store/slices/dbContacts';
import {
  DatabaseContactPhonesResponse,
  DatabaseContactResponse,
} from '../../utils/native-contact';
import LoginChatInput from '../../components/login/LoginChatInput';
import ContactActionSheet from '../../components/ContactScreen/contactActionSheet';
import ActionSheet from 'react-native-actions-sheet';
const ContactsScreen = ({
  navigation,
}: ContactTabScreenProps<'ChooseContact'>) => {
  //Refs
  const actionSheetRef = React.useRef<ActionSheet>();
  //Selectors
  const dbContacts = useSelector(getDBContactsStore);

  //States
  const [searchText, setSearchText] = useState<string>('');
  const [stateContacts, setStateContacts] = useState<DatabaseContactResponse[]>(
    [],
  );
  const [selectedContact, setSelectedContact] =
    useState<DatabaseContactResponse>();

  const [firstLetters, setFirstLetters] = useState<
    {
      contact_id: string;
      firstLetter: string;
    }[]
  >([]);

  useEffect(() => {
    if (dbContacts.length > 0) {
      const letters = [...firstLetters];
      dbContacts.map((contact: DatabaseContactResponse) => {
        if (contact.full_name.length > 0) {
          const findIndex = letters.findIndex(
            (o: {contact_id: string; firstLetter: string}) =>
              o.firstLetter === contact.full_name.substring(0, 1).toUpperCase(),
          );
          if (findIndex === -1) {
            letters.push({
              contact_id: contact.contact_id,
              firstLetter: contact.full_name.substring(0, 1).toUpperCase(),
            });
          }
        }
      });
      const filter = dbContacts.filter((o: DatabaseContactResponse) =>
        o.full_name.toLowerCase().includes(searchText.toLowerCase()),
      );
      batch(() => {
        setStateContacts(filter);
        setFirstLetters(letters);
      });
    }
  }, [dbContacts]);

  const ContactActionSheetOnClose = () => {
    setSelectedContact(undefined);
  };
  useEffect(() => {
    selectedContact && actionSheetRef.current?.show();
  }, [selectedContact]);

  const contactPress = (contact: DatabaseContactResponse) => {
    setSelectedContact(contact);
  };

  const searchTextChange = (text: string) => {
    const filter = dbContacts.filter((o: DatabaseContactResponse) =>
      o.full_name.toLowerCase().includes(text.toLowerCase()),
    );
    batch(() => {
      setStateContacts(filter);
      setSearchText(text);
    });
  };
  const closePress = () => {
    navigation.pop();
  };
  //FlatList Render Item
  const renderItem = ({item}: {item: DatabaseContactResponse}) => (
    <>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        {firstLetters.findIndex(
          (o: {contact_id: string; firstLetter: string}) =>
            +o.contact_id === +item.contact_id,
        ) !== -1 ? (
          <View
            style={{
              marginTop: 2,
              width: 36,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text>{item.full_name.substring(0, 1).toUpperCase()}</Text>
          </View>
        ) : (
          <View style={{marginRight: 36}}></View>
        )}
        <TouchableOpacity
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: 40,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => {
            contactPress(item);
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="people" style={{marginRight: 12}} />
            <Text>
              {Dimensions.get('window').width - 338 < item.full_name.length
                ? item.full_name.substring(
                    0,
                    Dimensions.get('window').width - 338,
                  ) + '...'
                : item.full_name}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 60,
            }}>
            <Icon
              name="cellphone-check"
              size={22}
              type="material-community"
              color={medium.color}
            />
            <Text>
              {
                item.contact_phones.filter(
                  (o: DatabaseContactPhonesResponse) => +o.active === 1,
                ).length
              }
            </Text>
            <Icon
              name="cellphone-remove"
              size={22}
              type="material-community"
              color={medium.color}
            />
            <Text>
              {
                item.contact_phones.filter(
                  (o: DatabaseContactPhonesResponse) => +o.active === 0,
                ).length
              }
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
  return (
    <>
      <ContactActionSheet
        innerRef={actionSheetRef}
        onClose={ContactActionSheetOnClose}
        contact={selectedContact}
      />
      <AppHeader style={styles.appHeader} />
      <View style={styles.header}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: primary.color,
          }}>
          <TouchableOpacity onPress={closePress}>
            <Icon
              name="close"
              size={22}
              color={medium.color}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: Dimensions.get('window').width / 2 - 90,
              fontFamily: 'Montserrat-Medium',
              fontSize: 16,
              fontWeight: '500',
              color: tertiary.color,
            }}>
            Kişilerim
          </Text>
        </View>
        <LoginChatInput
          value={searchText}
          backgroundColor={primary.color}
          onChangeText={searchTextChange}
          styleSearchImage={{top: 2}}
        />
      </View>
      <KeyboardAwareFlatList
        keyboardOpeningTime={0}
        extraScrollHeight={0}
        extraHeight={0}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}
        enableAutomaticScroll={false}
        enableResetScrollToCoords={false}
        data={stateContacts}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
      />
    </>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  appHeaderText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    fontWeight: '500',
    color: tertiary.color,
  },
  scrollView: {},
  addIconStyle: {
    marginRight: 16,
    marginTop: 4,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 80,
    padding: 10,
  },
  header: {
    backgroundColor: primary.color,
    height: 90,
    justifyContent: 'center',
  },
  appHeader: {
    height: 0,
  },
  iconStyle: {
    marginLeft: 16,
    marginRight: 16,
  },
});
