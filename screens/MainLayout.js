import React from 'react'
import Animated from 'react-native-reanimated'
import { useIsDrawerOpen } from '@react-navigation/drawer'
import { View, StatusBar } from 'react-native'

import Header from '../components/Header'

export default function MainLayout({ children, navigation, route }) {
    // const drawerOpened = useIsDrawerOpen()
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

// import React from 'react'
// import { StyleSheet, Text, View } from 'react-native'
// import Animated from 'react-native-reanimated'

// export default function MainLayout(props) {
//     return (
//         <Animated.View style={[styles.container, props.drawerAnimationStyle]}>
//             {props.children}
//         </Animated.View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F1F2F8'
//     }
// })
