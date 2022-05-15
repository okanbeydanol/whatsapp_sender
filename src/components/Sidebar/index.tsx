import React from 'react';

import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

const Sidebar = (props: any) => {
  return (
    <>
      <DrawerContentScrollView>
        <DrawerItem
          onPress={() => {
            props.navigation.navigate('ContactScreen');
          }}
          label="Contacts"
        />
        <DrawerItem
          onPress={() => {
            props.navigation.navigate('CreateList');
          }}
          {...props}
        />
      </DrawerContentScrollView>
    </>
  );
};

export default Sidebar;
