import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {primary} from '../../constants/styles/colors';
import Close from '../../assets/images/icons/close.svg';
import AppTextInput from '../Elements/AppTextInput';

const NewChatHeader = ({navigation, style}: any) => {
  const onChangeText = () => {};
  return (
    <View style={[styles.headerStyle, style]}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Sohbet</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}
          activeOpacity={0.7}>
          <Close style={styles.editIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerSearchContainer}>
        <AppTextInput
          placeholder="Arama"
          style={styles.inputStyle}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default NewChatHeader;

const styles = StyleSheet.create({
  headerStyle: {
    flexDirection: 'column',
    backgroundColor: primary.color,
    height: 85,
    width: '100%',
  },
  headerText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginLeft: 24,
  },
  editIcon: {
    marginRight: 24,
  },
  inputStyle: {
    marginTop: 14,
    height: 30,
    width: Dimensions.get('window').width - 34,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerSearchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
