import React from "react"
import MessageList from "./MessageList"
import Message from "./Message"

import { createStackNavigator } from "@react-navigation/stack"
import { CardStyleInterpolators } from "@react-navigation/stack"

const Stack = createStackNavigator()

export default function Messages(props) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: "#00000000",
                },
                cardOverlayEnabled: false,
                gestureEnabled: true,
                transitionSpec: {
                    open: {
                        animation: "timing",
                        config: { duration: 300 }
                    },
                    close: {
                        animation: "timing",
                        config: { duration: 300 }
                    }
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
            }}

        >
            <Stack.Screen name="MessageList">{() => (
                <MessageList {...props} />
            )}</Stack.Screen>
            <Stack.Screen name="ViewMessage">{() => (
                <Message {...props} />
            )}</Stack.Screen>
        </Stack.Navigator>
    )
}