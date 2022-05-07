import {Button, ListItem} from '@rneui/themed';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ActionButton from 'react-native-action-button-warnings-fixed';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import {light, primary, tertiary} from '../../constants/styles/colors';
import {USER_MESSAGE_TEPMLATES} from '../../constants/typescript/user';
import {getUserStore} from '../../store/slices/user';

const TemplatesScreen = ({navigation}: any) => {
  const [loading, setLoading] = useState(true);
  const userStore = useSelector(getUserStore);
  const addNewTemplate = () => {
    navigation.navigate('CreateTemplate');
  };
  if (loading) {
    setLoading(false);
  }
  return (
    <>
      <View style={styles.appHeader}>
        <View>
          <Text style={styles.appText}>Templates</Text>
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
          enableResetScrollToCoords={false}>
          {userStore.message_templates &&
            userStore.message_templates.map(
              (key: USER_MESSAGE_TEPMLATES, index: any) => (
                <React.Fragment key={'Fragment' + index}>
                  <View style={styles.messageTemplatesContainer}>
                    <ListItem.Swipeable
                      rightContent={reset => (
                        <Button
                          title="Delete"
                          onPress={() => reset()}
                          icon={{name: 'delete', color: 'white'}}
                          buttonStyle={styles.swipeableButton}
                        />
                      )}>
                      <ListItem.Content>
                        <ListItem.Title>{key.title}</ListItem.Title>
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
    height: 40,
  },
});
