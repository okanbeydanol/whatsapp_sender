/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {batch, useDispatch, useSelector} from 'react-redux';

// Screens

// Login Screens
import LoginScreenNumber from '../screens/LoginScreen/login_number';
import LoginScreenNumberOtp from '../screens/LoginScreen/login_number_otp';
import LoginScreenNumberInfo from '../screens/LoginScreen/login_number_info';

// ContactScreen Screens
import ContactScreen from '../screens/ContactScreen';
import ChooseContact from '../screens/ContactScreen/ChooseContact';
import CreateList from '../screens/ContactScreen/CreateList';
import CreateTemplate from '../screens/TemplatesScreen/CreateTemplate';

// MainScreen Screens
import MainScreen from '../screens/MainScreen';

// SettingsScreen Screens
import TemplatesScreen from '../screens/TemplatesScreen';

// PermissionScreen Screens
import PermissionScreen from '../screens/PermissionScreen';

// Loading Screens
import LoadingScreen from '../screens/LoadingScreen';

import {
  LoginType,
  getLoginStore,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
} from '../store/slices/login';
import {getData, storeData} from '../utils/async-storage';
// import Sidebar from '../components/Sidebar';
import Lists from '../assets/images/tabs/lists.svg';
import ListsActive from '../assets/images/tabs/lists-active.svg';
import Templates from '../assets/images/tabs/templates.svg';
import TemplatesActive from '../assets/images/tabs/templates-active.svg';
import Timers from '../assets/images/tabs/timers.svg';
import TimersActive from '../assets/images/tabs/timers-active.svg';
import {View} from 'react-native';
import LoginCountryScreen from '../screens/LoginScreen/LoginCountryScreen';
import OneSignal from 'react-native-onesignal';
import {
  getAndroidId,
  getFingerprint,
  getUniqueId,
} from 'react-native-device-info';
import {DEVICEINFO_CHANGE} from '../store/slices/deviceInfo';
import {
  getPermissionsStore,
  PERMISSIONS_CHANGE,
} from '../store/slices/permissions';
import {
  canDisplayOverOtherApps,
  isAccessibilityOn,
} from 'react-native-accessibility-manager-plugin';

OneSignal.setLogLevel(6, 0);
OneSignal.setAppId('1b40bb5e-2ddb-4741-9346-0245c767d497');
export default function Navigation() {
  const dispatch = useDispatch();
  const navTheme = DefaultTheme;
  navTheme.colors.background = '#fff';

  useEffect(() => {
    const getUserGuid = async () => {
      let userGuid;
      try {
        userGuid = await getData('s[userGuid]');
      } catch (e) {
        // Restoring token failed
      }
      return userGuid;
    };
    setTimeout(async () => {
      const userGuid = await getUserGuid();
      const fingerprint = await getFingerprint();
      const androidId = await getAndroidId();
      const uniqueId = await getUniqueId();
      OneSignal.sendTags({
        uniqueId: uniqueId,
        fingerprint: fingerprint,
        androidId: androidId,
      });
      const deviceInfo = await getData('[deviceInfo]');
      if (deviceInfo === null) {
        storeData('[deviceInfo]', {
          uniqueId: uniqueId,
          fingerprint: fingerprint,
          androidId: androidId,
        });
      }
      const accessibility = await isAccessibilityOn();
      const displayOverOtherApps = await canDisplayOverOtherApps();
      storeData('[permissions]', {
        accessibility: accessibility,
        displayOverOtherApps: displayOverOtherApps,
      });
      batch(async () => {
        dispatch(
          DEVICEINFO_CHANGE({
            uniqueId: uniqueId,
            fingerprint: fingerprint,
            androidId: androidId,
          }),
        );
        if (userGuid === null) {
          dispatch(
            LOGIN_FAILED({
              type: LoginType.LOGIN_FAILED,
              userGuid: userGuid,
              loading: true,
            }),
          );
        } else {
          dispatch(
            LOGIN_SUCCESS({
              type: LoginType.LOGIN_SUCCESS,
              userGuid: userGuid,
              loading: true,
            }),
          );
        }
        dispatch(
          PERMISSIONS_CHANGE({
            accessibility: accessibility,
            displayOverOtherApps: displayOverOtherApps,
          }),
        );
      });
    }, 10);
  }, [dispatch]);
  // useEffect(() => {
  //   if (Platform.OS === 'ios') {
  //     const keyboardListenerWillHide: EmitterSubscription =
  //       Keyboard.addListener('keyboardWillHide', (event: KeyboardEvent) => {
  //         dispatch(
  //           KEYBOARD_EVENT_CHANGE({
  //             type: 'keyboardWillHide',
  //             event: event,
  //           }),
  //         );
  //       });
  //     const keyboardListenerWillShow: EmitterSubscription =
  //       Keyboard.addListener('keyboardWillShow', (event: KeyboardEvent) => {
  //         dispatch(
  //           KEYBOARD_EVENT_CHANGE({
  //             type: 'keyboardWillShow',
  //             event: event,
  //           }),
  //         );
  //       });
  //     return () => {
  //       keyboardListenerWillHide.remove();
  //       keyboardListenerWillShow.remove();
  //     };
  //   } else {
  //     const keyboardListenerDidHide: EmitterSubscription = Keyboard.addListener(
  //       'keyboardDidHide',
  //       (event: KeyboardEvent) => {
  //         dispatch(
  //           KEYBOARD_EVENT_CHANGE({
  //             type: 'keyboardDidHide',
  //             event: event,
  //           }),
  //         );
  //       },
  //     );
  //     const keyboardListenerDidShow: EmitterSubscription = Keyboard.addListener(
  //       'keyboardDidShow',
  //       (event: KeyboardEvent) => {
  //         dispatch(
  //           KEYBOARD_EVENT_CHANGE({
  //             type: 'keyboardDidShow',
  //             event: event,
  //           }),
  //         );
  //       },
  //     );
  //     return () => {
  //       keyboardListenerDidHide.remove();
  //       keyboardListenerDidShow.remove();
  //     };
  //   }
  // }, [dispatch]);

  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}
