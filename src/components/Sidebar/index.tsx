import React from 'react';

import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

const Sidebar = (props: any) => {
  return (
    <>
      <DrawerContentScrollView>
        <DrawerItem {...props} />
      </DrawerContentScrollView>
    </>
  );
};

export default Sidebar;
