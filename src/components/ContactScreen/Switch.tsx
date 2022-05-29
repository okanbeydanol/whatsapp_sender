import React, {useState} from 'react';
import {Text, View, Pressable, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {primary, secondary} from '../../constants/styles/colors';

const Switch = ({state}: any) => {
  const {
    text1 = 'Option 1',
    text2 = 'Option 2',
    space = 0,
    marginLeft = 0,
    switchChange = () => {},
    height = 42,
    backgroundColor = secondary.color,
    backgroundColorSwitch = primary.color,
    borderColor = 'transparent',
    borderColorSwitch = 'transparent',
    width = null,
    status = null,
    key = null,
  } = state;

  const [switchStatus, setSwitchStatus] = useState(status);

  const translateXItem = useSharedValue(
    switchStatus
      ? width !== null
        ? width / 2
        : (Dimensions.get('window').width - space * 2) / 2
      : 0,
  );
  const scale = useSharedValue(1);
  const translateXItemStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateXItem.value}, {scale: scale.value}],
    };
  });

  const changeSwitchStatus = () => {
    if (switchStatus) {
      translateXItem.value = withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.exp),
      });
      scale.value = withSequence(
        withTiming(0.9, {
          duration: 200,
          easing: Easing.out(Easing.exp),
        }),
        withTiming(1, {
          duration: 300,
          easing: Easing.out(Easing.exp),
        }),
      );
      setSwitchStatus(false);
      switchChange({key: key, status: false});
      return;
    }
    translateXItem.value = withTiming(
      width !== null
        ? width / 2
        : (Dimensions.get('window').width - space * 2) / 2,
      {
        duration: 600,
        easing: Easing.out(Easing.exp),
      },
    );
    scale.value = withSequence(
      withTiming(0.9, {
        duration: 200,
        easing: Easing.out(Easing.exp),
      }),
      withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      }),
    );
    setSwitchStatus(true);
    switchChange({key: key, status: true});
    return;
  };

  return (
    <Pressable
      onPress={changeSwitchStatus}
      style={[
        {
          width:
            width !== null ? width : Dimensions.get('window').width - space * 2,
          marginLeft: marginLeft,
        },
      ]}>
      <View
        style={[
          styles.switchViewContainer,
          {
            height: height,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
          },
        ]}>
        <Animated.View
          style={[
            translateXItemStyle,
            styles.switchAnimatedView,
            {
              width:
                width !== null
                  ? width / 2
                  : (Dimensions.get('window').width - space * 2) / 2,
              height: height,
              backgroundColor: backgroundColorSwitch,
              borderColor: borderColorSwitch,
            },
          ]}
        />
        <View
          style={[
            styles.textContainer,
            {
              width:
                width !== null
                  ? width
                  : Dimensions.get('window').width - space * 2,
            },
          ]}>
          <Text style={styles.switchText1}>{text1}</Text>
          <Text style={styles.switchText2}>{text2}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switchViewContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
  },
  switchAnimatedView: {
    borderRadius: 8,
    borderWidth: 1,
    position: 'absolute',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  switchText1: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
  switchText2: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
});

export default Switch;
