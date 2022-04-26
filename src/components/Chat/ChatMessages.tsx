/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Image from 'react-native-scalable-image';

import {useSelector} from 'react-redux';
import {delivered} from '../../constants/styles/colors';
import {listen_slice_user_retrive_messages} from '../../store/slices/socket/socket-brain';

//Burası Main Function
const ChatMessages = ({nounGuid, friendGuid}: any) => {
  const retriveMessages: any = useSelector(listen_slice_user_retrive_messages);
  console.log(
    '%c  retriveMessages',
    'background: #222; color: #bada55',
    retriveMessages,
  );
  const styles = StyleSheet.create({
    messageViewContiner: {
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      width: 16,
      marginRight: 22,
      marginTop: 7,
    },
    messageView: {
      width: 4,
      height: 4,
      borderRadius: 12,
      backgroundColor: '#6ADF84',
      alignContent: 'center',
      justifyContent: 'center',
      marginRight: 2,
    },
    messageViewGrey: {
      width: 4,
      height: 4,
      borderRadius: 12,
      backgroundColor: delivered.color,
      alignContent: 'center',
      justifyContent: 'center',
      marginRight: 2,
    },
    dMediaContainer: {
      marginTop: 12,
      borderRadius: 20,
    },
    dMedia: {
      borderRadius: 20,
    },
    dTextContainer: {
      backgroundColor: '#141E4B',
      minWidth: 260,
      width: Dimensions.get('window').width - 90,
      borderBottomLeftRadius: 15,
      borderTopLeftRadius: 15,
      minHeight: 48,
      borderBottomRightRadius: 22,
      borderTopRightRadius: 5,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginTop: 12,
    },
    dText: {
      color: '#FFFFFF',
      fontFamily: 'Montserrat-Medium',
      fontSize: 12,
      fontWeight: '400',
    },
    dTextTime: {
      color: '#FFFFFF',
      fontFamily: 'Montserrat-Medium',
      fontSize: 9,
      fontWeight: '400',
      position: 'absolute',
      right: 27,
      bottom: 10,
    },
    dContactContainer: {
      marginTop: 12,
      borderRadius: 20,
    },
    dContact: {
      borderRadius: 20,
    },
    senderContainer: {
      alignItems: 'flex-end',
      width: '100%',
    },
  });
  return (
    <>
      <View>
        {retriveMessages.map((key: any, index: any) => (
          <React.Fragment key={'Fragment' + index}>
            {key.nounGuid === nounGuid && (
              <>
                <View style={styles.senderContainer}>
                  {key.type === 'text' ? (
                    <View style={styles.dTextContainer}>
                      <Text style={styles.dText}>{key.text}</Text>
                      <Text style={styles.dTextTime}>12:45</Text>
                    </View>
                  ) : key.type === 'media' ? (
                    <View style={styles.dMediaContainer}>
                      <Image
                        width={Dimensions.get('window').width - 90}
                        style={styles.dMedia}
                        source={{
                          uri: key.media,
                        }}
                      />
                    </View>
                  ) : key.type === 'contact' ? (
                    <View style={styles.dMediaContainer}></View>
                  ) : (
                    <Text>Gelmedii</Text>
                  )}

                  <View style={styles.messageViewContiner}>
                    {key.delivered ? (
                      <View style={styles.messageView} />
                    ) : (
                      <View style={styles.messageViewGrey} />
                    )}
                    {key.delivered && key.readStatus ? (
                      <View style={styles.messageView} />
                    ) : (
                      <View style={styles.messageViewGrey} />
                    )}
                  </View>
                </View>
              </>
            )}
          </React.Fragment>
        ))}
      </View>
    </>
  );
};
export default ChatMessages;
