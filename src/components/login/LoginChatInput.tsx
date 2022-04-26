/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef} from 'react';
import {Dimensions, Image, StyleSheet, TextInput, View} from 'react-native';
import {medium, tertiary} from '../../constants/styles/colors';
//Burası Main Function
const LoginChatInput = ({onChangeText}: any) => {
  const inputRef: any = useRef<TextInput>(null);
  return (
    <>
      <View style={styles.chatInutAnimate}>
        <Image
          style={styles.searchImage}
          source={require('../../assets/images/search.png')}
        />
        <TextInput
          onChangeText={onChangeText}
          multiline={false}
          ref={inputRef}
          style={styles.chatInput}
        />
      </View>
    </>
  );
};
export default LoginChatInput;

const styles = StyleSheet.create({
  chatInutAnimate: {
    backgroundColor: '#fff',
    paddingBottom: 6,
  },
  chatInput: {
    marginTop: 8,
    height: 44,
    width: Dimensions.get('window').width - 30,
    marginLeft: 15,
    borderRadius: 12,
    paddingStart: 40,
    paddingEnd: 68,
    paddingTop: 10,
    backgroundColor: tertiary.color,
    color: medium.color,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchImage: {
    width: 18,
    height: 18,
    marginTop: 20,
    marginLeft: 30,
    zIndex: 2,
    position: 'absolute',
  },
});
