import React from 'react'
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native'
import { icons } from '../constants'
import { moderateScale, verticalScale } from 'react-native-size-matters'

import IconButton from "./IconButton"

export default function Header({ openDrawer, routeName }) {
    return (
        <View style={{
            paddingTop: verticalScale(50),
            paddingBottom: verticalScale(20),
            paddingHorizontal: moderateScale(35),
            borderBottomWidth: moderateScale(2),
            borderBottomColor: "#F9F9F9",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            zIndex: 999
        }}>
            <IconButton
                icon={icons.menu}
                onPress={openDrawer}
            />

            <Text style={{
                fontFamily: "Poppins_500Medium",
                fontSize: moderateScale(15),
                textAlign: "center",
                color: "#505565",
                marginHorizontal: moderateScale(15),
                flex: 1
            }}>{routeName}</Text>

            <IconButton
                icon={icons.notificationActive}
            />
        </View >
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