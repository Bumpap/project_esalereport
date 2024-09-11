import 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import { TouchableOpacity, Image, View, Text, Modal, TouchableHighlight } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';


const HeaderRight = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);


  const handleLongPress = () => {
    setMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  const handleLogin = () => {
    navigation.navigate('loginWithMicrosoft');
    handleCloseMenu();
  };

  const handleLogout = () => {
    navigation.navigate('loginWithMicrosoft');
    handleCloseMenu();
  };


  return (
    <View>
      <TouchableOpacity onPress={handleLongPress}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.headerImage}
        />
      </TouchableOpacity>
      {/* Options Menu */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={handleCloseMenu}
      >
        <View style={styles.modalContainer}>
          <View style={styles.menu}>
            <TouchableHighlight onPress={handleLogin} style={styles.menuItem}>
              <Text style={styles.menuText}>Login</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={handleLogout} style={styles.menuItem}>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginRight: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

const DrawerLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent imageUri={undefined} {...props} />}
        screenOptions={{
          drawerPosition: 'left',
          drawerActiveBackgroundColor: "#187C84",
          drawerActiveTintColor: "#fff",
          drawerInactiveBackgroundColor: '#fff',
          drawerInactiveTintColor: 'black',
          drawerLabelStyle: { marginLeft: -10, },
          headerStyle: {
            backgroundColor: "#187C84",
          },
          headerTintColor: "white",
          headerRight: () => <HeaderRight />,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <Ionicons name="home-outline" size={24} color="white" />
                <Text style={styles.headerTitleText}>EsaleReport Approval</Text>
              </View>
            ),
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={25} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: 'My Profile',
            headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <Ionicons name="person-outline" size={24} color="white" />
                <Text style={styles.headerTitleText}>My Profile</Text>
              </View>
            ),
            drawerIcon: ({ size, color }) => (
              <Ionicons name="person-outline" size={25} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="pendingApproval"
          options={{
            drawerLabel: 'My Pending Approvals',
            headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="white" />
                <Text style={styles.headerTitleText}>My Pending Approvals</Text>
              </View>
            ),
            drawerIcon: ({ size, color }) => (
              <MaterialCommunityIcons name="clock-outline" size={25} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="request"
          options={{
            drawerLabel: 'My Request',
            headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <Ionicons name="list-outline" size={24} color="white" />
                <Text style={styles.headerTitleText}>My Request</Text>
              </View>
            ),
            drawerIcon: ({ size, color }) => (
              <Ionicons name="list-outline" size={25} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="setting"
          options={{
            drawerLabel: 'Setting',
            headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <AntDesign name="setting" size={24} color="white" />
                <Text style={styles.headerTitleText}>Setting</Text>
              </View>
            ),
            drawerIcon: ({ size, color }) => (
              <AntDesign name="setting" size={25} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="aboutUs"
          options={{
            drawerLabel: 'About Us',
            headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <Ionicons name="information-circle-outline" size={24} color="white" />
                <Text style={styles.headerTitleText}>About Us</Text>
              </View>
            ),
            drawerIcon: ({ size, color }) => (
              <Ionicons name="information-circle-outline" size={25} color={color} />
            ),
          }}
        />
      </Drawer>
    </View>
  );
};

export default DrawerLayout;
