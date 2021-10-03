import React from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native'

import { logout } from '../store/auth/authActions'
import {
    createDrawerNavigator,
    DrawerContentScrollView
} from '@react-navigation/drawer'
import {
    verticalScale,
    moderateScale
} from 'react-native-size-matters';

import {
    useDispatch,
    useSelector
} from "react-redux"

import {
    icons,
    screens
} from '../constants'

// Import screens
import Home from "../screens/Home"
import Timetable from "../screens/Timetable"
import Agenda from "../screens/Agenda"
import Messages from "../screens/Messages"
import Documents from "../screens/Documents"




const ProfileInfo = ({ nom, prenom, classe, imageURI }) => {
    return (
        <View style={{
            marginVertical: verticalScale(10)
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
                    height: verticalScale(60),
                    width: verticalScale(60),
                    borderRadius: moderateScale(50),
                    borderWidth: moderateScale(2),
                    borderColor: '#54A0FF'
                }}
            />
            <View style={{ flex: 1, marginTop: verticalScale(15) }}>
                <Text
                    style={{
                        color: '#495564',
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: verticalScale(14),
                        lineHeight: verticalScale(20),
                        textTransform: "capitalize"
                    }}
                    numberOfLines={2}
                    lineBreakMode="tail"
                >{prenom || ""} {nom || ""}</Text>

                <Text
                    style={{
                        color: '#B7B7B7',
                        fontFamily: 'Poppins_400Regular',
                        fontSize: verticalScale(10),
                        lineHeight: verticalScale(20)
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
                marginVertical: verticalScale(20),
                backgroundColor: "#F9F9F9"
            }}
        />
    )
}

const DrawerItem = ({ icon, screenName, isFocused, navigation }) => {
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(screenName)}
            style={{
                flexDirection: 'row',
                height: verticalScale(45),
                marginVertical: verticalScale(5),
                alignItems: 'center',
                paddingLeft: moderateScale(20),
                borderRadius: moderateScale(15),
                backgroundColor: isFocused ? "#E9F2FF" : "transparent"
            }}
        >

            <Image
                source={icon}
                style={{
                    width: verticalScale(18),
                    height: verticalScale(18),
                    tintColor: isFocused ? '#1F86FF' : '#7E8791'
                }}
            />

            <Text
                style={{
                    marginLeft: moderateScale(20),
                    color: isFocused ? '#1F86FF' : '#7E8791',
                    fontFamily: isFocused ? 'Inter_500Medium' : 'Inter_400Regular',
                    fontSize: verticalScale(12)
                }}
            >
                {screenName}
            </Text>
        </TouchableOpacity>
    )
}

const LogoutButton = () => {
    const dispatch = useDispatch()

    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                height: verticalScale(45),
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
                fontFamily: 'Inter_400Regular',
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
    const account = accounts[0]

    return (
        <DrawerContentScrollView
            scrollEnabled
            showsVerticalScrollIndicator={false}
            style={{
                flex: 1,
                borderRightColor: "#F9F9F9",
                borderRightWidth: 2
            }}
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
                    nom={account?.nom}
                    prenom={account?.prenom}
                    classe={account?.profile.classe.libelle}
                    imageURI={"https:" + account?.profile.photo}
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

                <LogoutButton navigation={navigation} />
            </View>
        </DrawerContentScrollView>
    )
}

const Drawer = createDrawerNavigator()

export default () => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#2C3748'
            }}
        >
            <Drawer.Navigator
                sceneContainerStyle={{
                    backgroundColor: 'transparent'
                }}
                screenOptions={{
                    headerShown: false,
                    drawerType: "slide",
                    overlayColor: "transparent",
                    drawerStyle: {
                        width: "85%"
                    }
                }}
                initialRouteName='Home'
                drawerContent={(props) => <DrawerContent {...props} />}
            >
                <Drawer.Screen name={screens.home}>{props => (
                    <Home {...props} />
                )}</Drawer.Screen>
                <Drawer.Screen name={screens.timetable}>{props => (
                    <Timetable {...props} />
                )}</Drawer.Screen>
                <Drawer.Screen name={screens.agenda}>{props => (
                    <Agenda {...props} />
                )}</Drawer.Screen>
                <Drawer.Screen name={screens.messages}>{props => (
                    <Messages {...props} />
                )}</Drawer.Screen>
                <Drawer.Screen name={screens.documents}>{props => (
                    <Documents {...props} />
                )}</Drawer.Screen>
            </Drawer.Navigator>
        </View>
    )
}
