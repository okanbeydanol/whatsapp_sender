/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {batch, useDispatch, useSelector} from 'react-redux';
import {
  useGetUserQuery,
  useLazyGetUserContactsQuery,
  useLazyGetUserListQuery,
  useLazyRemoveUserListQuery,
  useLazyUpdateUserContactsQuery,
} from '../../store/api/userApi';

import {CONTACTS_CHANGE, getContactsStore} from '../../store/slices/contacts';
import {DB_CONTACTS_CHANGE} from '../../store/slices/dbContacts';
import {getLoginStore} from '../../store/slices/login';
import {
  getUserStore,
  USER_CHANGE,
  USER_LISTS_REPLACE,
} from '../../store/slices/user';
import {
  organizeContact,
  contactsGetDiffForDatabase,
} from '../../utils/native-contact';
import {
  badge,
  green,
  medium,
  primary,
  secondary,
  tertiary,
} from '../../constants/styles/colors';
import ActionButton from 'react-native-action-button-warnings-fixed';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {USER_LISTS, USER_LIST_CONTACTS} from '../../constants/typescript/user';
import {Card, Icon} from '@rneui/themed';
import moment from 'moment';
import usePacket from '../../hooks/usePacket';
import {ContactTabScreenProps} from '../../navigation/types';
import {useFocusEffect} from '@react-navigation/native';

