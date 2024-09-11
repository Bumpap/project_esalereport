import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Index from '../app/(tabs)/index';
import Profile from '../app/(tabs)/Profile';
import PendingApproval from '../app/(tabs)/PendingApproval';
import Request from '../app/(tabs)/Request';
import Setting from '../app/(tabs)/Setting';
import AboutUs from '../app/(tabs)/AboutUs';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent imageUri={undefined} {...props} />}>
    <Drawer.Screen name="Home" component={Index} />
    <Drawer.Screen name="Profile" component={Profile} />
    <Drawer.Screen name="PendingApproval" component={PendingApproval} />
    <Drawer.Screen name="Request" component={Request} />
    <Drawer.Screen name="Setting" component={Setting} />
    <Drawer.Screen name="AboutUs" component={AboutUs} />

  </Drawer.Navigator>
);

export default DrawerNavigator;
