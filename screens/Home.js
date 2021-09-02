import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'

export default function Home({ drawerAnimationStyle }) {

    return (
        <Animated.View style={[styles.container, drawerAnimationStyle]}>
            <Text>Homepage</Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F2F8'
    }
})
