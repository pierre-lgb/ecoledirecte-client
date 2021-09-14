import React, { useEffect, useRef, Children } from "react"
import {
    Modal, StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity, Image,
    Text, View, ScrollView,
    Animated
} from "react-native"
import { icons } from "../constants";
import { verticalScale, moderateScale } from 'react-native-size-matters';

export const BottomModalDivider = () => {
    return (
        <View
            style={{
                backgroundColor: "#F9F9F9",
                height: verticalScale(1),
                marginVertical: verticalScale(15)
            }}
        ></View>
    )
}

export const BottomModalOption = ({ icon, label, selected, onPress, style, closeModal }) => {
    return (
        <TouchableOpacity
            onPress={() => {
                onPress()
                closeModal()
            }}
            style={[styles.modalItem, style]}
        >
            <Image
                source={icon}
                style={[styles.modalItemIcon, {
                    tintColor: selected ? "#1F86FF" : "#BEBFBF"
                }]}
            />
            <Text
                style={[styles.modalItemLabel, {
                    color: selected ? "#1F86FF" : "#BEBFBF"
                }]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export const BottomModalRadio = ({ label, selected, onPress, style, closeModal }) => {
    return (
        <TouchableOpacity
            onPress={() => {
                onPress()
                closeModal()
            }}
            style={[styles.modalItem, style]}
        >
            <Image
                source={selected ? icons.checkedRadio : icons.uncheckedRadio}
                style={[styles.modalItemIcon, {
                    tintColor: selected ? "#1F86FF" : "#BEBFBF"
                }]}
            />
            <Text
                style={[styles.modalItemLabel, {
                    color: selected ? "#1F86FF" : "#BEBFBF"
                }]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export const BottomModalButton = ({ icon, label, onPress, style }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.modalButton, style]}
        >
            <Image
                source={icon}
                style={styles.modalButtonIcon}
            />
            <Text style={styles.modalButtonLabel}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export const BottomModal = ({ visible, setVisible, title, children }) => {
    const slideAnimation = useRef(new Animated.Value(moderateScale(100))).current
    const fadeAnimation = useRef(new Animated.Value(0)).current

    const closeModal = () => {
        Animated.spring(slideAnimation, {
            toValue: moderateScale(100),
            useNativeDriver: true
        }).start();
        Animated.spring(fadeAnimation, {
            toValue: 0,
            useNativeDriver: true
        }).start();
        setTimeout(() => setVisible(false), 100)
    }

    // Animation when opening modal
    useEffect(() => {
        if (visible === true) {
            Animated.spring(slideAnimation, {
                toValue: moderateScale(-50),
                useNativeDriver: true
            }).start();
            Animated.spring(fadeAnimation, {
                toValue: 1,
                useNativeDriver: true
            }).start();
        }
    }, [visible])

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={closeModal}
        >
            <TouchableWithoutFeedback
                onPress={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View style={[styles.modalContainer, {
                            transform: [{ translateY: slideAnimation }],
                            opacity: fadeAnimation
                        }]}>
                            <ScrollView>
                                <View style={{ padding: moderateScale(15) }}>
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Text style={styles.modalTitleText}>
                                            {title}
                                        </Text>
                                    </View>

                                    <BottomModalDivider />

                                    <View>
                                        {Children.map(children, (child) => {
                                            return React.cloneElement(child, {
                                                closeModal
                                            })
                                        })}
                                    </View>
                                </View>
                            </ScrollView>
                        </Animated.View>

                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "#C5BDB866",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#FFFFFF",
        padding: moderateScale(20),
        borderRadius: moderateScale(15),
        maxHeight: "70%"
    },
    modalTitleText: {
        paddingVertical: moderateScale(3),
        paddingHorizontal: moderateScale(20),
        backgroundColor: "#E9F2FF",
        fontFamily: "Poppins_500Medium",
        fontSize: moderateScale(9),
        color: "#1F86FF",
        borderRadius: moderateScale(20)
    },
    modalItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: verticalScale(15)
    },
    modalItemIcon: {
        width: moderateScale(22),
        height: moderateScale(22)
    },
    modalItemLabel: {
        fontFamily: "Inter_500Medium",
        fontSize: moderateScale(13),
        marginLeft: moderateScale(30)
    },
    modalButton: {
        backgroundColor: "#E9F2FF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: verticalScale(7),
        paddingHorizontal: moderateScale(30),
        borderRadius: moderateScale(20)
    },
    modalButtonIcon: {
        height: moderateScale(15),
        width: moderateScale(15),
        tintColor: "#1F86FF"
    },
    modalButtonLabel: {
        color: "#1F86FF",
        fontFamily: "Inter_500Medium",
        fontSize: moderateScale(10),
        marginLeft: moderateScale(10)
    }
})