const Stack = createNativeStackNavigator(); // createStackNavigator https://reactnavigation.org/docs/stack-navigator
const SingleStack = createNativeStackNavigator();
const GroupStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const LoadingStack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const RootNavigator = () => {
  const permissions = useSelector(getPermissionsStore);
  // const {navigate} = useNavigation();
  const loginStore = useSelector(getLoginStore);
  useEffect(() => {
    if (loginStore.type === LoginType.LOGIN_SUCCESS) {
      setTimeout(async () => {
        storeData('s[userGuid]', loginStore.userGuid);
      }, 10);
    }
  }, [loginStore.type]);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {loginStore.type === LoginType.LOGIN_SUCCESS ? (
        permissions.accessibility && permissions.displayOverOtherApps ? (
          <Stack.Group>
            <Stack.Screen name="Root" component={TabNavigator} />
            <Stack.Screen
              options={{animation: 'slide_from_right'}}
              name="CreateList"
              component={CreateList}
            />
            <Stack.Screen
              options={{animation: 'slide_from_right'}}
              name="CreateTemplate"
              component={CreateTemplate}
            />
            <Stack.Screen
              options={{animation: 'slide_from_right'}}
              name="ChooseContact"
              component={ChooseContact}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen
              name="PermissionScreen"
              component={PermissionScreen}
            />
          </Stack.Group>
        )
      ) : loginStore.type === LoginType.LOGIN_FAILED ? (
        <Stack.Group>
          <Stack.Screen
            name="LoginScreenNumber"
            component={LoginScreenNumber}
          />
          <Stack.Screen
            name="LoginScreenNumberOtp"
            component={LoginScreenNumberOtp}
          />
          <Stack.Screen
            name="LoginScreenNumberInfo"
            component={LoginScreenNumberInfo}
          />
        </Stack.Group>
      ) : (
        <Stack.Screen name="Loading" component={LoadingStackNavigator} />
      )}
      <Stack.Group
        screenOptions={{
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom',
        }}>
        <Stack.Screen name="CountriesModal" component={LoginCountryScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Single"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused}) => {
          let iconName: any;
          if (route.name === 'Group') {
            iconName = focused ? (
              <View style={{width: 32}}>
                <ListsActive />
              </View>
            ) : (
              <View style={{width: 32}}>
                <Lists />
              </View>
            );
          } else if (route.name === 'Single') {
            iconName = focused ? (
              <View style={{width: 32}}>
                <TimersActive />
              </View>
            ) : (
              <View style={{width: 32}}>
                <Timers />
              </View>
            );
          } else if (route.name === 'Templates') {
            iconName = focused ? (
              <View style={{width: 32}}>
                <TemplatesActive />
              </View>
            ) : (
              <View style={{width: 32}}>
                <Templates />
              </View>
            );
          }
          return iconName;
        },
        tabBarShowLabel: false,
        tabBarStyle: {height: 74},
      })}>
      <Tab.Screen name="Group" component={GroupStackNavigator} />
      {/* <Tab.Screen
        name="Single"
        component={SingleStackNavigator}
        options={
          {
            //tabBarBadge: 1,
          }
        }
      /> */}
      <Tab.Screen name="Templates" component={TemplatesStackNavigator} />
    </Tab.Navigator>
  );
};

function GroupStackNavigator() {
  return (
    <GroupStack.Navigator screenOptions={{headerShown: false}}>
      <GroupStack.Screen
        options={{animation: 'slide_from_right'}}
        name="ContactScreen"
        component={ContactScreen}
      />
    </GroupStack.Navigator>
  );
}

function SingleStackNavigator() {
  return (
    <SingleStack.Navigator screenOptions={{headerShown: false}}>
      <SingleStack.Screen name="MainScreen" component={MainScreen} />
    </SingleStack.Navigator>
  );
}
function TemplatesStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{headerShown: false}}>
      <SettingsStack.Screen
        name="TemplatesScreen"
        component={TemplatesScreen}
      />
    </SettingsStack.Navigator>
  );
}

function LoadingStackNavigator() {
  return (
    <LoadingStack.Navigator screenOptions={{headerShown: false}}>
      <LoadingStack.Screen
        options={{animation: 'fade'}}
        name="LoadingScreen"
        component={LoadingScreen}
      />
    </LoadingStack.Navigator>
  );
}

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         headerShown: false,
//         drawerType: 'front',
//         drawerPosition: 'left',
//       }}
//       drawerContent={() => <Sidebar label="DenemeHome" />}
//       initialRouteName="DrawerHome">
//       <Drawer.Screen name="Root" component={TabNavigator} />
//     </Drawer.Navigator>
//   );
// };
