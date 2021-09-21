import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView
} from '@react-navigation/drawer';
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../store/auth/authActions';
import Animated from 'react-native-reanimated';

import {
    icons,
    screens
} from '../constants';

import Home from "../screens/Home";
import Timetable from "../screens/Timetable";
import Agenda from "../screens/Agenda";
import Notes from "../screens/Notes";
import Messages from "../screens/Messages";
import Documents from "../screens/Documents";
import Settings from "../screens/Settings";

import { verticalScale, moderateScale } from 'react-native-size-matters';

const ProfileInfo = ({ nom, prenom, classe, imageURI }) => {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: verticalScale(10)
        }}>
            <Image
                source={{
                    uri: imageURI,
                    method: "GET",
                    headers: {
                        "Referer": "https://www.ecoledirecte.com/"
                    }
                }}
                resizeMode="cover"
                style={{
                    height: verticalScale(50),
                    width: verticalScale(50),
                    borderRadius: moderateScale(50),
                    borderWidth: moderateScale(2),
                    borderColor: '#54A0FF'
                }}
            />
            <View style={{ marginLeft: moderateScale(15), flex: 1 }}>
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontFamily: 'Poppins_500Medium',
                        fontSize: verticalScale(11.5)
                    }}
                    textBreakStrategy="simple"
                    numberOfLines={2}
                    lineBreakMode="tail"
                >{prenom || ""} {nom || ""}</Text>

                <Text
                    style={{
                        color: '#B7B7B7',
                        fontFamily: 'Poppins_400Regular',
                        fontSize: verticalScale(10)
                    }}
                >{classe || ""}</Text>
            </View>
        </View>
    )
}

const DrawerDivider = () => {
    return (
        <View
            style={{
                height: verticalScale(1.5),
                marginVertical: verticalScale(10),
                backgroundColor: "#3B4656"
            }}
        />
    )
}

const DrawerItem = ({ icon, screenName, isFocused, navigation }) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                height: verticalScale(45),
                marginVertical: verticalScale(5),
                alignItems: 'center',
                paddingLeft: moderateScale(20),
                borderRadius: moderateScale(8),
                backgroundColor: isFocused ? '#FFFFFF' : null
            }}
            onPress={() => navigation.navigate(screenName)}
        >
            <Image
                source={icon}
                style={{
                    width: verticalScale(22),
                    height: verticalScale(22),
                    tintColor: isFocused ? '#2C3748' : '#FFFFFF'
                }}
            />

            <Text
                style={{
                    marginLeft: moderateScale(14),
                    color: isFocused ? '#2C3748' : '#FFFFFF',
                    fontFamily: 'Poppins_400Regular',
                    fontSize: verticalScale(12)
                }}
            >
                {screenName}
            </Text>
        </TouchableOpacity>
    )
}

const LogoutButton = ({ navigation }) => {
    const dispatch = useDispatch()

    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                height: verticalScale(45),
                marginVertical: verticalScale(40),
                alignItems: 'center',
                paddingLeft: moderateScale(20)
            }}

            onPress={() => {
                dispatch(logout())
            }}
        >
            <Image
                source={icons.logout}
                style={{
                    width: verticalScale(22),
                    height: verticalScale(22),
                    tintColor: '#FC7D7D'
                }}
            />

            <Text style={{
                marginLeft: moderateScale(14),
                color: '#FC7D7D',
                fontFamily: 'Poppins_400Regular',
                fontSize: verticalScale(12)
            }}
            >
                Déconnexion
            </Text>
        </TouchableOpacity>
    )
}

