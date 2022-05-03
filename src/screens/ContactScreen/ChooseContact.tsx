/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LoginChatInput from '../../components/login/LoginChatInput';
import AppHeader from '../../components/Header/AppHeader';
import countries from '../../assets/countries_details.json';
import {ListItem} from '@rneui/themed';
import {medium, primary, secondary} from '../../constants/styles/colors';
import AppFlag from '../../components/Elements/AppFlag';
import Icon from 'react-native-vector-icons/FontAwesome';
import {batch, useDispatch, useSelector} from 'react-redux';
import {COUNTRY_CHANGE_UPDATE} from '../../store/slices/country';
import {DatabaseContactResponse} from '../../utils/native-contact';
import {getDBContactsStore} from '../../store/slices/dbContacts';

const ChooseContact = ({navigation}: any) => {
  const dispatch = useDispatch();
  const contacts = useSelector(getDBContactsStore);

  let ref: any = useRef();
  const closePress = () => {
    navigation.pop();
  };

  return (
    <>
      <AppHeader style={styles.appHeader} />
      <View style={styles.header}>
        <TouchableOpacity onPress={closePress}>
          <Icon
            name="close"
            size={15}
            color={medium.color}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
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
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.pop();
                dispatch(COUNTRY_CHANGE_UPDATE(key));
              }}>
              <ListItem>
                <AppFlag
                  style={styles.avatar}
                  value={key.contact_phones[0].country_code.toLocaleLowerCase()}
                />

                <ListItem.Content style={styles.listItemContent}>
                  <Text style={styles.name}>
                    {key.last_name} - {key.name}
                  </Text>
                </ListItem.Content>
              </ListItem>
            </TouchableOpacity>
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
  iconStyle: {
    marginLeft: 16,
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
