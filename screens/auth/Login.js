import React, { useState } from 'react'
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity
} from 'react-native'
import FormItem from '../../components/FormItem';
import { Formik } from 'formik';
import * as Progress from 'react-native-progress';

import { clearErrorMessage } from '../../store/auth/authActions';
import { login } from '../../store/auth/authActions';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters'

import {
    useDispatch,
    useSelector
} from "react-redux";

import { icons } from '../../constants'


export default function Login({ route }) {
    const [submitting, setSubmitting] = useState(false)

    const { errorMessage } = useSelector(state => state.auth)
    const dispatch = useDispatch();

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

            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={({ username, password }) => {
                    dispatch(clearErrorMessage())
                    setSubmitting(true)

                    dispatch(login(username, password))
                        .catch(() => setSubmitting(false))
                }}
            >
                {({ handleChange, handleSubmit, values }) => (
                    <View>
                        <FormItem
                            icon={icons.user}
                            label="Identifiant"
                            labelStyle={{
                                fontFamily: "Poppins_500Medium",
                                fontSize: moderateScale(15),
                                color: "#495564"
                            }}
                            placeholder="Votre identifiant EcoleDirecte"
                            type="text"
                            value={values.username}
                            onChangeText={handleChange("username")}
                        />
                        <FormItem
                            icon={icons.password}
                            label="Mot de passe"
                            labelStyle={{
                                fontFamily: "Poppins_500Medium",
                                fontSize: moderateScale(15),
                                color: "#495564"
                            }}
                            placeholder="Votre mot de passe"
                            type="password"
                            value={values.password}
                            onChangeText={handleChange("password")}
                            onSubmitEditing={handleSubmit}
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
                                onPress={handleSubmit}
                            >
                                {submitting ? (
                                    <Progress.CircleSnail
                                        color="#1F86FF"
                                        size={moderateScale(20)}
                                        indeterminate={true}
                                        thickness={moderateScale(2.5)}
                                    />
                                ) : (
                                    <Text style={{
                                        fontFamily: "Poppins_400Regular",
                                        fontSize: moderateScale(13),
                                        color: "#1F86FF"
                                    }}>
                                        Se connecter
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}


            </Formik>
        </ScrollView>
    )
}