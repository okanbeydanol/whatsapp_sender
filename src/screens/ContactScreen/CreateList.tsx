/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppHeader from '../../components/Header/AppHeader';
import {light, medium, primary, secondary} from '../../constants/styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDBContactsStore} from '../../store/slices/dbContacts';
import AppTextInput from '../../components/Elements/AppTextInput';
import {ListItem, Button, Icon} from '@rneui/themed';
import {useLazyCreateUserListQuery} from '../../store/api/userApi';
import {getLoginStore} from '../../store/slices/login';
import MessageTemplatesTabs from '../../components/ContactScreen/MessageTemplatesTabs';
import {USER_MESSAGE_TEPMLATES} from '../../constants/typescript/user';
import {DatabaseContactResponse} from '../../utils/native-contact';
import AppButton from '../../components/Elements/AppButton';
import {USER_LISTS_ADD} from '../../store/slices/user';
interface CreateListNavigationList {
  navigation: any;
  route: {
    params: {
      selectedContacts: DatabaseContactResponse[];
    };
  };
}
const CreateList = ({navigation, route}: CreateListNavigationList) => {
  const {selectedContacts} = route.params;
  const dispatch = useDispatch();
  const loginStore = useSelector(getLoginStore);
  const contacts = useSelector(getDBContactsStore);
  const [triggerCreateUserList, createUserList] = useLazyCreateUserListQuery();
  const [selectedTemplate, setSelectedTemplate]: any = useState(null);

  let titleRef: any = useRef<TextInput>();
  const closePress = () => {
    navigation.pop();
  };
  const saveList = () => {
    if (
      typeof titleRef.current.value === 'undefined' ||
      !titleRef.current.value ||
      (titleRef.current.value && titleRef.current.value.length === 0) ||
      titleRef.current.value === ''
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
      typeof selectedContacts === 'undefined' ||
      !selectedContacts ||
      selectedContacts.length === 0
    ) {
      Alert.alert('Hata!', 'Lütfen en az bir contact ekleyiniz!', [
        {text: 'OK', onPress: () => {}},
      ]);
      return;
    }
    console.log(
      '%c  selectedContacts',
      'background: #222; color: #bada55',
      selectedContacts,
    );
    triggerCreateUserList({
      user_guid: loginStore.userGuid,
      title: titleRef.current.value,
      message_template_guid: selectedTemplate.message_template_guid,
      contacts_ids: selectedContacts.map((o: any) => {
        return o.id;
      }),
    });
  };
  const openContact = () => {
    navigation.navigate('ChooseContact', {selectedContacts: selectedContacts});
  };
  const openCreateTemplate = () => {
    navigation.navigate('CreateTemplate');
  };
  useEffect(() => {
    if (
      typeof createUserList.data !== 'undefined' &&
      createUserList.isSuccess
    ) {
      console.log(
        '%c createUserList.data',
        'background: #222; color: #bada55',
        createUserList.data,
      );
      dispatch(USER_LISTS_ADD(createUserList.data));
      navigation.pop();
    }
  }, [createUserList.isSuccess]);

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
      <View style={[styles.scrollView]}>
        <View style={styles.listPageTitleWrapper}>
          <Text style={styles.listPageTitle}>Create a List</Text>
        </View>
        <View style={styles.ListTitleWrapper}>
          <Text style={styles.ListTitle}>List Title</Text>
        </View>
        <View style={styles.ListInputWrapper}>
          <AppTextInput
            innerRef={titleRef}
            onChangeText={(text: string) => {
              titleRef.current.value = text;
            }}
            placeholder="Please enter a list title..."
          />
        </View>
        <View style={styles.listMessageTemplateWrapper}>
          <Text style={styles.listMessageTemplate}>Message Templates</Text>
          <TouchableOpacity onPress={openCreateTemplate} activeOpacity={0.8}>
            <Icon
              name="add"
              size={26}
              color={medium.color}
              style={styles.addIconStyle}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.listMessageTemplatesWrapper}>
          <MessageTemplatesTabs
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
          <Text style={styles.listAddContact}>Add Contact</Text>
          <TouchableOpacity onPress={openContact} activeOpacity={0.8}>
            <Icon
              name="add"
              size={26}
              color={medium.color}
              style={styles.addIconStyle}
            />
          </TouchableOpacity>
        </View>
        {selectedContacts.length === 0 && (
          <View style={styles.listAddContactEmptyWrapper}>
            <Text style={styles.listAddContactEmpty}>
              There is no added contact
            </Text>
          </View>
        )}

        <View style={{height: 240}}>
          <KeyboardAwareScrollView
            contentContainerStyle={[styles.scrollViewContact]}>
            {selectedContacts.map(
              (key: DatabaseContactResponse, index: any) => (
                <React.Fragment key={'Fragment' + index}>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: light.color,
                    }}>
                    <ListItem.Swipeable
                      leftStyle={styles.swipeableLeftContainer}
                      rightStyle={styles.swipeableRightContainer}
                      leftContent={reset => (
                        <Button
                          title="Info"
                          onPress={() => reset()}
                          icon={{name: 'info', color: 'white'}}
                          buttonStyle={{minHeight: '100%'}}
                        />
                      )}
                      rightContent={reset => (
                        <Button
                          title="Delete"
                          onPress={() => reset()}
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
              ),
            )}
          </KeyboardAwareScrollView>
        </View>

        <View style={{width: '100%', paddingStart: 16, marginTop: 16}}>
          <AppButton onPress={saveList} title="Save" />
        </View>
      </View>
    </>
  );
};

export default CreateList;

const styles = StyleSheet.create({
  swipeableRightContainer: {
    paddingRight: 16,
  },
  swipeableLeftContainer: {
    paddingLeft: 16,
  },
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
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  appHeader: {
    height: 0,
  },
});
