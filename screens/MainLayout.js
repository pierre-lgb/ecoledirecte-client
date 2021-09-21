import React from 'react'
import Animated from 'react-native-reanimated'
import { View } from 'react-native'

import Header from '../components/Header'

export default function MainLayout({ children, drawerAnimationStyle, navigation, route }) {

    return (
        <Animated.View
            style={[drawerAnimationStyle, {
                flex: 1,
                backgroundColor: '#FFFFFF',
                overflow: "hidden"
            }]}
        >
            <Header
                openDrawer={navigation.openDrawer}
                routeName={route.name}
            />

            <View style={{ flex: 1 }}>
                {children}
            </View>

        </Animated.View>
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
