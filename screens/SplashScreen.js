import React from 'react'
import {
    View,
    Image
} from 'react-native'

import { moderateScale } from 'react-native-size-matters'

export default function SplashScreen() {
    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
        }}>
            <View>
                <Image
                    source={require('../assets/icon.png')}
                    style={{
                        width: moderateScale(150),
                        height: moderateScale(150)
                    }}
                />
            </View>
        </View>
    )
}
