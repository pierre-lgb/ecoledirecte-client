import React from "react"
import {
    TouchableOpacity, Image
} from "react-native"
import { moderateScale } from "react-native-size-matters"

const IconButton = ({ icon, iconStyle, onPress, disabled }) => {
    return (
        <TouchableOpacity
            style={{
                padding: moderateScale(10),
                borderColor: "#F9F9F9",
                borderWidth: moderateScale(1.5),
                borderRadius: moderateScale(15)
            }}
            disabled={disabled}
            onPress={onPress}
        >
            <Image
                source={icon}
                style={[{
                    width: moderateScale(26),
                    height: moderateScale(26),
                }, iconStyle]}
            />
        </TouchableOpacity>
    )
}

export default IconButton