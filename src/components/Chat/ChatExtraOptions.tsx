/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {Dimensions, Platform, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSelector} from 'react-redux';
import {medium, primary} from '../../constants/styles/colors';
import {getkeyboardEventsStore} from '../../store/slices/keyboard';
import AppButton from '../Elements/AppButton';

//Burası Main Function
const ChatExtraOptions = ({state}: any) => {
  const defaultY = 0;
  const trans = useSharedValue(defaultY);
  const AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: trans.value}],
    };
  });
  const keyboardEventsStore = useSelector(getkeyboardEventsStore);
  useEffect(() => {
    if (keyboardEventsStore.status && keyboardEventsStore.event !== null) {
      const heightWhenStateTrue = -(keyboardEventsStore.height + 54);
      const heightWhenStateFalse = defaultY;

      trans.value = withTiming(
        state ? heightWhenStateTrue : heightWhenStateFalse,
        {
          duration:
            Platform.OS === 'ios'
              ? keyboardEventsStore.event.duration + 50
              : 20,
        },
      );
    }
    if (!keyboardEventsStore.status && keyboardEventsStore.event !== null) {
      const heightWhenStateTrue = -74;
      const heightWhenStateFalse = defaultY;

      trans.value = withTiming(
        state ? heightWhenStateTrue : heightWhenStateFalse,
        {
          duration:
            Platform.OS === 'ios'
              ? keyboardEventsStore.event.duration + 50
              : 20,
        },
      );
    }
  }, [keyboardEventsStore]);
  useEffect(() => {
    const heightWhenKeyboardOpen = -(keyboardEventsStore.height + 54);
    const heightWhenKeyboardClose = -74;

    if (state) {
      trans.value = withTiming(
        keyboardEventsStore.status
          ? heightWhenKeyboardOpen
          : heightWhenKeyboardClose,
        {
          duration: 120,
        },
      );
    } else {
      trans.value = withTiming(defaultY, {
        duration: 120,
      });
    }
  }, [state]);
  const buttonsArray = [
    {
      icon: {
        name: 'camera',
        size: 15,
        color: medium.color,
        handler: () => {},
      },
    },
    {
      icon: {
        name: 'photo',
        size: 15,
        color: medium.color,
        handler: () => {},
      },
    },
    {
      icon: {
        name: 'close',
        size: 15,
        color: medium.color,
        handler: () => {},
      },
    },
    {
      icon: {
        name: 'close',
        size: 15,
        color: medium.color,
        handler: () => {},
      },
    },
  ];

  return (
    <Animated.View style={[AnimatedStyle, styles.extraContainer]}>
      {buttonsArray.map((key: any, index: any) => (
        <React.Fragment key={'Fragment' + index}>
          <AppButton icon={key.icon} style={[styles.buttonStyle]} />
        </React.Fragment>
      ))}
    </Animated.View>
  );
};
export default ChatExtraOptions;

const styles = StyleSheet.create({
  listItemContent: {
    flex: 1,
    height: 30,
  },
  buttonStyle: {
    width: 45,
    borderRadius: 0,
    maxHeight: 45,
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    marginRight: 16,
  },
  name: {
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    fontWeight: '600',
  },
  headerListItemContainer: {
    marginLeft: 24,
    width: Dimensions.get('window').width - 72,
    flexDirection: 'row',
    alignContent: 'center',
  },
  status: {
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    fontSize: 11,
    fontWeight: '400',
  },
  extraContainer: {
    zIndex: 3, // works on ios
    elevation: 3,
    backgroundColor: primary.color,
    width: 180,
    height: 45,
    opacity: 1,
    position: 'absolute',
    bottom: 0,
    left: 24,
    flexDirection: 'row',
    borderRadius: 12,
  },
});
