/* eslint-disable react-hooks/exhaustive-deps */
import {Button, ListItem} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ActionButton from 'react-native-action-button-warnings-fixed';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {batch, useDispatch, useSelector} from 'react-redux';
import {
  light,
  primary,
  primary2,
  secondary,
  tertiary,
} from '../../constants/styles/colors';
import {USER_MESSAGE_TEPMLATES} from '../../constants/typescript/user';
import {TemplateScreenProps} from '../../navigation/types';
import {
  useLazyDeleteUserMessageTemplatesQuery,
  useLazyGetUserMessageTemplatesQuery,
} from '../../store/api/userApi';
import {
  getUserStore,
  USER_MESSAGES_TEMPLATES_REPLACE,
  USER_MESSAGES_TEMPLATE_DELETE,
} from '../../store/slices/user';

const TemplatesScreen = ({
  navigation,
}: TemplateScreenProps<'TemplatesScreen'>) => {
  //Dispatch
  const dispatch = useDispatch();

  //States
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  //Selectors
  const userStore = useSelector(getUserStore);

  //Queries
  const [get_templates_trigger, get_templates] =
    useLazyGetUserMessageTemplatesQuery();
  const [triggerDeleteUserTemplate, delete_user_template] =
    useLazyDeleteUserMessageTemplatesQuery();

  //Effects
  //delete_user_template isSuccess
  useEffect(() => {
    if (
      typeof delete_user_template.data !== 'undefined' &&
      delete_user_template.isSuccess &&
      !delete_user_template.isFetching
    ) {
      batch(() => {
        dispatch(USER_MESSAGES_TEMPLATE_DELETE(delete_user_template.data));
      });
    }
  }, [delete_user_template.isFetching, delete_user_template.isSuccess]);

  //get_templates isSuccess
  useEffect(() => {
    if (
      typeof get_templates.data !== 'undefined' &&
      get_templates.isSuccess &&
      !get_templates.isFetching &&
      !loading
    ) {
      batch(() => {
        dispatch(USER_MESSAGES_TEMPLATES_REPLACE(get_templates.data));
        setRefreshing(false);
      });
    }
  }, [get_templates.isFetching, get_templates.isSuccess]);

  //Functions
  //Opens Create Template Screen
  const addNewTemplate = () => {
    navigation.navigate('CreateTemplate');
  };

  //Refreshes Templates
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    get_templates_trigger({user_guid: userStore.user_guid});
  }, []);

  //Deletes Template
  const deleteTemplate = (template: USER_MESSAGE_TEPMLATES) => {
    Alert.alert('Sil!', 'Şablonu silmek istediğinize emin misiniz?', [
      {
        text: 'Evet',
        onPress: () => {
          triggerDeleteUserTemplate({
            user_guid: userStore.user_guid,
            message_template_guid: template.message_template_guid,
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
      <View style={styles.appHeader}>
        <View>
          <Text style={styles.appText}>Mesaj Şablonları</Text>
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
          {userStore.message_templates &&
            userStore.message_templates.map(
              (key: USER_MESSAGE_TEPMLATES, index: any) => (
                <React.Fragment key={'Fragment' + index}>
                  <View style={styles.messageTemplatesContainer}>
                    <ListItem.Swipeable
                      rightContent={reset => (
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                          <View style={{width: '50%'}}>
                            <Button
                              onPress={() => {
                                navigation.navigate('EditTemplate', {
                                  template: key,
                                });
                                reset();
                              }}
                              icon={{name: 'edit', color: 'white'}}
                              buttonStyle={styles.swipeableButton2}
                            />
                          </View>
                          <View style={{width: '50%'}}>
                            <Button
                              onPress={() => {
                                deleteTemplate(key);
                                reset();
                              }}
                              icon={{name: 'delete', color: 'white'}}
                              buttonStyle={styles.swipeableButton}
                            />
                          </View>
                        </View>
                      )}>
                      <ListItem.Content
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View>
                          <ListItem.Title>{key.title}</ListItem.Title>
                          <ListItem.Title
                            style={{
                              color: secondary.color,
                              fontFamily: 'Montserrat-SemiBold',
                              fontSize: 14,
                              fontWeight: '600',
                            }}>
                            {key.text.substring(0, 20)}...
                          </ListItem.Title>
                        </View>
                        <View>
                          <Text>{key.type}</Text>
                        </View>
                      </ListItem.Content>
                      <ListItem.Chevron />
                    </ListItem.Swipeable>
                  </View>
                </React.Fragment>
              ),
            )}
        </KeyboardAwareScrollView>
      )}
      <View style={styles.addNewTemplate}>
        <ActionButton onPress={addNewTemplate} buttonColor={primary.color} />
      </View>
    </>
  );
};

export default TemplatesScreen;

const styles = StyleSheet.create({
  addNewTemplate: {
    backgroundColor: '#f3f3f3',
    position: 'absolute',
    right: 0,
    top: Dimensions.get('window').height - 212,
  },
  swipeableButton: {
    minHeight: '100%',
    backgroundColor: 'red',
    width: 'auto',
    borderRadius: 0,
  },
  swipeableButton2: {
    minHeight: '100%',
    backgroundColor: primary2.color,
    width: 'auto',
    borderRadius: 0,
  },
  messageTemplatesContainer: {
    borderBottomWidth: 1,
    borderColor: light.color,
  },
  scrollView: {},
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
  appText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    fontWeight: '500',
    color: tertiary.color,
  },
  header: {
    backgroundColor: primary.color,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
});
