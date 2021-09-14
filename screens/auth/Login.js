import React, { useState } from 'react'
import {
    View, ScrollView, Text,
    Image, TextInput, TouchableOpacity,
} from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import { clearErrorMessage } from '../../store/auth/authActions';
import { icons } from '../../constants'
import { scale, moderateScale, verticalScale } from 'react-native-size-matters'

import { login } from '../../store/auth/authActions';

const FormItem = ({ icon, label, placeholder, type, onChange }) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true)
    return (
        <View style={{
            marginVertical: verticalScale(20)
        }}>
            <Text style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: moderateScale(15),
                marginBottom: verticalScale(10),
                color: "#495564"
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
                    height: moderateScale(22)
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
                    style={{
                        fontFamily: "Poppins_400Regular",
                        fontSize: moderateScale(12),
                        color: "#495564",
                        flex: 1,
                        marginLeft: 15
                    }}
                    secureTextEntry={type === "password" && secureTextEntry ? true : false}
                    onChangeText={(value) => onChange(value)}
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

export default function Login({ route }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const { errorMessage } = useSelector(state => state.auth)

    const dispatch = useDispatch();

    const submitForm = () => {
        dispatch(clearErrorMessage())
        setSubmitting(true)

        dispatch(login(username, password))
            .catch(() => setSubmitting(false))

    }

    return (
        <ScrollView
            style={{
                paddingHorizontal: scale(30),
                backgroundColor: "#FFFFFF"
            }}
        >
            <Text style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: moderateScale(30),
                marginBottom: verticalScale(60),
                marginTop: verticalScale(100),
                color: "#495564"
            }}>
                {route.name}
            </Text>

            <View>
                <FormItem
                    icon={icons.user}
                    label="Identifiant"
                    placeholder="Votre identifiant EcoleDirecte"
                    type="text"
                    onChange={(value) => setUsername(value)}
                />
                <FormItem
                    icon={icons.password}
                    label="Mot de passe"
                    placeholder="Votre mot de passe"
                    type="password"
                    onChange={(value) => setPassword(value)}
                />
                {errorMessage ? (
                    <Text style={{
                        color: "#FC7D7D",
                        fontFamily: "Poppins_500Medium",
                        fontSize: moderateScale(12),
                        marginTop: verticalScale(8)
                    }}>{errorMessage}</Text>
                ) : null}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: verticalScale(20)
                }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Text style={{
                            fontFamily: "Poppins_500Medium",
                            fontSize: moderateScale(10),
                            textAlign: "center",
                            color: "#BEBFBF",
                            paddingHorizontal: moderateScale(20)
                        }}>
                            Mot de passe oublié ?
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#E9F2FF",
                            paddingVertical: verticalScale(10),
                            borderRadius: moderateScale(10)
                        }}
                        disabled={submitting ? true : false}
                        onPress={submitForm}
                    >
                        <Text style={{
                            fontFamily: "Poppins_400Regular",
                            fontSize: moderateScale(13),
                            color: "#1F86FF"
                        }}>
                            Se connecter
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}