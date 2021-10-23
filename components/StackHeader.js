import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { verticalScale, moderateScale } from "react-native-size-matters"
import { icons } from "../constants"

import IconButton from "./IconButton"

export default function StackHeader({ goBack }) {
    const [goBackBtnDisabled, setGoBackBtnDisabled] = useState(false)

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
                icon={icons.leftChevron}
                iconStyle={{
                    tintColor: "#B6B6B6"
                }}
                disabled={goBackBtnDisabled}
                onPress={() => {
                    setGoBackBtnDisabled(true)
                    goBack()
                    setTimeout(() => {
                        setGoBackBtnDisabled(false)
                    }, 500)
                }}
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