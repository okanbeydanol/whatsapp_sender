import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {primary} from '../../constants/styles/colors';
import Edit from '../../assets/images/icons/edit.svg';

const SingleHeader = ({navigation, style}: any) => {
  return (
    <View style={[styles.headerStyle, style]}>
      <Text style={styles.headerText}>Sohbet</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('NewChatScreen');
        }}
        activeOpacity={0.7}>
        <Edit style={styles.editIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default SingleHeader;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: primary.color,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: primary.color,
    height: 65,
  },
  headerText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    color: '#fff',
    marginLeft: 24,
  },
  editIcon: {
    marginRight: 36,
  },
});
