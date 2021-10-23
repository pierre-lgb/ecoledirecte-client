import React, { useState } from "react"
import { View, Text, Image, TextInput, TouchableOpacity, Keyboard } from "react-native"
import { icons } from "../constants"
import { moderateScale, verticalScale } from "react-native-size-matters"

const FormItem = ({
    icon, label, placeholder, type, onChangeText, value,
    disabled, labelStyle, contentStyle, iconStyle, onSubmitEditing
}) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true)

    return (
        <View style={{
            marginVertical: verticalScale(20)
        }}>
            <Text style={{
                fontFamily: "Poppins_500Medium",
                fontSize: moderateScale(12),
                marginBottom: verticalScale(10),
                color: "#CFCFCF",
                ...labelStyle
            }}>
                {label}
            </Text>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F8F8F8",
                paddingHorizontal: moderateScale(25),
                paddingVertical: verticalScale(15),
                borderRadius: moderateScale(10)
            }}>
                <Image source={icon} style={{
                    tintColor: "#BEBFBF",
                    width: moderateScale(22),
                    height: moderateScale(22),
                    ...iconStyle
                }} />
                <TextInput
                    multiline={false}
                    autoCompleteType="off"
                    autoCorrect={false}
                    blurOnSubmit={true}
                    placeholderTextColor="#BEBFBF"
                    returnKeyType="done"
                    placeholder={placeholder}
                    autoCapitalize="none"
                    editable={!disabled}
                    selectTextOnFocus={!disabled}
                    style={{
                        fontFamily: "Poppins_400Regular",
                        fontSize: moderateScale(12),
                        color: "#495564",
                        flex: 1,
                        marginLeft: moderateScale(20),
                        ...contentStyle
                    }}
                    value={value || null}
                    secureTextEntry={type === "password" && secureTextEntry ? true : false}
                    onChangeText={onChangeText || null}
                    onSubmitEditing={onSubmitEditing || null}
                />
                {type === "password" && (
                    <TouchableOpacity
                        onPress={() => setSecureTextEntry((prevState) => !prevState)}
                    >
                        <Image
                            source={secureTextEntry ? icons.show : icons.hide}
                            style={{
                                tintColor: "#BEBFBF",
                                width: moderateScale(22),
                                height: moderateScale(22)
                            }}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default FormItem