/* eslint-disable react-hooks/exhaustive-deps */
import {Button, Icon, ListItem} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionButton from 'react-native-action-button-warnings-fixed';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {batch, useDispatch, useSelector} from 'react-redux';
import {
  light,
  medium,
  primary,
  primary2,
  secondary,
  tertiary,
} from '../../constants/styles/colors';
import {USER_MESSAGE_TEPMLATES} from '../../constants/typescript/user';
import {TemplateScreenProps} from '../../navigation/types';
import {useLazyGetUserMessageTemplatesQuery} from '../../store/api/userApi';
import {
  getUserStore,
  USER_MESSAGES_TEMPLATES_REPLACE,
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

  //Effects

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

  return (
    <>
      <View style={styles.appHeader}>
        <TouchableOpacity
          style={{position: 'absolute', left: 20, top: 20}}
          onPress={() => {
            navigation.pop();
          }}
          activeOpacity={0.8}>
          <Icon
            name="close"
            size={22}
            type="material-community"
            color={medium.color}
            style={{marginLeft: 8}}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.appHeaderText}>Mesaj Şablonları</Text>
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
                  <View
                    style={{marginTop: 16, paddingLeft: 16, paddingRight: 16}}>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('EditTemplate', {
                            template: key,
                          });
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          borderBottomWidth: 1,
                          borderColor: light.color,
                          height: 38,
                        }}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                          }}>
                          <Text
                            style={{
                              color: primary.color,
                              fontFamily: 'Montserrat-Medium',
                              fontSize: 14,
                              textTransform: 'capitalize',
                              fontWeight: '500',
                            }}>
                            {key.title}
                          </Text>
                          <Text
                            style={{
                              color: secondary.color,
                              fontFamily: 'Montserrat-Medium',
                              fontSize: 11,
                              fontWeight: '500',
                            }}>
                            {key.text.substring(0, 20)}...
                          </Text>
                          <Text
                            style={{
                              position: 'absolute',
                              right: 0,
                              top: 6,
                              color: primary2.color,
                              fontFamily: 'Montserrat-SemiBold',
                              fontSize: 11,
                              fontWeight: '500',
                            }}>
                            {key.type}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
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
    top: Dimensions.get('window').height - 140,
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
  appHeaderText: {
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