const DrawerContent = ({ state, navigation }) => {
    const { accounts } = useSelector(state => state.auth)
    const currentAccount = accounts[0]

    return (
        <DrawerContentScrollView
            scrollEnabled
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
        >
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: moderateScale(30),
                    paddingVertical: verticalScale(40)
                }}
            >
                {/* Profile info */}
                <ProfileInfo
                    nom={currentAccount?.nom}
                    prenom={currentAccount?.prenom}
                    classe={currentAccount?.profile.classe.libelle}
                    imageURI="https://doc1.ecoledirecte.com/PhotoEleves/0441936R_6955685032734a4347454d/6469664f6167.jpg"
                />
                <DrawerDivider />

                {/* Drawer items */}
                <DrawerItem
                    icon={icons.home}
                    screenName={screens.home}
                    isFocused={state.routeNames[state.index] === screens.home}
                    navigation={navigation}
                />
                <DrawerItem
                    icon={icons.calendar}
                    screenName={screens.timetable}
                    isFocused={state.routeNames[state.index] === screens.timetable}
                    navigation={navigation}
                />
                <DrawerItem
                    icon={icons.agenda}
                    screenName={screens.agenda}
                    isFocused={state.routeNames[state.index] === screens.agenda}
                    navigation={navigation}
                />
                <DrawerItem
                    icon={icons.note}
                    screenName={screens.notes}
                    isFocused={state.routeNames[state.index] === screens.notes}
                    navigation={navigation}
                />
                <DrawerItem
                    icon={icons.mail}
                    screenName={screens.messages}
                    isFocused={state.routeNames[state.index] === screens.messages}
                    navigation={navigation}
                />
                <DrawerItem
                    icon={icons.file}
                    screenName={screens.documents}
                    isFocused={state.routeNames[state.index] === screens.documents}
                    navigation={navigation}
                />

                <DrawerDivider />

                <DrawerItem
                    icon={icons.settings}
                    screenName={screens.settings}
                    isFocused={state.routeNames[state.index] === screens.settings}
                    navigation={navigation}
                />

                <LogoutButton navigation={navigation} />
            </View>
        </DrawerContentScrollView>
    )
}

const Drawer = createDrawerNavigator()

export default () => {
    const [progress, setProgress] = useState(new Animated.Value(0))

    const scale = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.7]
    })

    const borderRadius = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [0, moderateScale(20)]
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
                    width: moderateScale(280),
                    paddingRight: 10,
                    backgroundColor: 'transparent'
                }}
                sceneContainerStyle={{
                    backgroundColor: 'transparent'
                }}
                initialRouteName='Home'
                drawerContent={({ state, navigation, progress }) => {
                    setTimeout(() => {
                        setProgress(progress)
                    }, 0)

                    return (
                        <DrawerContent navigation={navigation} state={state} />
                    )
                }}
            // screenOptions={{
            //     headerStyle: {
            //         backgroundColor: '#f4511e',
            //     },
            //     headerTintColor: '#fff',
            //     headerTitleStyle: {
            //         fontWeight: 'bold',
            //     },
            // }}
            >
                <Drawer.Screen name={screens.home}>{props => (
                    <Home {...props} drawerAnimationStyle={animatedStyle} />
                )}</Drawer.Screen>
                <Drawer.Screen name={screens.timetable}>{props => (
                    <Timetable {...props} drawerAnimationStyle={animatedStyle} />
                )}</Drawer.Screen>
                <Drawer.Screen name={screens.agenda}>{props => (
                    <Agenda {...props} drawerAnimationStyle={animatedStyle} />
                )}</Drawer.Screen>
                <Drawer.Screen name={screens.notes}>{props => (
                    <Notes {...props} drawerAnimationStyle={animatedStyle} />
                )}</Drawer.Screen>
                <Drawer.Screen name={screens.messages}>{props => (
                    <Messages {...props} drawerAnimationStyle={animatedStyle} />
                )}</Drawer.Screen>
                <Drawer.Screen name={screens.documents}>{props => (
                    <Documents {...props} drawerAnimationStyle={animatedStyle} />
                )}</Drawer.Screen>
                <Drawer.Screen name={screens.settings}>{props => (
                    <Settings {...props} drawerAnimationStyle={animatedStyle} />
                )}</Drawer.Screen>
            </Drawer.Navigator>
        </View>
    )
}
