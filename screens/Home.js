import React from 'react'
import { Text, View, Image, ScrollView } from 'react-native'
import { icons, screens } from '../constants'

import MainLayout from './MainLayout'

const TimelineEvent = ({ icon, title, subtitle, date, id }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 15,
                paddingVertical: 15,
                borderRadius: 10,
                backgroundColor: id % 2 === 1 ? "#F8F8F8" : null
            }}
        >
            <View
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Image
                    source={icon}
                    style={{
                        width: 26,
                        height: 26,
                        tintColor: "#6E7079"
                    }}
                />
            </View>
            <View style={{
                paddingLeft: 10
            }}>
                <Text
                    style={{
                        fontFamily: "Poppins_400Regular",
                        lineHeight: 15,
                        color: "#6E7079"
                    }}
                >{title}</Text>
                {subtitle ? (
                    <Text
                        style={{
                            fontFamily: "Poppins_400Regular",
                            fontSize: 10,
                            lineHeight: 12,
                            color: "#BEBFBF"
                        }}
                    >{subtitle}</Text>
                ) : null}
            </View>
        </View>
    )
}

export default function Home(props) {
    return (
        <MainLayout {...props} >

        </MainLayout>
    )
}