const ListScreen = ({navigation}: ContactTabScreenProps<'ContactScreen'>) => {
  //Dispatch
  const dispatch = useDispatch();

  //Selectors
  const loginStore = useSelector(getLoginStore);
  const userStore = useSelector(getUserStore);
  const contactsStore = useSelector(getContactsStore);

  //Hooks
  const usePacketHook = usePacket();

  //States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  //Queries
  const {data, isError, isSuccess, error} = useGetUserQuery({
    user_guid: loginStore.userGuid,
  });
  const [get_trigger, get_contacts] = useLazyGetUserContactsQuery();
  const [update_trigger, update_contacts] = useLazyUpdateUserContactsQuery();
  const [get_lists_trigger, get_lists] = useLazyGetUserListQuery();
  const [remove_list_trigger, remove_list] = useLazyRemoveUserListQuery();

  //UseEffects
  //Dispatch user DATA
  useEffect(() => {
    if (typeof data !== 'undefined' && isSuccess) {
      dispatch(USER_CHANGE(data));
    }
  }, [isSuccess]);

  //Start user calculate packet status
  useEffect(() => {
    if (userStore.user_guid !== null) {
      const date = moment(userStore.packet_end_time);
      const now = moment();
      const diff = date.diff(now, 'seconds'); // 1
      if (+diff > 0) {
        const interval = usePacketHook.check_packet_status();
        return () => {
          clearInterval(interval);
        };
      }
    }
  });

  //Get user contacts
  useEffect(() => {
    if (
      get_contacts.isUninitialized &&
      loginStore.userGuid !== null &&
      userStore.user_guid !== null &&
      !get_contacts.isSuccess &&
      typeof get_contacts.data === 'undefined' &&
      loading
    ) {
      get_trigger({
        user_guid: loginStore.userGuid,
      });
    }
  });

  //Dispatch user lists Success get_lists
  useEffect(() => {
    if (
      typeof get_lists.data !== 'undefined' &&
      get_lists.isSuccess &&
      !get_lists.isFetching &&
      !loading
    ) {
      batch(() => {
        dispatch(USER_LISTS_REPLACE(get_lists.data));
        setRefreshing(false);
      });
    }
  }, [get_lists.isFetching, get_lists.isSuccess]);

  //Dispatch user contacts Success
  useEffect(() => {
    if (
      typeof update_contacts.data !== 'undefined' &&
      update_contacts.isSuccess &&
      userStore.user_guid !== null
    ) {
      setLoading(false);
      dispatch(DB_CONTACTS_CHANGE(update_contacts.data));
    }
  }, [update_contacts.isSuccess]);

  //Dispatch user lists Success remove_list
  useEffect(() => {
    if (
      !remove_list.isUninitialized &&
      loginStore.userGuid !== null &&
      userStore.user_guid !== null &&
      remove_list.isSuccess &&
      typeof remove_list.data !== 'undefined' &&
      !loading
    ) {
      dispatch(USER_LISTS_REPLACE(remove_list.data));
    }
  }, [remove_list.data, remove_list.isSuccess]);

  //Organize UserContacts Dispatch
  useEffect(() => {
    if (
      typeof get_contacts.data !== 'undefined' &&
      get_contacts.isSuccess &&
      !get_contacts.isUninitialized &&
      !get_contacts.isLoading &&
      userStore.user_guid !== null &&
      loading
    ) {
      setTimeout(async () => {
        if (userStore.country_info !== null) {
          const contacts = await organizeContact(
            loginStore.userGuid,
            userStore.country_info?.iso2,
            userStore.phone_number,
          );
          dispatch(CONTACTS_CHANGE(contacts.contacts));
        }
      }, 10);
    }
  }, [get_contacts.isSuccess]);

  //Detect phone contacts change and update database
  useEffect(() => {
    if (
      contactsStore.length !== 0 &&
      update_contacts.isUninitialized &&
      userStore.user_guid !== null &&
      loading === true
    ) {
      setTimeout(async () => {
        if (
          typeof update_contacts.data === 'undefined' &&
          typeof get_contacts.data !== 'undefined'
        ) {
          const {contactsToUpload} = await contactsGetDiffForDatabase(
            get_contacts.data,
            contactsStore,
          );
          if (contactsToUpload.length > 0) {
            update_trigger({
              user_guid: loginStore.userGuid,
              contacts: contactsToUpload,
            });
          } else {
            setLoading(false);
            dispatch(DB_CONTACTS_CHANGE(get_contacts.data));
          }
        }
      }, 10);
    }
  }, [contactsStore, get_contacts]);

  //Update contacts error
  useEffect(() => {
    if (update_contacts.isError) {
      Alert.alert('Hata Var', 'Rehberin update edilemiyor!', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [update_contacts.isError]);

  //Get contacts error
  useEffect(() => {
    if (get_contacts.isError) {
      Alert.alert('Hata Var', 'Rehberin getirelemiyor!', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [get_contacts.isError]);

  //Get user error
  useEffect(() => {
    if (isError && error) {
      Alert.alert('Hata Var', 'Kullanıcı bilgileri çekilemiyor!', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }, [isError]);

  //Focuse Event
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  //Functions
  //Open Create List Page
  const openCreateList = () => {
    navigation.navigate('CreateList', {selectedContacts: []});
  };

  //Refresh Lists
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    get_lists_trigger({user_guid: loginStore.userGuid});
  }, []);

  //Remove list
  const list_remove = (list_remove_data: USER_LISTS) => {
    Alert.alert('Sil!', 'Listeyi silmek istediğinize emin misiniz?', [
      {
        text: 'Evet',
        onPress: () => {
          remove_list_trigger({
            user_guid: loginStore.userGuid,
            user_list_guid: list_remove_data.user_list_guid,
          });
        },
      },
      {text: 'İptal Et', onPress: () => {}},
    ]);
  };

  //Open Edit List Page
  const list_edit = (list_edit_data: USER_LISTS) => {
    navigation.navigate('EditList', {
      selectedContacts: list_edit_data.contacts.map((o: USER_LIST_CONTACTS) => {
        return {...o.contact_info, checked: true};
      }),
      list: list_edit_data,
    });
  };

  //Open Whatsapp Sender Page
  const list_start = (list_start_data: USER_LISTS) => {
    navigation.navigate('StartWhatsappSender', {
      list: list_start_data,
    });
  };

  return (
    <>
      <View style={styles.appHeader}>
        <TouchableOpacity
          style={{position: 'absolute', left: 20, top: 16}}
          onPress={() => {
            navigation.openDrawer();
          }}
          activeOpacity={0.8}>
          <Icon
            name="menu"
            size={28}
            type="ionicon"
            color={medium.color}
            style={styles.addIconStyle}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.appHeaderText}>Gönderilecek Listeler</Text>
        </View>
      </View>
      {loading ? (
        <View style={[styles.loading]}>
          <ActivityIndicator />
        </View>
      ) : (
        <KeyboardAwareScrollView
          keyboardOpeningTime={0}
          extraScrollHeight={0}
          extraHeight={0}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
          persistentScrollbar={false}
          contentContainerStyle={[styles.scrollView]}
          enableAutomaticScroll={false}
          enableResetScrollToCoords={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {userStore.lists &&
            userStore.lists.map((key: USER_LISTS, index: any) => (
              <React.Fragment key={'Fragment' + index}>
                <Card containerStyle={styles.cardContainer}>
                  <Card.Title style={styles.cardTitle}>{key.title}</Card.Title>
                  <Card.Divider />
                  <View style={styles.cardContainerWrapper}>
                    <View style={styles.cardWrapper}>
                      <Text style={styles.title}>Mesaj Şablonu Başlığı</Text>
                      <Text style={styles.context}>{key.template.title}</Text>
                    </View>
                    <View>
                      <Text style={styles.title}>
                        Seçilen kullanıcı sayısı:
                      </Text>
                      <Text style={styles.context}>
                        {key.contacts.length} Kişi seçildi!
                      </Text>
                    </View>
                  </View>
                  <View style={styles.editWrapper}>
                    <View>
                      <Text style={styles.title}>Şablon tipi:</Text>
                      <Text style={styles.context}>{key.template.type}</Text>
                    </View>
                    <View style={styles.editContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          list_remove(key);
                        }}
                        activeOpacity={0.8}>
                        <Icon
                          name="trash"
                          size={28}
                          color={badge.color}
                          type="ionicon"
                          style={styles.addIconStyle}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          list_edit(key);
                        }}
                        activeOpacity={0.8}>
                        <Icon
                          name="pencil"
                          size={28}
                          type="ionicon"
                          color={medium.color}
                          style={styles.addIconStyle}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          list_start(key);
                        }}
                        activeOpacity={0.8}>
                        <Icon
                          name="play"
                          type="ionicon"
                          size={34}
                          color={green.color}
                          style={styles.addIconStyle}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              </React.Fragment>
            ))}
        </KeyboardAwareScrollView>
      )}
      <View style={styles.openCreateList}>
        <ActionButton onPress={openCreateList} buttonColor={primary.color} />
      </View>
    </>
  );
};

export default ListScreen;
const styles = StyleSheet.create({
  openCreateList: {
    backgroundColor: '#f3f3f3',
    position: 'absolute',
    right: 0,
    top: Dimensions.get('window').height - 212,
  },
  editWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  context: {
    color: medium.color,
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    fontWeight: '500',
  },
  cardWrapper: {marginRight: 32},
  cardContainer: {marginTop: 15},
  cardContainerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    color: secondary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    fontWeight: '500',
  },
  appHeaderText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    fontWeight: '500',
    color: tertiary.color,
  },
  scrollView: {},
  addIconStyle: {
    marginRight: 16,
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 80,
    padding: 10,
  },
  appHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: primary.color,
    height: 60,
  },
  addNewList: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  iconStyle: {
    marginRight: 6,
  },
  buttonStyle: {
    borderRadius: 5,
    marginRight: 16,

    padding: 4,
    flexDirection: 'row',
  },
  buttonTextStyle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    fontWeight: '500',
    color: '#999fb4',
  },
});
