import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import Drawer from "./DrawerNavigation"
import Login from "../screens/auth/Login"

const Stack = createStackNavigator()

export default function AuthNavigation() {
    const { isLoggedIn, token } = useSelector(state => state.auth)

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                {!isLoggedIn || !token ? (
                    <Stack.Screen
                        name="Connexion"
                        component={Login}
                    />
                ) : (
                    <Stack.Screen name="Main" component={Drawer} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}
