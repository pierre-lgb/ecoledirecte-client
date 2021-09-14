import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { verticalScale, moderateScale } from 'react-native-size-matters'

export default function Footer() {
    return (
        <View
            style={{
                marginTop: verticalScale(50),
                padding: moderateScale(20)
            }}
        >
            <Text style={styles.bottomText}>
                À propos | Signaler un bug
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomText: {
        textAlign: "center",
        fontSize: moderateScale(15),
        fontFamily: "Poppins_400Regular",
        color: "#959595"
    }
})
