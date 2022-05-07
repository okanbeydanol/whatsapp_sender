/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LoginChatInput from '../../components/login/LoginChatInput';
import AppHeader from '../../components/Header/AppHeader';
import {CheckBox, Icon} from '@rneui/themed';
import {medium, primary, secondary} from '../../constants/styles/colors';
import {useSelector} from 'react-redux';
import {DatabaseContactResponse} from '../../utils/native-contact';
import {getDBContactsStore} from '../../store/slices/dbContacts';

const ChooseContact = ({navigation, route}: any) => {
  console.log('%c route', 'background: #222; color: #bada55', route.params);
  const {selectedContacts} = route.params;
  const contacts = useSelector(getDBContactsStore);
  const [selectContacts, setSelectContacts]: any = useState(selectedContacts);
  let ref: any = useRef();
  const closePress = () => {
    navigation.navigate({
      name: 'CreateList',
      params: {selectedContacts: selectedContacts},
      merge: true,
    });
  };
  const savePress = () => {
    navigation.navigate({
      name: 'CreateList',
      params: {selectedContacts: selectContacts},
      merge: true,
    });
  };
  const emitChanges = (data: DatabaseContactResponse) => {
    console.log('%c contacts', 'background: #222; color: #bada55', contacts);
    if (selectContacts) {
      const findIndex = selectContacts.findIndex(
        (o: DatabaseContactResponse) => +o.contact_id === +data.contact_id,
      );
      if (findIndex !== -1) {
        selectContacts.splice(findIndex, 1);
        setSelectContacts([...selectContacts]);
        console.log('%c nedennn', 'background: #222; color: #bada55');
      } else {
        const checked = {...data, checked: true};
        setSelectContacts([...selectContacts, checked]);
      }
    }
  };
  return (
    <>
      <AppHeader style={styles.appHeader} />
      <View style={styles.header}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={closePress}>
            <Icon
              name="close"
              size={22}
              color={medium.color}
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
      </View>
      <LoginChatInput />
      <KeyboardAwareScrollView
        keyboardOpeningTime={250}
        extraScrollHeight={0}
        extraHeight={0}
        ref={ref}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}
        contentContainerStyle={[styles.scrollView]}
        enableAutomaticScroll={false}
        enableResetScrollToCoords={false}>
        {contacts.map((key: DatabaseContactResponse, index: any) => (
          <React.Fragment key={'Fragment' + index}>
            <View style={styles.tabContentContainer}>
              <CheckBox
                title={key.full_name}
                checkedIcon="checkbox-outline"
                uncheckedIcon="square-outline"
                checked={
                  selectContacts.find(
                    (o: DatabaseContactResponse) =>
                      +o.contact_id === +key.contact_id,
                  )
                    ? selectContacts.find(
                        (o: DatabaseContactResponse) =>
                          +o.contact_id === +key.contact_id,
                      ).checked
                    : false
                }
                size={20}
                iconType="material-community"
                onPress={() => emitChanges(key)}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
              />
              <View style={styles.checkboxEditContainer}>
                <Icon
                  name="edit"
                  size={22}
                  color={medium.color}
                  style={styles.addIconStyle}
                />
                <Icon
                  name="delete"
                  size={22}
                  color={medium.color}
                  style={styles.addIconStyle}
                />
              </View>
            </View>
          </React.Fragment>
        ))}
      </KeyboardAwareScrollView>
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
  },
  addIconStyle: {
    marginRight: 16,
  },
  checkboxContainer: {padding: 0, margin: 0, borderRadius: 0},
  checkboxText: {
    color: medium.color,
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    fontWeight: '500',
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
  header: {
    backgroundColor: primary.color,
    height: 40,
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
