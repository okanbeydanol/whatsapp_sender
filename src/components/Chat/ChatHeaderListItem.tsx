/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar} from '@rneui/themed';
import profileImage from '../../assets/images/blank-profile.png';
import {useSelector} from 'react-redux';
import {listen_slice_user_retrive_status} from '../../store/slices/socket/socket-brain';

//Burası Main Function
const ChatHeaderListItem = ({nounGuid, friendGuid}: any) => {
  const retriveStatus: any = useSelector(listen_slice_user_retrive_status);
  const [state, setState]: any = useState({fullName: '', status: 0});
  useEffect(() => {
    if (retriveStatus.nounGuid === nounGuid) {
      setState(retriveStatus);
    }
  }, [retriveStatus.status, retriveStatus.nounGuid]);
  return (
    <>
      <TouchableOpacity style={styles.headerListItemContainer}>
        <Avatar containerStyle={styles.avatar} source={profileImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{state.fullName}</Text>
          <Text style={styles.status}>
            {state.status === 1 ? 'Online' : 'Offline'}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default ChatHeaderListItem;

const styles = StyleSheet.create({
  listItemContent: {
    flex: 1,
    height: 30,
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
});
