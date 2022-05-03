/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppHeader from '../../components/Header/AppHeader';
import {medium, primary, secondary} from '../../constants/styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDBContactsStore} from '../../store/slices/dbContacts';
import AppTextInput from '../../components/Elements/AppTextInput';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import AppFlag from '../../components/Elements/AppFlag';
import {ListItem, Button, Tab, TabView, CheckBox, Icon} from '@rneui/themed';

const CreateList = ({navigation}: any) => {
  const dispatch = useDispatch();
  const contacts = useSelector(getDBContactsStore);
  const radioButtonsData = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Option 1',
      value: 'option1',
    },
    {
      id: '2',
      label: 'Option 2',
      value: 'option2',
    },
    {
      id: '3',
      label: 'Option 3',
      value: 'option3',
    },
    {
      id: '4',
      label: 'Option 4',
      value: 'option4',
    },
    {
      id: '5',
      label: 'Option 5',
      value: 'option5',
    },
    {
      id: '6',
      label: 'Option 6',
      value: 'option6',
    },
    {
      id: '7',
      label: 'Option 7',
      value: 'option7',
    },
    {
      id: '8',
      label: 'Option 8',
      value: 'option8',
    },
  ];
  const radioButtonsData2 = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Option 1',
      value: 'option1',
    },
    {
      id: '2',
      label: 'Option 2',
      value: 'option2',
    },
    {
      id: '3',
      label: 'Option 3',
      value: 'option3',
    },
    {
      id: '4',
      label: 'Option 4',
      value: 'option4',
    },
  ];
  const [radioButtons, setRadioButtons]: any = useState(radioButtonsData);
  const [radioButtons2, setRadioButtons2]: any = useState(radioButtonsData2);
  const [selecTabIndex, setSelecTabIndex] = useState(0);
  let ref: any = useRef();
  const closePress = () => {
    navigation.pop();
  };
  const onPressRadioButton = (radioButtonsArray: RadioButtonProps[]) => {
    setRadioButtons(radioButtonsArray);
  };
  const onPressRadioButton2 = (radioButtonsArray: RadioButtonProps[]) => {
    setRadioButtons2(radioButtonsArray);
  };
  const [check4, setCheck4] = useState(false);

  const [index, setIndex] = React.useState(0);
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
      <KeyboardAwareScrollView
        keyboardOpeningTime={0}
        extraScrollHeight={0}
        extraHeight={0}
        ref={ref}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}
        contentContainerStyle={[styles.scrollView]}
        enableAutomaticScroll={false}
        enableResetScrollToCoords={false}>
        <View style={styles.listPageTitleWrapper}>
          <Text style={styles.listPageTitle}>Create a List</Text>
        </View>
        <View style={styles.ListTitleWrapper}>
          <Text style={styles.ListTitle}>List Title</Text>
        </View>

        <View style={styles.ListInputWrapper}>
          <AppTextInput placeholder="Please enter a list title..." />
        </View>
        <View style={styles.listMessageTemplateWrapper}>
          <Text style={styles.listMessageTemplate}>Message Template</Text>
        </View>
        <View style={{height: 240}}>
          <Tab
            value={index}
            onChange={e => setIndex(e)}
            indicatorStyle={{
              backgroundColor: primary.color,
              height: 5,
            }}
            containerStyle={{
              height: 56,
              width: Dimensions.get('window').width - 48,
              marginLeft: 16,
            }}
            variant="primary">
            <Tab.Item
              title="Text"
              titleStyle={{fontSize: 12}}
              icon={{name: 'text', type: 'ionicon', color: 'white'}}
            />
            <Tab.Item
              title="media"
              titleStyle={{fontSize: 12}}
              icon={{name: 'play', type: 'ionicon', color: 'white'}}
            />
          </Tab>

          <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={{width: '100%', height: 174}}>
              <KeyboardAwareScrollView
                keyboardOpeningTime={0}
                extraScrollHeight={0}
                extraHeight={0}
                ref={ref}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                persistentScrollbar={false}
                contentContainerStyle={[styles.scrollView]}
                enableAutomaticScroll={false}
                enableResetScrollToCoords={false}>
                <CheckBox
                  title="Click Here"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={check4}
                  onPress={() => setCheck4(!check4)}
                />
                <CheckBox
                  title="Click Here"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={check4}
                  onPress={() => setCheck4(!check4)}
                />
              </KeyboardAwareScrollView>
            </TabView.Item>
            <TabView.Item style={{width: '100%', height: 174}}>
              <KeyboardAwareScrollView
                keyboardOpeningTime={0}
                extraScrollHeight={0}
                extraHeight={0}
                ref={ref}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                persistentScrollbar={false}
                contentContainerStyle={[styles.scrollView]}
                enableAutomaticScroll={false}
                enableResetScrollToCoords={false}>
                <Text>Favorite</Text>
                <Text>Favorite</Text>
                <Text>Favorite</Text>
                <Text>Favorite</Text>
                <Text>Favorite</Text>
                <Text>Favorite</Text>
              </KeyboardAwareScrollView>
            </TabView.Item>
          </TabView>
        </View>
        <View style={styles.listAddContactWrapper}>
          <Text style={styles.listAddContact}>Add Contact</Text>
          <Icon
            name="add"
            size={26}
            color={medium.color}
            style={styles.addIconStyle}
          />
        </View>
        <View style={styles.listAddContactWrapper}>
          <Text style={styles.listAddContactEmpty}>
            There is no added contact
          </Text>
        </View>
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
              buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
            />
          )}>
          <Icon name="people" />
          <ListItem.Content>
            <ListItem.Title>Hello Swiper</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem.Swipeable>
      </KeyboardAwareScrollView>
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
  tabsContainerStyle: {
    paddingBottom: 16,
    paddingRight: 16,
    paddingLeft: 16,
  },
  Tab1: {
    paddingRight: 15,
    paddingLeft: 15,
    display: 'flex',
    alignItems: 'flex-start',
    paddingBottom: 16,
  },
  Tab2: {
    paddingRight: 15,
    paddingLeft: 15,
    display: 'flex',
    alignItems: 'flex-start',
    paddingBottom: 16,
  },
  radioGroup: {},
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
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 8,
  },
  listMessageTemplate: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    fontWeight: '600',
  },
  ListTitleWrapper: {
    alignItems: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
  },
  ListTitle: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
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
  },
  appHeader: {
    height: 0,
  },
});
