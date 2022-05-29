import React from 'react';

import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Text, View} from 'react-native';
import AppFlag from '../Elements/AppFlag';
import {primary} from '../../constants/styles/colors';

const Sidebar = (props: any) => {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <>
      <DrawerContentScrollView>
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
        <DrawerItem
          onPress={() => {
            props.navigation.navigate('ContactsScreen', {selectedContacts: []});
          }}
          label="Kişiler"
        />
        <DrawerItem
          onPress={() => {
            props.navigation.navigate('TemplatesScreen');
          }}
          label="Mesaj Şablonları"
        />
        <DrawerItem
          onPress={() => {
            props.navigation.navigate('Group');
          }}
          label="Whatsapp Gönderme Listeleri"
        />
        <DrawerItem
          onPress={() => {
            props.navigation.navigate('Settings');
          }}
          label="Ayarlar"
        />
      </DrawerContentScrollView>
    </>
  );
};

export default Sidebar;
