/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppHeader from '../../components/Header/AppHeader';
import {light, medium, primary, secondary} from '../../constants/styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import AppTextInput from '../../components/Elements/AppTextInput';
import {ListItem, Button, Icon} from '@rneui/themed';
import {useLazyUpdateUserListQuery} from '../../store/api/userApi';
import MessageTemplatesTabs from '../../components/ContactScreen/MessageTemplatesTabs';
import {USER_MESSAGE_TEPMLATES} from '../../constants/typescript/user';
import AppButton from '../../components/Elements/AppButton';
import {USER_LISTS_REPLACE} from '../../store/slices/user';
import {DatabaseContactResponse} from '../../utils/native-contact';
import {ContactTabScreenProps} from '../../navigation/types';
import {getLoginStore} from '../../store/slices/login';

const EditList = ({navigation, route}: ContactTabScreenProps<'EditList'>) => {
  //Route Params
  const {list, selectedContacts} = route.params;

  //Dispatch
  const dispatch = useDispatch();

  //States
  const [selectContacts, setSelectContacts] = useState<
    DatabaseContactResponse[]
  >([]);
  const [title, setTitle] = useState('');

  //Queries
  const [trigger_update_user_list, update_user_list] =
    useLazyUpdateUserListQuery();
  const [selectedTemplate, setSelectedTemplate]: any = useState(list.template);
  const loginStore = useSelector(getLoginStore);

  //UseEffects
  //Set Selected Contacts
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectContacts(selectedContacts);
    });
    return () => {
      unsubscribe();
    };
  }, [selectedContacts, navigation]);

  //Dispatch update user list
  useEffect(() => {
    if (
      typeof update_user_list.data !== 'undefined' &&
      update_user_list.isSuccess
    ) {
      dispatch(USER_LISTS_REPLACE(update_user_list.data));
      navigation.pop();
    }
  }, [update_user_list.isSuccess]);

  //Set Title Changes
  useEffect(() => {
    setTitle(list.title);
  }, []);

  //Functions
  //Close Page
  const closePress = () => {
    navigation.pop();
  };

  //Update User List
  const saveList = () => {
    if (
      typeof title === 'undefined' ||
      !title ||
      (title && title.length === 0) ||
      title === ''
    ) {
      Alert.alert('Hata!', 'Title boş bırakılamaz!', [
        {text: 'OK', onPress: () => {}},
      ]);
      return;
    }
    if (selectedTemplate === null) {
      Alert.alert('Hata!', 'Lütfen bir message template seçin!', [
        {text: 'OK', onPress: () => {}},
      ]);
      return;
    }
    if (
      typeof selectContacts === 'undefined' ||
      !selectContacts ||
      selectContacts.length === 0
    ) {
      Alert.alert('Hata!', 'Lütfen en az bir contact ekleyiniz!', [
        {text: 'OK', onPress: () => {}},
      ]);
      return;
    }
    trigger_update_user_list({
      user_guid: loginStore.userGuid,
      title: title,
      user_list_guid: list.user_list_guid,
      message_template_guid: selectedTemplate.message_template_guid,
      contacts_ids: selectContacts.map((o: DatabaseContactResponse) => {
        return o.contact_id;
      }),
    });
  };

  //Open Choose Contact List Page
  const openContact = () => {
    navigation.navigate('ChooseContact', {
      selectedContacts: selectContacts,
      type: 'edit',
    });
  };

  //Open Create Template Page
  const openCreateTemplate = () => {
    navigation.navigate('CreateTemplate');
  };

  //Delete Contact State
  const deleteContact = (key: DatabaseContactResponse) => {
    const contact = [
      ...selectContacts.filter(
        (o: DatabaseContactResponse) => o.contact_id !== key.contact_id,
      ),
    ];
    setSelectContacts(contact);
  };

  return (
    <>
      <AppHeader style={styles.appHeader} />
      <View style={styles.header}>
        <TouchableOpacity onPress={closePress}>
          <Icon
            name="close"
            size={22}
            color={medium.color}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={[styles.scrollView]}>
        <View style={styles.listPageTitleWrapper}>
          <Text style={styles.listPageTitle}>Listeyi Düzenle</Text>
        </View>
        <View style={styles.ListTitleWrapper}>
          <Text style={styles.ListTitle}>Liste Başlığı</Text>
        </View>
        <View>
          <Text style={styles.ListTitleDesc}>
            (Lütfen liste için düzgün bir başlık giriniz!)
          </Text>
        </View>
        <View style={styles.ListInputWrapper}>
          <AppTextInput
            value={title}
            onChangeText={(t: string) => {
              setTitle(t);
            }}
            placeholder="Lütfen liste başlığı giriniz..."
          />
        </View>
        <View style={styles.listMessageTemplateWrapper}>
          <Text style={styles.listMessageTemplate}>Mesaj Şablonları</Text>
          <TouchableOpacity onPress={openCreateTemplate} activeOpacity={0.8}>
            <Icon
              name="add"
              size={26}
              color={medium.color}
              style={styles.addIconStyle}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.ListTitleDesc}>
            (Hazırladığız şablonları aşağıdan seçebilirsiniz!)
          </Text>
        </View>
        <View style={styles.listMessageTemplatesWrapper}>
          <MessageTemplatesTabs
            navigation={navigation}
            selectedMessageTemplateGuid={list.template.message_template_guid}
            onChange={(data: USER_MESSAGE_TEPMLATES) => {
              if (data.checked) {
                setSelectedTemplate(data);
              } else {
                setSelectedTemplate(null);
              }
            }}
          />
        </View>
        <View style={styles.listAddContactWrapper}>
          <Text style={styles.listAddContact}>Kişi Ekle</Text>
          <TouchableOpacity onPress={openContact} activeOpacity={0.8}>
            <Icon
              name="add"
              size={26}
              color={medium.color}
              style={styles.addIconStyle}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.ListTitleDesc}>
            (Artı butonuna tıklayarak rehberinizden kişiler seçerek
            ekleyebilirsiniz!)
          </Text>
        </View>
        {list.contacts.length === 0 && (
          <View style={styles.listAddContactEmptyWrapper}>
            <Text style={styles.listAddContactEmpty}>
              Daha Herhangi bir kişi eklemediniz!
            </Text>
          </View>
        )}

        <View style={{height: 240}}>
          <KeyboardAwareScrollView
            nestedScrollEnabled={true}
            contentContainerStyle={[styles.scrollViewContact]}>
            {selectContacts &&
              selectContacts.map((key: DatabaseContactResponse, index: any) => (
                <React.Fragment key={'Fragment' + index}>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: light.color,
                    }}>
                    <ListItem.Swipeable
                      leftStyle={styles.swipeableLeftContainer}
                      rightStyle={styles.swipeableRightContainer}
                      rightContent={reset => (
                        <Button
                          title="Delete"
                          onPress={() => {
                            deleteContact(key);
                            reset();
                          }}
                          icon={{name: 'delete', color: 'white'}}
                          buttonStyle={{
                            minHeight: '100%',
                            backgroundColor: 'red',
                          }}
                        />
                      )}>
                      <Icon name="people" />
                      <ListItem.Content>
                        <ListItem.Title>{key.full_name}</ListItem.Title>
                      </ListItem.Content>
                      <ListItem.Chevron />
                    </ListItem.Swipeable>
                  </View>
                </React.Fragment>
              ))}
          </KeyboardAwareScrollView>
        </View>

        <View
          style={{
            width: '100%',
            paddingStart: 16,
            paddingTop: 16,
            paddingBottom: 16,
          }}>
          <AppButton onPress={saveList} title="Save" />
        </View>
      </ScrollView>
    </>
  );
};

