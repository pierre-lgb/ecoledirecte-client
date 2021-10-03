import React from 'react'
import {
    View,
    StatusBar
} from 'react-native'
import Header from '../components/Header'

export default function MainLayout({
    children,
    navigation,
    route
}) {

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                overflow: "hidden"
            }}
        >
            <StatusBar
                backgroundColor="transparent"
                barStyle={"dark-content"}
                showHideTransition={true}
                translucent={true}
            />
            <Header
                openDrawer={navigation.openDrawer}
                routeName={route.name}
            />

            <View style={{ flex: 1 }}>
                {children}
            </View>
        </View>
    )
}
