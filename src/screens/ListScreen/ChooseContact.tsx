import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import AppHeader from '../../components/Header/AppHeader';
import {CheckBox, Icon} from '@rneui/themed';
import {medium, primary, secondary} from '../../constants/styles/colors';
import {useSelector} from 'react-redux';
import {DatabaseContactResponse} from '../../utils/native-contact';
import {getDBContactsStore} from '../../store/slices/dbContacts';
import {ContactTabScreenProps} from '../../navigation/types';

const ChooseContact = ({
  navigation,
  route,
}: ContactTabScreenProps<'ChooseContact'>) => {
  //Route Params
  const {selectedContacts, type} = route.params;

  //Selectors
  const contacts = useSelector(getDBContactsStore);

  //States
  const [selectContacts, setSelectContacts]: any = useState(selectedContacts);

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
    navigation.navigate({
      name: type === 'create' ? 'CreateList' : 'EditList',
      params: {selectedContacts: selectContacts},
      merge: true,
    });
  };

  //Emit Selected Contacts
  const emitChanges = (data: DatabaseContactResponse) => {
    if (selectContacts) {
      const findIndex = selectContacts.findIndex(
        (o: DatabaseContactResponse) => +o.contact_id === +data.contact_id,
      );
      if (findIndex !== -1) {
        selectContacts.splice(findIndex, 1);
        setSelectContacts([...selectContacts]);
      } else {
        const checked = {...data, checked: true};
        setSelectContacts([...selectContacts, checked]);
      }
    }
  };

  //FlatList Render Item
  const renderItem = ({item}: {item: DatabaseContactResponse}) => (
    <View style={styles.tabContentContainer}>
      <CheckBox
        title={item.full_name + item.contact_phones.length}
        checkedIcon="checkbox-outline"
        uncheckedIcon="square-outline"
        checked={
          selectContacts.find(
            (o: DatabaseContactResponse) => +o.contact_id === +item.contact_id,
          )
            ? selectContacts.find(
                (o: DatabaseContactResponse) =>
                  +o.contact_id === +item.contact_id,
              ).checked
            : false
        }
        size={20}
        iconType="material-community"
        onPress={() => emitChanges(item)}
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
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
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
    height: 60,
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