export default EditList;

const styles = StyleSheet.create({
  swipeableRightContainer: {},
  swipeableLeftContainer: {},
  scrollView: {
    paddingRight: 15,
    paddingLeft: 15,
  },
  scrollViewContact: {},
  tabsContainerStyle: {
    paddingBottom: 16,
    paddingRight: 16,
    paddingLeft: 16,
  },
  listPageTitleWrapper: {
    width: '100%',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listPageTitle: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    fontWeight: '600',
  },
  listMessageTemplateWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 8,
  },
  listMessageTemplatesWrapper: {height: 226},
  listMessageTemplate: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    fontWeight: '600',
  },
  ListTitleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
  },
  ListTitle: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    fontWeight: '600',
  },
  ListTitleDesc: {
    color: secondary.color,
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    fontWeight: '500',
    paddingLeft: 16,
    marginBottom: 8,
  },
  listAddContactListWrapper: {
    alignItems: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: secondary.color,
    borderStyle: 'solid',
    borderRadius: 12,
    padding: 16,
  },
  listAddContactList: {},
  listAddContactWrapper: {
    marginTop: 66,
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listAddContactEmptyWrapper: {
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listAddContact: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontWeight: '600',
  },
  listAddContactEmpty: {
    color: secondary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    fontWeight: '600',
  },
  ListInputWrapper: {
    alignItems: 'center',
  },
  iconStyle: {
    marginLeft: 16,
  },
  addIconStyle: {
    marginRight: 16,
  },
  header: {
    backgroundColor: primary.color,
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  appHeader: {
    height: 0,
  },
});
