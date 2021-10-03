import React from 'react'
import {
    Image,
    StyleSheet,
    View,
    Pressable,
    Platform,
    TouchableOpacity
} from 'react-native'
import Reports from './Reports'
import Homework from './Homework'
import MainLayout from '../MainLayout'

import { useSelector } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { icons } from '../../constants';

const TabBarIcon = ({ icon, isFocused }) => {
    return (
        <Image
            source={icon}
            style={[styles.tabBarIcon, {
                tintColor: isFocused ? "#1F86FF" : "#B7B7B7"
            }]}
        />
    )
}
const TabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={{
            height: verticalScale(65),
            flexDirection: "row",
            backgroundColor: "#FFFFFF",
            borderTopColor: "#F9F9F9",
            borderTopWidth: verticalScale(2)
        }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key]
                const isFocused = state.index === index

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate({ name: route.name, merge: true });
                    }
                }

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const buttonOptions = {
                    accessibilityRole: "button",
                    accessibilityState: isFocused ? { selected: true } : {},
                    testID: options.tabBarTestID,
                    onPress: onPress,
                    onLongPress: onLongPress,
                    key: index
                }

                return Platform.OS === "android" ? (
                    <Pressable
                        {...buttonOptions}
                        android_ripple={{
                            color: "#E9F2FF"
                        }}
                        android_disableSound
                        style={() => styles.tabBarButton}
                    >
                        <TabBarIcon icon={options.tabBarIcon} isFocused={isFocused} />
                    </Pressable>
                ) : (
                    <TouchableOpacity
                        {...buttonOptions}
                        style={styles.tabBarButton}
                    >
                        <TabBarIcon icon={options.tabBarIcon} isFocused={isFocused} />
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const Tab = createBottomTabNavigator()


export default function Agenda(props) {
    const { accounts } = useSelector(state => state.auth)
    const account = accounts[0]

    if (!account) {
        return <MainLayout {...props}></MainLayout>
    }

    return (
        <MainLayout {...props}>
            <Tab.Navigator
                activeColor="#1F86FF"
                inactiveColor="#B7B7B7"
                barStyle={{
                    backgroundColor: "#FFFFFF",
                    height: verticalScale(75),
                    justifyContent: "center"
                }}
                initialRouteName="Homework"
                backBehavior="history"
                labeled={false}
                sceneContainerStyle={{
                    backgroundColor: "transparent"
                }}
                screenOptions={{
                    gestureEnabled: true,
                    headerShown: false
                }}
                tabBar={TabBar}
                gestureEnabled={true}
            >
                <Tab.Screen
                    name="Homework"
                    options={{
                        tabBarIcon: icons.agenda
                    }}
                >{() => (
                    <Homework {...props} account={account} />
                )}</Tab.Screen>

                <Tab.Screen
                    name="Reports"
                    options={{
                        tabBarIcon: icons.report
                    }}
                >{() => (
                    <Reports {...props} account={account} />
                )}</Tab.Screen>
            </Tab.Navigator>
        </MainLayout>
    )
}


const styles = StyleSheet.create({
    tabBarIcon: {
        width: moderateScale(25),
        height: moderateScale(25)
    },
    tabBarButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})