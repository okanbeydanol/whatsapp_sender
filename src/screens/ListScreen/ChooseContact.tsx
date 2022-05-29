/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppHeader from '../../components/Header/AppHeader';
import {CheckBox, Icon} from '@rneui/themed';
import {medium, primary, secondary} from '../../constants/styles/colors';
import {batch, useDispatch, useSelector} from 'react-redux';
import {
  DB_CONTACTS_CHANGE_ADD_SELECTED,
  DB_CONTACTS_CHANGE_REMOVE_SELECTED,
  DB_CONTACTS_CHANGE_UPDATE,
  getDBContactsStore,
} from '../../store/slices/dbContacts';
import {ContactTabScreenProps} from '../../navigation/types';
import LoginChatInput from '../../components/login/LoginChatInput';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {
  DatabaseContactPhonesResponse,
  DatabaseContactResponse,
} from '../../utils/native-contact';

const ChooseContact = ({
  navigation,
  route,
}: ContactTabScreenProps<'ChooseContact'>) => {
  //Dispatch
  const dispatch = useDispatch();
  //Route Params
  const {selectedContacts, type} = route.params;

  //Selectors
  const contacts = useSelector(getDBContactsStore);

  //States
  const [stateContacts, setStateContacts] = useState<DatabaseContactResponse[]>(
    [],
  );

  const [selectContacts, setSelectContacts] =
    useState<DatabaseContactResponse[]>(selectedContacts);
  const [currentContact, setCurrentContact] =
    useState<DatabaseContactResponse>();
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filter = contacts.filter((o: DatabaseContactResponse) =>
      o.full_name.toLowerCase().includes(searchText.toLowerCase()),
    );
    setStateContacts(filter);
  }, [contacts]);

  useEffect(() => {
    const count = contacts.filter(c => c.checked).length;
    if (count !== selectContacts.length) {
      setStateContacts(contacts);
      dispatch(DB_CONTACTS_CHANGE_ADD_SELECTED(selectContacts));
    }
  }, [selectContacts]);

  useEffect(() => {
    if (loading && currentContact) {
      const findIndex = selectContacts.findIndex(
        (o: DatabaseContactResponse) =>
          +o.contact_id === +currentContact?.contact_id,
      );
      batch(() => {
        if (findIndex !== -1) {
          const selecteds = [...selectContacts];
          selecteds.splice(findIndex, 1);
          setSelectContacts(selecteds);
        } else {
          const selecteds = [...selectContacts];
          selecteds.push(currentContact);
          setSelectContacts(selecteds);
        }

        dispatch(DB_CONTACTS_CHANGE_UPDATE(+currentContact.contact_id));
        setLoading(false);
      });
    }
  }, [loading]);

  //Functions
  //Close Page
  const closePress = () => {
    navigation.navigate({
      name: type === 'create' ? 'CreateList' : 'EditList',
      params: {selectedContacts: selectedContacts},
      merge: true,
    });
  };

  //Open type Page with selected contacts
  const savePress = () => {
    batch(() => {
      dispatch(DB_CONTACTS_CHANGE_REMOVE_SELECTED(selectContacts));
      navigation.navigate({
        name: type === 'create' ? 'CreateList' : 'EditList',
        params: {selectedContacts: selectContacts},
        merge: true,
      });
    });
  };
  const cleanCheckbox = () => {
    batch(() => {
      dispatch(DB_CONTACTS_CHANGE_REMOVE_SELECTED(selectContacts));
      setSelectContacts([]);
      setSearchText('');
    });
  };

  //Emit Selected Contacts
  const emitChanges = (data: DatabaseContactResponse) => {
    batch(() => {
      setCurrentContact(data);
      setLoading(true);
    });
  };

  //Search Contacts
  const onChangeText = (data: string) => {
    const filter = contacts.filter((o: DatabaseContactResponse) =>
      o.full_name.toLowerCase().includes(data.toLowerCase()),
    );
    if (filter.length > 0) {
      batch(() => {
        setStateContacts(filter);
        setSearchText(data);
      });
    }
  };
  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });
  const renderItem = ({item}: {item: DatabaseContactResponse}) => (
    <View style={styles.tabContentContainer}>
      <CheckBox
        title={
          Dimensions.get('window').width - 341 < item.full_name.length
            ? item.full_name.substring(
                0,
                Dimensions.get('window').width - 341,
              ) + '...'
            : item.full_name
        }
        checkedIcon="checkbox-outline"
        uncheckedIcon="square-outline"
        checked={item.checked ? item.checked : false}
        size={20}
        iconType="material-community"
        onPress={() => emitChanges(item)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
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
      {loading &&
        currentContact &&
        +currentContact.contact_id === +item.contact_id && (
          <>
            <ActivityIndicator
              color={secondary.color}
              style={styles.loading2}
            />
          </>
        )}
    </View>
  );

  return (
    <>
      <AppHeader style={styles.appHeader} />
      <View style={styles.header}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
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
          <TouchableOpacity onPress={cleanCheckbox}>
            <Icon
              name="refresh"
              size={22}
              color={medium.color}
              type="ionicon"
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={savePress}>
            <Icon
              name="save"
              size={22}
              color={medium.color}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>
        <LoginChatInput
          value={searchText}
          backgroundColor={primary.color}
          onChangeText={onChangeText}
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
        removeClippedSubviews={true} // Unmount components when outside of window
        initialNumToRender={2} // Reduce initial render amount
        maxToRenderPerBatch={1} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
        renderItem={renderItem}
        keyExtractor={(item: DatabaseContactResponse) => item.contact_id}
      />
    </>
  );
};

export default ChooseContact;

const styles = StyleSheet.create({
  scrollView: {
    paddingRight: 15,
    paddingLeft: 15,
  },
  tabContentContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: secondary.color,
    borderStyle: 'dotted',
    zIndex: 999999,
  },
  addIconStyle: {
    marginRight: 16,
  },
  checkboxContainer: {
    padding: 0,
    margin: 0,
    borderRadius: 0,
    height: 24,
    justifyContent: 'center',
    alignContent: 'center',
  },
  checkboxText: {
    color: medium.color,
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 18,
  },
  checkboxEditContainer: {display: 'flex', flexDirection: 'row'},
  iconStyle: {
    marginLeft: 16,
    marginRight: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 80,
    padding: 10,
  },
  loading2: {
    zIndex: 9999,
    position: 'absolute',
    left: 28,
  },
  header: {
    backgroundColor: primary.color,
    height: 90,
    justifyContent: 'center',
  },
  appHeader: {
    height: 0,
  },
  listItemContent: {
    flex: 1,
    height: 30,
  },
  avatar: {
    width: 40,
    height: 24,
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
