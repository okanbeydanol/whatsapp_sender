/* eslint-disable react-hooks/exhaustive-deps */
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {primary, secondary} from '../../constants/styles/colors';
import {ContactTabScreenProps} from '../../navigation/types';
import {Icon, ListItem, Text} from '@rneui/themed';

import {USER_MESSAGE_TEPMLATES} from '../../constants/typescript/user';
import AppFlag from '../../components/Elements/AppFlag';
import {batch} from 'react-redux';
// import BackgroundService from 'react-native-background-actions';
import {DeviceEventEmitter} from 'react-native';
import ActionButton from 'react-native-action-button-warnings-fixed';
import {sendImage, sendText} from 'react-native-accessibility-manager-plugin';
import {ExternalDirectoryPath} from 'react-native-fs';

interface USER_LISTS_STARTER {
  id: number;
  user_list_guid: string;
  message_template_guid: string;
  title: string;
  user_guid: string;
  updated_at: string;
  created_at: string;
  deleted_at: string;
  contacts: USER_LIST_CONTACTS_STARTER[];
  template: USER_MESSAGE_TEPMLATES;
}
export interface USER_LIST_CONTACTS_STARTER {
  id: number;
  user_list_contact_guid: string;
  user_list_guid: string;
  user_guid: string;
  contact_id: number;
  updated_at: string;
  created_at: string;
  deleted_at: string;
  contact_info: DatabaseContactResponse;
  expanded?: number;
}
export type DatabaseContactResponse = {
  id: number;
  contact_id: string;
  user_guid: string;
  name: string;
  full_name: string;
  active: number;
  checked: boolean | undefined;
  last_name: string;
  contact_phones: DatabaseContactPhonesResponse[];
  created_at: string;
  deleted_at: string;
  updated_at: string;
  status?: CONTACTS_STATUS;
};
export type DatabaseContactPhonesResponse = {
  id: number;
  contact_id: string;
  contact_phone_guid: string;
  contact_phone_id: string;
  digit: string;
  active: number;
  area_code: string;
  country_code: string;
  type: string;
  created_at: string;
  deleted_at: string;
  updated_at: string;
  status?: CONTACTS_PHONES_STATUS;
};
export enum CONTACTS_PHONES_STATUS {
  PENDING = 'PENDING',
  STARTED = 'STARTED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}
enum CONTACTS_STATUS {
  PENDING = 'PENDING',
  STARTED = 'STARTED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}
const StartWhatsappSender = ({
  route,
}: ContactTabScreenProps<'StartWhatsappSender'>) => {
  //Route Params
  const {list} = route.params;
  //States
  const [listData, setListData] = useState<USER_LISTS_STARTER>(list);
  const [currentContactPhone, setCurrentContactPhone] =
    useState<DatabaseContactPhonesResponse | null>(null);
  const [currentContact, setCurrentContact] =
    useState<USER_LIST_CONTACTS_STARTER | null>(null);

  //UseEffects

  //Whatsapp Sender Brain
  useEffect(() => {
    if (listData.contacts.length > 0 && currentContact !== null) {
      console.log(
        '%c burda1',
        'background: #222; color: #bada55',
        currentContact,
      );

      setTimeout(() => {
        if (
          typeof currentContact.expanded === 'undefined' ||
          +currentContact.expanded === 0
        ) {
          //Kullanıcıyı expanded hale getiriyoruz.
          const findIndex = listData.contacts.findIndex(
            (o: USER_LIST_CONTACTS_STARTER) =>
              o.contact_id === currentContact.contact_id,
          );

          if (findIndex !== -1) {
            const currentContactPending = {
              ...currentContact,
              contact_info: {
                ...currentContact.contact_info,
                status: CONTACTS_STATUS.PENDING,
              },
              expanded: 1,
            };
            const contacts = [...listData.contacts];
            contacts[findIndex] = {...currentContactPending};
            batch(() => {
              setListData({...listData, contacts: [...contacts]});
              setCurrentContact(currentContactPending);
            });
          }
        } else if (
          currentContact.contact_info.status === CONTACTS_STATUS.PENDING &&
          currentContact.expanded === 1
        ) {
          console.log('%c burda2', 'background: #222; color: #bada55');

          //Kullanıcıyı başlatıyoruz.
          const findIndex = listData.contacts.findIndex(
            (o: USER_LIST_CONTACTS_STARTER) =>
              o.contact_id === currentContact.contact_id,
          );

          if (findIndex !== -1) {
            const currentContactPending = {
              ...currentContact,
              contact_info: {
                ...currentContact.contact_info,
                status: CONTACTS_STATUS.STARTED,
              },
            };
            const contacts = [...listData.contacts];
            contacts[findIndex] = {...currentContactPending};

            batch(() => {
              setListData({...listData, contacts: [...contacts]});
              setCurrentContact(currentContactPending);
            });
          }
        } else if (
          currentContact.contact_info.status === CONTACTS_STATUS.STARTED &&
          currentContactPhone === null
        ) {
          //Kullanıcının pending status telefonu bul ve başlat(started).
          const findIndex = listData.contacts.findIndex(
            (o: USER_LIST_CONTACTS_STARTER) =>
              o.contact_id === currentContact.contact_id,
          );
          if (findIndex !== -1) {
            const firstPhoneIndex =
              currentContact.contact_info.contact_phones.findIndex(
                (o: DatabaseContactPhonesResponse) =>
                  o.status === CONTACTS_PHONES_STATUS.PENDING &&
                  +o.active === 1,
              );
            console.log(
              '%c findIndexxxx',
              'background: #222; color: #bada55',
              firstPhoneIndex,
            );
            if (firstPhoneIndex !== -1) {
              const currentPhoneStarted = {
                ...currentContact.contact_info.contact_phones[firstPhoneIndex],
                status: CONTACTS_PHONES_STATUS.STARTED,
              };

              const contact_phones = [
                ...listData.contacts[findIndex].contact_info.contact_phones,
              ];
              contact_phones[firstPhoneIndex] = {...currentPhoneStarted};

              const contacts = [...listData.contacts];
              contacts[findIndex].contact_info.contact_phones = contact_phones;

              batch(() => {
                setListData({...listData, contacts: [...contacts]});
                setCurrentContact(contacts[findIndex]);
                setCurrentContactPhone(
                  contacts[findIndex].contact_info.contact_phones[
                    firstPhoneIndex
                  ],
                );
              });
            } else {
              const firstDisablePhoneIndex =
                currentContact.contact_info.contact_phones.findIndex(
                  (o: DatabaseContactPhonesResponse) =>
                    o.status === CONTACTS_PHONES_STATUS.PENDING &&
                    +o.active === 0,
                );
              console.log('%c burda1', 'background: #222; color: #bada55');

              if (firstDisablePhoneIndex !== -1) {
                const currentPhoneStarted = {
                  ...currentContact.contact_info.contact_phones[
                    firstDisablePhoneIndex
                  ],
                  status: CONTACTS_PHONES_STATUS.CANCELLED,
                };

                const contact_phones = [
                  ...listData.contacts[findIndex].contact_info.contact_phones,
                ];
                contact_phones[firstDisablePhoneIndex] = {
                  ...currentPhoneStarted,
                };

                const contacts = [...listData.contacts];
                contacts[findIndex].contact_info.contact_phones =
                  contact_phones;
                batch(() => {
                  setListData({...listData, contacts: [...contacts]});
                  setCurrentContact(contacts[findIndex]);
                  setCurrentContactPhone(
                    contacts[findIndex].contact_info.contact_phones[
                      firstDisablePhoneIndex
                    ],
                  );
                });
                console.log('%c burda', 'background: #222; color: #bada55');
              }
            }
          }
        }
      }, 200);
    } else if (listData.contacts.length > 0 && currentContact === null) {
      console.log('%c burda3', 'background: #222; color: #bada55');

      //Pending kullanıcıyı seçiyoruz.
      const findIndex = listData.contacts.findIndex(
        (o: USER_LIST_CONTACTS_STARTER) =>
          o.contact_info.status === CONTACTS_STATUS.PENDING,
      );
      if (findIndex !== -1) {
        setCurrentContact(listData.contacts[findIndex]);
      } else {
        //Pending kulllanıcı yok bitti.
      }
    }
  }, [listData, currentContact]);

  //Send Whatsapp and process next contact
  useEffect(() => {
    if (
      currentContactPhone !== null &&
      currentContact !== null &&
      currentContactPhone.status === CONTACTS_PHONES_STATUS.STARTED
    ) {
      const findIndex = listData.contacts.findIndex(
        (o: USER_LIST_CONTACTS_STARTER) =>
          o.contact_id === currentContact.contact_id,
      );
      if (findIndex !== -1) {
        const findIndexPhone = listData.contacts[
          findIndex
        ].contact_info.contact_phones.findIndex(
          (o: DatabaseContactPhonesResponse) =>
            o.contact_phone_id === currentContactPhone.contact_phone_id,
        );
        if (findIndexPhone !== -1) {
          const phone: DatabaseContactPhonesResponse =
            listData.contacts[findIndex].contact_info.contact_phones[
              findIndexPhone
            ];

          if (phone.status === CONTACTS_PHONES_STATUS.STARTED) {
            startWhatsappSend();
          }
        }
      }
    } else if (
      currentContactPhone !== null &&
      currentContact !== null &&
      (currentContactPhone.status === CONTACTS_PHONES_STATUS.COMPLETED ||
        currentContactPhone.status === CONTACTS_PHONES_STATUS.FAILED)
    ) {
      //Check user other Phones
      const firstPhoneIndex =
        currentContact.contact_info.contact_phones.findIndex(
          (o: DatabaseContactPhonesResponse) =>
            o.status === CONTACTS_PHONES_STATUS.PENDING,
        );
      if (firstPhoneIndex !== -1) {
        setCurrentContactPhone(null);
      }
    } else if (currentContact !== null) {
      const findIndex = listData.contacts.findIndex(
        (o: USER_LIST_CONTACTS_STARTER) =>
          o.contact_id === currentContact.contact_id,
      );

      if (findIndex !== -1) {
        const firstPhoneIndex =
          currentContact.contact_info.contact_phones.findIndex(
            (o: DatabaseContactPhonesResponse) =>
              o.status === CONTACTS_PHONES_STATUS.PENDING,
          );
        const currentContactPending = {
          ...currentContact,
          contact_info: {
            ...currentContact.contact_info,
            status:
              firstPhoneIndex !== -1
                ? CONTACTS_STATUS.STARTED
                : CONTACTS_STATUS.COMPLETED,
          },
        };
        const contacts = [...listData.contacts];
        contacts[findIndex] = {...currentContactPending};

        batch(() => {
          if (firstPhoneIndex !== -1) {
            setCurrentContactPhone(
              currentContact.contact_info.contact_phones[firstPhoneIndex],
            );
          } else {
            setCurrentContactPhone(null);
            setCurrentContact(null);
          }

          setListData({...listData, contacts: [...contacts]});
        });
      }
    }
  }, [currentContactPhone]);

  //Send TO Whatsapp and listen to the whatsapp response and complete current contact
  const startWhatsappSend = () => {
    if (
      currentContactPhone !== null &&
      currentContactPhone.status === CONTACTS_PHONES_STATUS.STARTED
    ) {
      const whatsappSenderEmmiter = DeviceEventEmitter.addListener(
        'wpsented',
        async () => {
          setTimeout(() => {
            if (currentContact !== null) {
              const findIndex = listData.contacts.findIndex(
                (o: USER_LIST_CONTACTS_STARTER) =>
                  o.contact_id === currentContact.contact_id,
              );
              if (findIndex !== -1) {
                const firstPhoneIndex =
                  currentContact.contact_info.contact_phones.findIndex(
                    (o: DatabaseContactPhonesResponse) =>
                      o.status === CONTACTS_PHONES_STATUS.STARTED,
                  );

                if (firstPhoneIndex !== -1) {
                  const currentPhoneStarted = {
                    ...currentContact.contact_info.contact_phones[
                      firstPhoneIndex
                    ],
                    status: CONTACTS_PHONES_STATUS.COMPLETED,
                  };

                  const contact_phones = [
                    ...listData.contacts[findIndex].contact_info.contact_phones,
                  ];
                  contact_phones[firstPhoneIndex] = {...currentPhoneStarted};

                  const contacts = [...listData.contacts];
                  contacts[findIndex].contact_info.contact_phones =
                    contact_phones;
                  batch(() => {
                    whatsappSenderEmmiter.remove();
                    setListData({...listData, contacts: [...contacts]});
                    setCurrentContact(contacts[findIndex]);
                    setCurrentContactPhone(null);
                  });
                }
              }
            }
            whatsappSenderEmmiter.remove();
          }, 800);
        },
      );
      if (listData.template !== null && listData.template.type === 'text') {
        sendText(
          currentContactPhone.area_code.toString() +
            currentContactPhone.digit.toString(),
          listData.template.text,
        );
      } else if (
        listData.template !== null &&
        listData.template.type === 'media'
      ) {
        sendImage(
          'file://' +
            ExternalDirectoryPath +
            '/' +
            listData.template.images[0].image_name,
          currentContactPhone.area_code.toString() +
            currentContactPhone.digit.toString(),
          listData.template.text,
        );
      }
    }
  };

  //Open accoridion
  const changeExpanded = (contact: USER_LIST_CONTACTS_STARTER) => {
    const newContacts = [...listData.contacts];
    const findIndex = newContacts.findIndex(
      (o: USER_LIST_CONTACTS_STARTER) => +o.contact_id === +contact.contact_id,
    );
    if (findIndex !== -1) {
      newContacts[findIndex] = {
        ...contact,
        expanded: contact.expanded === 1 ? 0 : 1,
      };
      const newListData = {...listData, contacts: newContacts};
      setListData(newListData);
    }
  };

  //Flatlist render item for contacts
  const renderItem = ({item}: {item: USER_LIST_CONTACTS_STARTER}) => (
    <ListItem.Accordion
      content={
        <>
          <Icon name="people" size={30} style={{marginRight: 16}} />
          <ListItem.Content>
            <ListItem.Title>{item.contact_info.full_name}</ListItem.Title>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text
                style={{
                  color: item.contact_info.status
                    ? item.contact_info.status === CONTACTS_STATUS.PENDING
                      ? secondary.color
                      : item.contact_info.status === CONTACTS_STATUS.CANCELLED
                      ? '#ff0000'
                      : item.contact_info.status === CONTACTS_STATUS.COMPLETED
                      ? 'green'
                      : item.contact_info.status === CONTACTS_STATUS.FAILED
                      ? '#ff0000'
                      : item.contact_info.status === CONTACTS_STATUS.STARTED
                      ? 'orange'
                      : secondary.color
                    : secondary.color,
                  marginRight: 8,
                }}>
                Status:
              </Text>
              <Text
                style={{
                  color:
                    item.contact_info.status === CONTACTS_STATUS.PENDING
                      ? secondary.color
                      : item.contact_info.status === CONTACTS_STATUS.CANCELLED
                      ? '#ff0000'
                      : item.contact_info.status === CONTACTS_STATUS.COMPLETED
                      ? 'green'
                      : item.contact_info.status === CONTACTS_STATUS.FAILED
                      ? '#ff0000'
                      : item.contact_info.status === CONTACTS_STATUS.STARTED
                      ? 'orange'
                      : secondary.color,
                }}>
                {item.contact_info.status
                  ? item.contact_info.status === CONTACTS_STATUS.PENDING
                    ? 'Bekliyor'
                    : item.contact_info.status === CONTACTS_STATUS.CANCELLED
                    ? 'İptal Edildi! Statüsünü pasif hale getirmişsiniz.'
                    : item.contact_info.status === CONTACTS_STATUS.COMPLETED
                    ? 'Gönderildi'
                    : item.contact_info.status === CONTACTS_STATUS.FAILED
                    ? 'Başarısız'
                    : item.contact_info.status === CONTACTS_STATUS.STARTED
                    ? 'Başladı'
                    : 'Hata!'
                  : 'Bekliyor'}
              </Text>
            </View>
          </ListItem.Content>
        </>
      }
      isExpanded={item.expanded === 1 ? true : false}
      onPress={() => {
        changeExpanded(item);
      }}>
      {item.contact_info.contact_phones.map(
        (l: DatabaseContactPhonesResponse, i: number) => (
          <ListItem key={i} bottomDivider>
            <AppFlag style={{width: 60, height: 30}} value={l.country_code} />
            <View>
              <ListItem.Content>
                <ListItem.Title>{l.area_code + l.digit}</ListItem.Title>
              </ListItem.Content>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text
                  style={{
                    color: l.status
                      ? l.status === CONTACTS_PHONES_STATUS.PENDING
                        ? secondary.color
                        : l.status === CONTACTS_PHONES_STATUS.CANCELLED
                        ? '#ff0000'
                        : l.status === CONTACTS_PHONES_STATUS.COMPLETED
                        ? 'green'
                        : l.status === CONTACTS_PHONES_STATUS.FAILED
                        ? '#ff0000'
                        : l.status === CONTACTS_PHONES_STATUS.STARTED
                        ? 'orange'
                        : secondary.color
                      : secondary.color,
                    marginRight: 8,
                  }}>
                  Status:
                </Text>
                <Text
                  style={{
                    color:
                      l.status === CONTACTS_PHONES_STATUS.PENDING
                        ? secondary.color
                        : l.status === CONTACTS_PHONES_STATUS.CANCELLED
                        ? '#ff0000'
                        : l.status === CONTACTS_PHONES_STATUS.COMPLETED
                        ? 'green'
                        : l.status === CONTACTS_PHONES_STATUS.FAILED
                        ? '#ff0000'
                        : l.status === CONTACTS_PHONES_STATUS.STARTED
                        ? 'orange'
                        : secondary.color,
                  }}>
                  {l.status
                    ? l.status === CONTACTS_PHONES_STATUS.PENDING
                      ? 'Bekliyor'
                      : l.status === CONTACTS_PHONES_STATUS.CANCELLED
                      ? 'İptal Edildi!\nNumarayı pasif hale getirmişsiniz.'
                      : l.status === CONTACTS_PHONES_STATUS.COMPLETED
                      ? 'Gönderildi'
                      : l.status === CONTACTS_PHONES_STATUS.FAILED
                      ? 'Başarısız'
                      : l.status === CONTACTS_PHONES_STATUS.STARTED
                      ? 'Başladı'
                      : 'Hata!'
                    : 'Bekliyor'}
                </Text>
              </View>
            </View>
            <ListItem.Chevron />
          </ListItem>
        ),
      )}
    </ListItem.Accordion>
  );

  return (
    <>
      <FlatList
        data={listData.contacts}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
      />
      <View style={styles.openCreateList}>
        <ActionButton
          onPress={() => {
            DeviceEventEmitter.emit('wpsented');
          }}
          buttonColor={primary.color}
        />
      </View>
    </>
  );
};

export default StartWhatsappSender;

const styles = StyleSheet.create({
  swipeableRightContainer: {},
  swipeableLeftContainer: {},
  openCreateList: {
    backgroundColor: '#f3f3f3',
    position: 'absolute',
    right: 0,
    top: Dimensions.get('window').height - 212,
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
