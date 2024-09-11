import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";



export default function CustomDrawerContent({ imageUri, ...props }) {
    const router = useRouter();
    const { top, bottom } = useSafeAreaInsets();


    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}
                scrollEnabled={false}
                contentContainerStyle={{ backgroundColor: "#187C84", height: '100%' }}>
                <View style={{ padding: 2 }}>
                    <Image
                        borderRadius={75}
                        source={imageUri ? { uri: imageUri } : require('../assets/images/user.png')}
                        style={{ width: 150, height: 150, alignSelf: 'center' }}
                    />
                </View>

                <Text style={{
                    alignSelf: 'center',
                    fontWeight: '500',
                    fontSize: 22,
                    paddingBottom: 5,
                    color: "#fff"
                }}>
                    Nguyen Anh Khoa
                </Text>

                <Text style={{
                    alignSelf: 'center',
                    fontWeight: '400',
                    fontSize: 13,
                    paddingBottom: 20,
                    color: "#E0E0E0",
                    textDecorationLine: 'underline',

                }}>
                    ngkhoa@gmail.com
                </Text>

                <View style={{ backgroundColor: "#fff", padding: 8, marginBottom: 10 }}>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <DrawerItemList {...props} />
                    </View>

                </View>

                <View style={styles.bottomDrawerSection} >
                    <DrawerItem
                        onPress={() => router.replace('/')}
                        icon={({ color, size }) => (
                            <MaterialCommunityIcons name="exit-to-app" color={'white'} size={size} />
                        )}
                        label="Sign Out"
                        labelStyle={styles.signOutText}
                    />
                </View>
            </DrawerContentScrollView>

            <View style={styles.footer}>
                <Image style={styles.logo} source={{ uri: "data:image/png;base64,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" }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        borderTopColor: "#fff",
        borderTopWidth: 0.3,
        paddingVertical: 7,  // Adjust vertical padding to make the footer smaller
        paddingHorizontal: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#187C84",  // Background color for the footer

    },
    logo: {
        width: 160,  // Adjust the width as needed
        height: 30, // Adjust the height as needed
        resizeMode: 'contain', // Ensure the logo is contained within the dimensions
        backgroundColor: "#187C84"

    },
    text: {
        marginLeft: 10, // Add some spacing between the image and the text
        fontSize: 16, // Adjust the font size as needed
    },
    bottomDrawerSection: {
        borderBottomColor: '#dedede',
        borderBottomWidth: 0.3,
    },
    signOutText: {
        marginLeft: -16, // Adjust the label position to align with icon
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});