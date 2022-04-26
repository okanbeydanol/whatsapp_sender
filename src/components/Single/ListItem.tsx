import React from 'react';
import {
  delivered,
  medium,
  primary,
  secondary,
  tertiary,
} from '../../constants/styles/colors';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ListItem} from '@rneui/themed';
import profileImage from '../../assets/images/blank-profile.png';
//Burası Main Function
const SingleListItem = ({navigation, friendGuid, nounGuid, item}: any) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ChatScreen', {
            nounGuid: nounGuid,
            friendGuid: friendGuid,
          });
        }}
        activeOpacity={0.7}>
        <ListItem bottomDivider>
          <Image
            style={styles.avatar}
            source={
              item.nounInfo !== null && item.nounInfo.image === null
                ? profileImage
                : {uri: 'data:image/jpeg;base64,' + item.nounInfo.image}
            }
          />
          <ListItem.Content style={styles.listItemContent}>
            <View style={styles.leftContainer}>
              <ListItem.Title style={styles.name}>
                {item.nounInfo.fullName}
              </ListItem.Title>
              {item.lastMessage !== null && (
                <ListItem.Subtitle>
                  {item.lastMessage.nounGuid !== item.ownerGuid && (
                    <View style={styles.messageViewContiner}>
                      {item.lastMessage.delivered ? (
                        <View style={styles.messageView} />
                      ) : (
                        <View style={styles.messageViewGrey} />
                      )}
                      {item.lastMessage.delivered &&
                      item.lastMessage.readStatus ? (
                        <View style={styles.messageView} />
                      ) : (
                        <View style={styles.messageViewGrey} />
                      )}
                    </View>
                  )}
                  {/* Burası Typelara göre ayır */}
                  {item.lastMessage.type === 'text' ? (
                    <Text style={styles.message}> {item.lastMessage.text}</Text>
                  ) : (
                    <Text style={styles.message}> {item.lastMessage.text}</Text>
                  )}
                </ListItem.Subtitle>
              )}
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.time}>11:23</Text>
              {item.unreadMessageCount !== 0 && (
                <View style={styles.messageCountView}>
                  <Text style={styles.messageCount}>
                    {item.unreadMessageCount}
                  </Text>
                </View>
              )}
            </View>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    </>
  );
};
export default SingleListItem;

const styles = StyleSheet.create({
  listItemContent: {
    height: 66,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    height: '100%',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    height: '100%',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
  },
  name: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    textTransform: 'capitalize',
    fontWeight: '600',
    marginBottom: 6,
  },
  messageViewContiner: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    width: 16,
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
  message: {
    color: secondary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 11,
    fontWeight: '400',
  },
  messageCount: {
    color: medium.color,
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
  },
  messageCountView: {
    width: 40,
    height: 19,
    borderRadius: 8.5,
    backgroundColor: tertiary.color,
    alignContent: 'center',
    justifyContent: 'center',
  },
  time: {
    color: secondary.color,
    fontFamily: 'Montserrat-Medium',
    fontSize: 9,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 6,
  },
});
