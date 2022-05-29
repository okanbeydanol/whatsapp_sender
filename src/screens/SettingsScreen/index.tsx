/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppHeader from '../../components/Header/AppHeader';
import {
  light,
  medium,
  primary,
  secondary,
  tertiary,
} from '../../constants/styles/colors';

import {ContactTabScreenProps} from '../../navigation/types';
import {Icon} from '@rneui/themed';
import AppFlag from '../../components/Elements/AppFlag';

const SettingsScreen = ({
  navigation,
  route,
}: ContactTabScreenProps<'ChooseContact'>) => {
  //Functions
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [loading]);

  return (
    <>
      <View style={styles.appHeader}>
        <TouchableOpacity
          style={{position: 'absolute', left: 20, top: 16}}
          onPress={() => {
            navigation.openDrawer();
          }}
          activeOpacity={0.8}>
          <Icon
            name="menu"
            size={28}
            type="ionicon"
            color={medium.color}
            style={styles.addIconStyle}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.appHeaderText}>Ayarlar</Text>
        </View>
      </View>
      {loading ? (
        <View style={[styles.loading]}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 24,
              marginBottom: 24,
            }}>
            <AppFlag
              value="tr"
              style={{borderRadius: 12, width: 80, height: 45}}
            />
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}>
            <Text
              style={{
                color: primary.color,
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 16,
                textTransform: 'capitalize',
                fontWeight: '500',
              }}>
              Okan Beydanol
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}>
            <Text>542062305</Text>
          </View>
          <View style={{marginTop: 40, paddingLeft: 16, paddingRight: 16}}>
            <View>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderColor: light.color,
                  height: 28,
                }}>
                <Icon
                  name="people"
                  size={18}
                  type="ionicon"
                  color={medium.color}
                  style={styles.addIconStyle}
                />
                <Text>İsim Soyisim Değiştir</Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 16}}>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderColor: light.color,
                  height: 28,
                }}>
                <Icon
                  name="call"
                  size={18}
                  type="ionicon"
                  color={medium.color}
                  style={styles.addIconStyle}
                />
                <Text>Telefon Numarası Değiştir</Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 16}}>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderColor: light.color,
                  height: 28,
                }}>
                <Icon
                  name="construct"
                  size={18}
                  type="ionicon"
                  color={medium.color}
                  style={styles.addIconStyle}
                />
                <Text>İzin Ayarlarını Değiştir</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              height: Dimensions.get('screen').height - 480,
            }}>
            <Text>Whatsapp Sender</Text>
            <Text>Version: 1.0</Text>
          </View>
        </>
      )}
    </>
  );
};

export default SettingsScreen;
const styles = StyleSheet.create({
  openCreateList: {
    backgroundColor: '#f3f3f3',
    position: 'absolute',
    right: 0,
    top: Dimensions.get('window').height - 212,
  },
  editWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  context: {
    color: medium.color,
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    fontWeight: '500',
  },
  cardWrapper: {marginRight: 32},
  cardContainer: {marginTop: 15},
  cardContainerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    color: secondary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    fontWeight: '500',
  },
  appHeaderText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    fontWeight: '500',
    color: tertiary.color,
  },
  scrollView: {},
  addIconStyle: {
    marginRight: 16,
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 80,
    padding: 10,
  },
  appHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: primary.color,
    height: 60,
  },
  addNewList: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  iconStyle: {
    marginRight: 6,
  },
  buttonStyle: {
    borderRadius: 5,
    marginRight: 16,

    padding: 4,
    flexDirection: 'row',
  },
  buttonTextStyle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    fontWeight: '500',
    color: '#999fb4',
  },
});
