/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  ScrollView,
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
import AppTextInput from '../../components/Elements/AppTextInput';
import {ListItem, Button, Icon} from '@rneui/themed';
import {useLazyCreateUserListQuery} from '../../store/api/userApi';
import {getLoginStore} from '../../store/slices/login';
import MessageTemplatesTabs from '../../components/ContactScreen/MessageTemplatesTabs';
import {USER_MESSAGE_TEPMLATES} from '../../constants/typescript/user';
import {DatabaseContactResponse} from '../../utils/native-contact';
import AppButton from '../../components/Elements/AppButton';
import {USER_LISTS_ADD} from '../../store/slices/user';
import {ContactTabScreenProps} from '../../navigation/types';
const CreateList = ({
  navigation,
  route,
}: ContactTabScreenProps<'CreateList'>) => {
  //Route Params
  const {selectedContacts} = route.params;

  //Dispatch
  const dispatch = useDispatch();

  //Selectors
  const loginStore = useSelector(getLoginStore);

  //Refs
  let titleRef: any = useRef<TextInput>();

  //Queries
  const [trigger_create_user_list, create_user_list] =
    useLazyCreateUserListQuery();
  const [selectedTemplate, setSelectedTemplate]: any = useState(null);

  //UseEffects

  //Dispatch create_user_list isSuccess
  useEffect(() => {
    if (
      typeof create_user_list.data !== 'undefined' &&
      create_user_list.isSuccess
    ) {
      dispatch(USER_LISTS_ADD(create_user_list.data));
      navigation.pop();
    }
  }, [create_user_list.isSuccess]);

  //Functions
  //Create User List
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
    trigger_create_user_list({
      user_guid: loginStore.userGuid,
      title: titleRef.current.value,
      message_template_guid: selectedTemplate.message_template_guid,
      contacts_ids: selectedContacts.map((o: DatabaseContactResponse) => {
        return o.contact_id;
      }),
    });
  };

  //Open ChooseContact Page
  const openContact = () => {
    console.log(
      '%c selectedContacts',
      'background: #222; color: #bada55',
      selectedContacts,
    );
    navigation.navigate('ChooseContact', {
      selectedContacts: selectedContacts,
      type: 'create',
    });
  };

  //Open CreateTemplate Page
  const openCreateTemplate = () => {
    navigation.navigate('CreateTemplate');
  };

  //Close Page
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
            size={22}
            color={medium.color}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      </View>
      <ScrollView nestedScrollEnabled={true} style={[styles.scrollView]}>
        <View style={styles.listPageTitleWrapper}>
          <Text style={styles.listPageTitle}>Gönderilecek Liste Oluştur.</Text>
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
            innerRef={titleRef}
            onChangeText={(text: string) => {
              titleRef.current.value = text;
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
        {selectedContacts.length === 0 && (
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

        <View
          style={{
            width: '100%',
            paddingStart: 16,
            marginTop: 16,
            marginBottom: 16,
          }}>
          <AppButton onPress={saveList} title="Save" />
        </View>
      </ScrollView>
    </>
  );
};

export default CreateList;

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
