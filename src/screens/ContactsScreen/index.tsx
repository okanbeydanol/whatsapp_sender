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
import {getDBContactsStore} from '../../store/slices/dbContacts';
import {DatabaseContactResponse} from '../../utils/native-contact';
import LoginChatInput from '../../components/login/LoginChatInput';
import ContactActionSheet from '../../components/ContactScreen/contactActionSheet';
import ActionSheet from 'react-native-actions-sheet';
import ContactsRenderer from './ContactsRenderer';
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
    {contact_id: string; firstLetter: string}[]
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
  const isRefreshing = (item: DatabaseContactResponse) => {
    console.log('%c item', 'background: #222; color: #bada55', item);
  };

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
      {/* <KeyboardAwareFlatList
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
         removeClippedSubviews={true} // Unmount components when outside of window
        initialNumToRender={2} // Reduce initial render amount
        maxToRenderPerBatch={1} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
      /> */}
      <ContactsRenderer
        dataAll={stateContacts}
        contactPress={contactPress}
        isRefreshing={(item: DatabaseContactResponse) => isRefreshing(item)}
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
