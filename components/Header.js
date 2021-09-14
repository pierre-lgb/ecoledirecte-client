import React from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import { icons } from '../constants'
import { moderateScale, verticalScale } from 'react-native-size-matters'

export default function Header({ navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    navigation.openDrawer()
                }}
            >
                <Image
                    source={icons.menu}
                    style={styles.icon}
                />
            </TouchableOpacity>

            <TouchableOpacity>
                <Image
                    source={icons.sun}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: verticalScale(50),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    icon: {
        width: verticalScale(30),
        height: verticalScale(30),
        tintColor: "#495564"
    }
})