/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef} from 'react';
import {
  EmitterSubscription,
  Keyboard,
  KeyboardEvent,
  Platform,
  StyleSheet,
} from 'react-native';
import AppHeader from '../../components/Header/AppHeader';
import ChatHeader from '../../components/Header/ChatHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ChatInput from '../../components/Chat/ChatInput';
import useSocketBrain from '../../hooks/useSocketBrain';
import ChatMessages from '../../components/Chat/ChatMessages';
import {useDispatch, useSelector} from 'react-redux';
import {getLoginStore} from '../../store/slices/login';

const ChatScreen = ({route, navigation}: any) => {
  navigation.addListener('beforeRemove', async () => {});
  const {nounGuid, friendGuid} = route.params;
  const socketBrain = useSocketBrain();
  const loginStore = useSelector(getLoginStore);
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(async () => {
      await socketBrain.user_get_messages(nounGuid);
      await socketBrain.user_get_status(nounGuid);
      socketBrain.user_send_read_info({
        nounGuid: nounGuid,
        friendGuid: friendGuid,
      });
    }, 10);
  });
  //const insets = useSafeAreaInsets();
  let ref: any = useRef();
  const trans = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: trans.value}],
    };
  });
  useEffect(() => {
    const keyboardListenerHide: EmitterSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (event: KeyboardEvent) => {
        keyboardHide(event);
      },
    );
    const keyboardListenerShow: EmitterSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event: KeyboardEvent) => {
        keyboardShow(event);
      },
    );
    // setTimeout(() => {
    //   ref.current.scrollToEnd(false);
    // }, 120);
    return () => {
      keyboardListenerHide.remove();
      keyboardListenerShow.remove();
    };
  }, []);
  const keyboardShow = (event: KeyboardEvent) => {
    trans.value = withTiming(-event.endCoordinates.height + 16, {
      duration: Platform.OS === 'ios' ? event.duration + 50 : 20,
    });
    setTimeout(() => {
      ref.current.scrollToEnd(false);
    }, 100);
  };
  const keyboardHide = (event: KeyboardEvent) => {
    trans.value = withTiming(0, {
      duration: Platform.OS === 'ios' ? event.duration + 50 : 20,
    });
    setTimeout(() => {
      ref.current.scrollToEnd(false);
    }, 100);
  };

  return (
    <>
      <AppHeader style={styles.appHeader} />
      <ChatHeader
        navigation={navigation}
        nounGuid={nounGuid}
        friendGuid={friendGuid}
      />
      <KeyboardAwareScrollView
        keyboardOpeningTime={250}
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
        <Animated.View style={[styles.chatContainer, animatedStyles]}>
          <ChatMessages nounGuid={nounGuid} friendGuid={friendGuid} />
        </Animated.View>
      </KeyboardAwareScrollView>
      <ChatInput nounGuid={nounGuid} friendGuid={friendGuid} />
    </>
  );
};

export default ChatScreen;
const styles = StyleSheet.create({
  chatContainer: {
    marginBottom: 74,
  },

  scrollView: {
    paddingRight: 15,
    paddingLeft: 15,
  },
  appHeader: {
    height: 0,
  },
});
