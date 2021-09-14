import React, { useState } from 'react'
import Animated from 'react-native-reanimated'
import { Text, ScrollView, RefreshControl } from 'react-native'
import { scale, moderateScale, verticalScale } from 'react-native-size-matters'

import Header from '../components/Header'
import Footer from '../components/Footer'

export default function MainLayout({ children, drawerAnimationStyle, navigation, route, onRefresh, refreshing }) {

    return (
        <Animated.View
            style={[drawerAnimationStyle, {
                flex: 1,
                backgroundColor: '#FFFFFF'
            }]}
        >
            <ScrollView
                style={{ paddingHorizontal: scale(30) }}
                refreshControl={onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        progressViewOffset={verticalScale(20)}
                        colors={["#1F86FF"]} // Android
                        tintColor="#1F86FF" // IOS
                    />
                ) : null}
            >
                <Header navigation={navigation} />
                <Text style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: moderateScale(30),
                    marginBottom: verticalScale(50),
                    color: "#495564"
                }}>
                    {route.name}
                </Text>

                {children}

                <Footer />
            </ScrollView>
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
