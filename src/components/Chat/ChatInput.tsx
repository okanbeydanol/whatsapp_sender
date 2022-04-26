/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AppTextInput from '../Elements/AppTextInput';
import Extra from '../../assets/images/icons/extra.svg';
import CloseExtra from '../../assets/images/icons/close-extra.svg';
import Camera from '../../assets/images/icons/camera.svg';
import Send from '../../assets/images/icons/send.svg';
import ChatExtraOptions from './ChatExtraOptions';
import {useDispatch, useSelector} from 'react-redux';
import {getkeyboardEventsStore} from '../../store/slices/keyboard';
import useSocketBrain from '../../hooks/useSocketBrain';
import {slice_user_retrive_message_update} from '../../store/slices/socket/socket-brain';
//Burası Main Function
const ChatInput = ({nounGuid, friendGuid}: any) => {
  const socketBrain = useSocketBrain();
  const dispatch = useDispatch();

  const onPressSend = async () => {
    const data = await socketBrain.user_send_message({
      type: 'text',
      nounGuid: nounGuid,
      text: inputRef.current?.value,
      friendGuid: friendGuid,
    });
    dispatch(slice_user_retrive_message_update(data));
  };
  // socketBrain.getUserStatus(nounGuid);

  const keyboardEventsStore = useSelector(getkeyboardEventsStore);
  useEffect(() => {
    if (keyboardEventsStore && keyboardEventsStore.event !== null) {
      trans.value = withTiming(-keyboardEventsStore.height + 16, {
        duration:
          Platform.OS === 'ios' ? keyboardEventsStore.event.duration + 50 : 20,
      });
    }
    if (!keyboardEventsStore.status && keyboardEventsStore.event !== null) {
      trans.value = withTiming(0, {
        duration:
          Platform.OS === 'ios' ? keyboardEventsStore.event.duration + 50 : 20,
      });
    }
  }, [keyboardEventsStore]);

  const [state, setState] = useState(false);
  const trans = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: trans.value}],
    };
  });
  const inputRef: any = useRef<TextInput>(null);
  return (
    <>
      <ChatExtraOptions state={state} setState={setState} />
      <View style={[styles.chatInputContainer]}>
        <Animated.View style={[styles.chatInutAnimate, animatedStyles]}>
          <AppTextInput
            onChangeText={(val: string) => {
              inputRef.current.value = val;
            }}
            multiline={true}
            innerRef={inputRef}
            style={styles.chatInput}
          />
          <TouchableOpacity
            style={styles.extraOption}
            onPress={() => {
              setState(!state);
            }}
            activeOpacity={0.7}>
            {state ? (
              <CloseExtra style={styles.extraOptionIcon} />
            ) : (
              <Extra tyle={styles.extraCloseOptionIcon} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.camera}
            onPress={() => {}}
            activeOpacity={0.7}>
            <Camera />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.send}
            onPress={onPressSend}
            activeOpacity={0.7}>
            <Send />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
};
export default ChatInput;

const styles = StyleSheet.create({
  chatInputContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: Platform.OS === 'ios' ? 74 : 56,
    bottom: 0,
    zIndex: 4, // works on ios
    elevation: 4,
  },
  chatInutAnimate: {
    marginTop: 8,
    backgroundColor: '#fff',
    paddingBottom: 6,
  },
  chatInput: {
    height: 44,
    width: Dimensions.get('window').width - 30,
    marginLeft: 15,
    borderRadius: 49.5,
    paddingStart: 40,
    paddingEnd: 68,
    paddingTop: 14,
  },
  extraOptionIcon: {
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  extraOption: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 32,
    position: 'absolute',
    bottom: 10,
    left: 16,
  },
  extraCloseOptionIcon: {
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  send: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 36,
    height: 32,
    bottom: 12,
    right: 0,
  },
  camera: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 36,
    height: 32,
    bottom: 12,
    right: 36,
  },
});
