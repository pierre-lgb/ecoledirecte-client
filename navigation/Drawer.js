import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
import { icons } from '../assets/constants';

import Home from '../screens/Home';

const Drawer = createDrawerNavigator()

const ProfileInfo = ({ nom, classe, imageURI }) => {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20
        }}>
            <Image
                source={{ uri: imageURI }}
                resizeMode="cover"
                style={{
                    height: 68,
                    width: 68,
                    borderRadius: 35,
                    borderWidth: 2,
                    borderColor: '#54A0FF'
                }}
            />
            <View style={{ marginLeft: 20, flex: 1 }}>
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontFamily: 'Poppins_500Medium',
                        fontSize: 14
                    }}
                    textBreakStrategy="highQuality"
                >{nom}</Text>
                <Text
                    style={{
                        color: '#B7B7B7',
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 12
                    }}
                >{classe}</Text>
            </View>
        </View>
    )
}

const DrawerDivider = () => {
    return (
        <View
            style={{
                height: 1.5,
                marginVertical: 10,
                backgroundColor: "#3B4656"
            }}
        />
    )
}

const DrawerItem = ({ icon, label }) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                height: 40,
                marginVertical: 10,
                alignItems: 'center',
                paddingLeft: 20,
                borderRadius: 20,
                // backgroundColor: '#FFFFFF'
            }}
        >
            <Image
                source={icon}
                style={{
                    width: 22,
                    height: 22,
                    tintColor: '#FFFFFF'
                }}
            />

            <Text
                style={{
                    marginLeft: 14,
                    color: '#FFFFFF',
                    fontFamily: 'Poppins_400Regular'
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
}

const LogoutButton = () => {
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                height: 40,
                marginVertical: 50,
                alignItems: 'center',
                paddingLeft: 20
                // backgroundColor: '#FFFFFF'
            }}
        >
            <Image
                source={icons.logout}
                style={{
                    width: 22,
                    height: 22,
                    tintColor: '#FC7D7D'
                }}
            />

            <Text style={{
                marginLeft: 14,
                color: '#FC7D7D',
                fontFamily: 'Poppins_400Regular'
            }}
            >
                Déconnexion
            </Text>
        </TouchableOpacity>
    )
}

const DrawerContent = ({ navigation }) => {
    return (
        <DrawerContentScrollView
            scrollEnabled={true} // <------------------- Maybe change this
            contentContainerStyle={{ flex: 1 }}
        >
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    paddingLeft: 30,
                    justifyContent: 'center'
                }}
            >
                {/* Profile info */}
                <ProfileInfo
                    nom="Pierre LEGOUBIN"
                    classe="Seconde Z"
                    imageURI="https://i.stack.imgur.com/pbNyL.png"
                />
                <DrawerDivider />

                {/* Drawer items */}
                <DrawerItem icon={icons.home} label="Accueil" />
                <DrawerItem icon={icons.timetable} label="Emploi du temps" />
                <DrawerItem icon={icons.agenda} label="Agenda" />
                <DrawerItem icon={icons.notes} label="Notes" />
                <DrawerItem icon={icons.mail} label="Messagerie" />
                <DrawerItem icon={icons.file} label="Documents" />

                <DrawerDivider />

                <DrawerItem icon={icons.settings} label="Paramètres" />

                <LogoutButton />
            </View>
        </DrawerContentScrollView>
    )
}

export default function CustomDrawer() {
    const [progress, setProgress] = useState(new Animated.Value(0))

    const scale = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.7]
    })

    const borderRadius = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [0, 40]
    })

    const translateX = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [0, -60]
    })

    const animatedStyle = { borderRadius, transform: [{ scale, translateX }] }

    return (
        <View
            style={{
                flex: 1,
                // backgroundColor: '#FFFFFF'
                backgroundColor: '#2C3748'
            }}
        >
            <Drawer.Navigator
                drawerType="slide"
                overlayColor="transparent"
                drawerStyle={{
                    flex: 1,
                    width: '75%',
                    paddingRight: 10,
                    backgroundColor: 'transparent'
                }}
                sceneContainerStyle={{
                    backgroundColor: 'transparent'
                }}
                initialRouteName='Home'
                drawerContent={({ navigation, progress }) => {
                    setTimeout(() => {
                        setProgress(progress)
                    }, 0)

                    return (
                        <DrawerContent navigation={navigation} />
                    )
                }}
            >
                <Drawer.Screen name='Home'>
                    {props => <Home {...props} drawerAnimationStyle={animatedStyle} />}
                </Drawer.Screen>
            </Drawer.Navigator>

        </View>
    )
}