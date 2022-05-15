/* eslint-disable react-hooks/exhaustive-deps */
import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  medium,
  primary,
  primary2,
  secondary,
} from '../../constants/styles/colors';
import {Tab, TabView, CheckBox, Icon, Card} from '@rneui/themed';
import {batch, useDispatch, useSelector} from 'react-redux';
import {getLoginStore} from '../../store/slices/login';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {USER_MESSAGE_TEPMLATES} from '../../constants/typescript/user';
import {
  getUserStore,
  USER_MESSAGES_TEMPLATE_DELETE,
} from '../../store/slices/user';
import {useLazyDeleteUserMessageTemplatesQuery} from '../../store/api/userApi';

interface MessageTemplatesProps {
  onChange: (data: USER_MESSAGE_TEPMLATES) => void;
  selectedMessageTemplateGuid?: string;
  navigation: any;
}
const MessageTemplatesTabs = ({
  onChange,
  selectedMessageTemplateGuid,
  navigation,
}: MessageTemplatesProps) => {
  //Dispatch
  const dispatch = useDispatch();

  //States
  const [index, setIndex] = useState<number>(0);
  const [selectedData, setSelectedData] =
    useState<USER_MESSAGE_TEPMLATES | null>(null);

  //Selectors
  const loginStore = useSelector(getLoginStore);
  const userStore = useSelector(getUserStore);

  //Queries
  const [triggerDeleteUserTemplate, deleteUserTemplate] =
    useLazyDeleteUserMessageTemplatesQuery();

  //UseEffects
  useEffect(() => {
    if (
      typeof deleteUserTemplate.data !== 'undefined' &&
      deleteUserTemplate.isSuccess &&
      !deleteUserTemplate.isFetching
    ) {
      batch(() => {
        dispatch(USER_MESSAGES_TEMPLATE_DELETE(deleteUserTemplate.data));
        setSelectedData(null);
      });
    }
  }, [deleteUserTemplate.isFetching, deleteUserTemplate.isSuccess]);

  useEffect(() => {
    if (
      userStore.message_templates &&
      userStore.message_templates.length > 0 &&
      selectedData == null
    ) {
      const findIndex = userStore.message_templates.findIndex(
        (o: USER_MESSAGE_TEPMLATES) =>
          o.message_template_guid === selectedMessageTemplateGuid,
      );
      if (findIndex !== -1) {
        setSelectedData(userStore.message_templates[findIndex]);
      }
    }
  }, []);

  //Functions
  const emitChanges = (data: USER_MESSAGE_TEPMLATES) => {
    const cloneData = {
      ...data,
    };
    console.log('%c data', 'background: #222; color: #bada55', data);
    if (selectedData?.message_template_guid === data.message_template_guid) {
      cloneData.checked = selectedData?.checked ? !selectedData?.checked : true;
      setSelectedData(null);
    } else {
      cloneData.checked = true;
      setSelectedData(cloneData);
    }
    onChange && onChange(cloneData);
  };

  const deleteTemplate = (data: USER_MESSAGE_TEPMLATES) => {
    Alert.alert('Sil!', 'Silmek istediğinize emin misiniz?', [
      {
        text: 'Evet',
        onPress: () => {
          triggerDeleteUserTemplate({
            user_guid: loginStore.userGuid,
            message_template_guid: data.message_template_guid,
          });
        },
      },
      {
        text: 'Hayır',
        onPress: () => {},
      },
    ]);
  };

  return (
    <>
      <Tab
        value={index}
        onChange={e => setIndex(e)}
        disableIndicator={true}
        indicatorStyle={styles.tabIndicator}
        containerStyle={styles.tabContainerStyle}
        variant="default">
        <Tab.Item
          title="Text"
          buttonStyle={(active: any) => {
            return {
              marginTop: 0,
              zIndex: 99,
              margin: 0,
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              marginLeft: 0,
              padding: 0,
              backgroundColor: active ? primary.color : primary2.color,
            };
          }}
          titleStyle={styles.tabTitle}
        />
        <Tab.Item
          title="Media"
          buttonStyle={(active: any) => {
            return {
              marginTop: 0,
              zIndex: 99,
              margin: 0,
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              marginLeft: 0,
              padding: 0,
              backgroundColor: active ? primary.color : primary2.color,
            };
          }}
          titleStyle={styles.tabTitle}
        />
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={styles.tabViewContainer}>
          <Card containerStyle={styles.tabCardContainer}>
            <KeyboardAwareScrollView
              keyboardOpeningTime={0}
              extraScrollHeight={0}
              extraHeight={0}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none"
              showsVerticalScrollIndicator={false}
              persistentScrollbar={false}
              enableAutomaticScroll={false}
              enableResetScrollToCoords={false}>
              {userStore.message_templates &&
              userStore.message_templates.filter(
                (o: USER_MESSAGE_TEPMLATES) => o.type === 'text',
              ).length > 0 ? (
                userStore.message_templates.map(
                  (textData: USER_MESSAGE_TEPMLATES, textDataIndex: number) =>
                    textData.type === 'text' && (
                      <React.Fragment key={'Fragment' + textDataIndex}>
                        <View style={styles.tabContentContainer}>
                          <CheckBox
                            title={textData.title}
                            checkedIcon="check-circle-outline"
                            uncheckedIcon="checkbox-blank-circle-outline"
                            checked={
                              selectedData !== null &&
                              selectedData.message_template_guid ===
                                textData.message_template_guid
                                ? true
                                : false
                            }
                            size={20}
                            iconType="material-community"
                            onPress={() => emitChanges(textData)}
                            containerStyle={styles.checkboxContainer}
                            textStyle={styles.checkboxText}
                          />
                          <View style={styles.checkboxEditContainer}>
                            <Icon
                              name="edit"
                              size={22}
                              onPress={() => {
                                navigation.navigate('EditTemplate', {
                                  template: textData,
                                });
                              }}
                              color={medium.color}
                              style={styles.addIconStyle}
                            />
                            <Icon
                              name="delete"
                              size={22}
                              onPress={() => {
                                deleteTemplate(textData);
                              }}
                              color={medium.color}
                              style={styles.addIconStyle}
                            />
                          </View>
                        </View>
                      </React.Fragment>
                    ),
                )
              ) : (
                <Text
                  style={{
                    padding: 16,
                  }}>
                  Her hangi bir text mesaj şablonu eklememişsiniz! Lütfen
                  yukarıdaki artı butonunu kullanarak bir şablon ekleyin.
                </Text>
              )}
            </KeyboardAwareScrollView>
          </Card>
        </TabView.Item>
        <TabView.Item style={styles.tabViewContainer}>
          <Card containerStyle={styles.tabCardContainer}>
            <KeyboardAwareScrollView
              keyboardOpeningTime={0}
              extraScrollHeight={0}
              extraHeight={0}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none"
              showsVerticalScrollIndicator={false}
              persistentScrollbar={false}
              enableAutomaticScroll={false}
              enableResetScrollToCoords={false}>
              {userStore.message_templates &&
              userStore.message_templates.filter(
                (o: USER_MESSAGE_TEPMLATES) => o.type === 'media',
              ).length > 0 ? (
                userStore.message_templates.map(
                  (mediaData: any, mediaDataIndex: any) =>
                    mediaData.type === 'media' && (
                      <React.Fragment key={'Fragment2' + mediaDataIndex}>
                        <View style={styles.tabContentContainer}>
                          <CheckBox
                            title={mediaData.title}
                            checkedIcon="check-circle-outline"
                            uncheckedIcon="checkbox-blank-circle-outline"
                            checked={
                              selectedData !== null &&
                              selectedData.message_template_guid ===
                                mediaData.message_template_guid
                                ? true
                                : false
                            }
                            size={20}
                            iconType="material-community"
                            onPress={() => emitChanges(mediaData)}
                            containerStyle={styles.checkboxContainer}
                            textStyle={styles.checkboxText}
                          />
                          <View style={styles.checkboxEditContainer}>
                            <Icon
                              name="edit"
                              size={22}
                              onPress={() => {
                                navigation.navigate('EditTemplate', {
                                  template: mediaData,
                                });
                              }}
                              color={medium.color}
                              style={styles.addIconStyle}
                            />
                            <Icon
                              name="delete"
                              size={22}
                              onPress={() => {
                                deleteTemplate(mediaData);
                              }}
                              color={medium.color}
                              style={styles.addIconStyle}
                            />
                          </View>
                        </View>
                      </React.Fragment>
                    ),
                )
              ) : (
                <Text
                  style={{
                    padding: 16,
                  }}>
                  Her hangi bir media mesaj şablonu eklememişsiniz! Lütfen
                  yukarıdaki artı butonunu kullanarak bir şablon ekleyin.
                </Text>
              )}
            </KeyboardAwareScrollView>
          </Card>
        </TabView.Item>
      </TabView>
    </>
  );
};

export default MessageTemplatesTabs;

const styles = StyleSheet.create({
  scrollView: {
    paddingRight: 15,
    paddingLeft: 15,
  },
  iconStyle: {
    marginLeft: 16,
  },
  addIconStyle: {
    marginRight: 16,
  },
  tabIndicator: {
    backgroundColor: primary.color,
    height: 2,
    padding: 0,
    margin: 0,
  },
  tabContainerStyle: {
    height: 30,
    width: Dimensions.get('window').width - 60,
    marginLeft: 15,
    padding: 0,
    margin: 0,
    paddingTop: 0,
  },
  tabTitle: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    zIndex: 99,
  },
  tabViewContainer: {width: '100%', height: 220},
  tabCardContainer: {
    minHeight: 220,
    paddingTop: 8,
    paddingLeft: 8,
    paddingBottom: 0,
    marginTop: 4,
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
  checkboxContainer: {padding: 0, margin: 0},
  checkboxText: {
    color: medium.color,
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    fontWeight: '500',
  },
  checkboxEditContainer: {display: 'flex', flexDirection: 'row'},
});
