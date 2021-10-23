import React from 'react'
import {
    Text, View, Image,
    ScrollView, Dimensions, TextInput
} from 'react-native'
import { icons } from '../constants'
import Barcode from "react-native-barcode-builder";
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import FormItem from "../components/FormItem"

import MainLayout from './MainLayout'

const WEEK_DAYS = ["L", "M", "M", "J", "V", "S", "D"]

const SectionHeader = ({ title, tag }) => {
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center"
        }}>
            <Text style={{
                fontFamily: "Poppins_500Medium",
                fontSize: moderateScale(15),
                color: "#495564"
            }}>{title}</Text>
            {tag ? (
                <View style={{
                    backgroundColor: "#E9F2FF",
                    paddingVertical: verticalScale(4),
                    paddingHorizontal: moderateScale(15),
                    borderRadius: 999,
                    marginLeft: moderateScale(15)
                }}>
                    <Text style={{
                        fontFamily: "Poppins_500Medium",
                        fontSize: moderateScale(10),
                        textTransform: "capitalize",
                        color: "#1F86FF"
                    }}>{tag}</Text>
                </View>
            ) : null}
        </View>
    )
}

export default function Home(props) {
    const { accounts } = useSelector(state => state.auth)
    const account = accounts[0]

    if (!account) {
        return <MainLayout {...props}></MainLayout>
    }

    /**
     * Profile picture + name, surname, class
     */
    const {
        prenom,
        nom,
        profile: {
            photo: profilePhotoURI,
            classe: { libelle: classe }
        }
    } = account

    /**
     * Informations section
     */
    const {
        email,
        profile: {
            telPortable: phoneNumber
        }
    } = account


    /**
     * Badge cantine section
     */
    const cantineBadgeNumber = account.modules.filter(mod =>
        mod.code === "CANTINE_BARCODE"
    )[0].params.numeroBadge
    const { regime, ...repas } = account.modules.filter(mod =>
        mod.code === "RESERVATIONS"
    )[0].params

    let parsedRepas = { midi: [], soir: [] }
    Object.keys(repas).forEach(key => {
        const [timeRepas, dayIndex] = key.split("_")
        // - timeRepas.slice(5,9) : "midi" & "soir" are both 4 characters long
        // - "+" before string → convert it to number
        parsedRepas[timeRepas.slice(5, 9)][dayIndex - 1] = +repas[key]
    })

    return (
        <MainLayout {...props}>
            <ScrollView style={{
                paddingHorizontal: moderateScale(30)
            }}>
                {/* Profile */}
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: verticalScale(40)
                }}>
                    <Image
                        source={{
                            uri: "https:" + profilePhotoURI,
                            method: "GET",
                            headers: {
                                "Referer": "https://www.ecoledirecte.com/"
                            }
                        }}
                        resizeMode="cover"
                        style={{
                            height: moderateScale(100),
                            width: moderateScale(100),
                            borderRadius: moderateScale(50),
                            borderWidth: moderateScale(5),
                            borderColor: '#E9F2FF'
                        }}
                    />
                    <View style={{
                        marginLeft: moderateScale(25),
                        flex: 1
                    }}>
                        <Text
                            style={{
                                fontFamily: "Poppins_600SemiBold",
                                fontSize: moderateScale(20),
                                color: "#495564",
                                lineHeight: verticalScale(26)
                            }}
                        // | Adding this .replace() below to add "hair spaces" (less visible
                        // ↓ than normal spaces) that prevents bugs with text break.
                        >{prenom.replace(/-/gm, "\u200A-\u200A")}</Text>
                        <Text
                            // textBreakStrategy="balanced"
                            style={{
                                fontFamily: "Poppins_400Regular",
                                fontSize: moderateScale(20),
                                color: "#495564",
                                lineHeight: verticalScale(26),
                                textTransform: "capitalize"
                            }}
                        >{nom.replace(/-/gm, "\u200A-\u200A")}</Text>
                        <Text style={{
                            fontFamily: "Poppins_400Regular",
                            fontSize: moderateScale(12),
                            color: "#B7B7B7",
                            marginTop: verticalScale(10)
                        }}>{classe}</Text>
                    </View>
                </View>

                {/* Mes informations */}
                {(email || phoneNumber) && (
                    <View style={{
                        marginTop: verticalScale(40)
                    }}>
                        <SectionHeader
                            title="Mes informations"
                        />
                        <FormItem
                            label="Mon email"
                            value={email}
                            icon={icons.mail}
                            disabled
                        />
                        <FormItem
                            label="Mon téléphone"
                            value={phoneNumber.replace(/\./gm, " ")}
                            icon={icons.phone}
                            disabled
                        />
                    </View>
                )}

                {/* Mon badge cantine */}
                {(cantineBadgeNumber && regime && repas) && (
                    <View style={{
                        marginTop: verticalScale(40)
                    }}>
                        <SectionHeader
                            title="Mon badge cantine"
                            tag={regime}
                        />
                        <View style={{
                            marginVertical: verticalScale(15)
                        }}>
                            <Barcode
                                value={cantineBadgeNumber}
                                format="CODE39"
                                width={Dimensions.get("screen").width / 140}
                                height={verticalScale(65)}
                                lineColor="#495564"
                            />
                        </View>
                        {Object.keys(parsedRepas).map((timeRepas, index) => (
                            <View
                                key={index}
                                style={{
                                    paddingHorizontal: moderateScale(10),
                                    marginVertical: verticalScale(15)
                                }}
                            >
                                <Text style={{
                                    fontFamily: "Poppins_500Medium",
                                    fontSize: moderateScale(12),
                                    color: "#CFCFCF",
                                    marginBottom: verticalScale(10)
                                }}>Repas du {timeRepas}</Text>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                    {parsedRepas[timeRepas].map((isActive, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                backgroundColor: isActive ? "#E9F2FF" : "#F9F9F9",
                                                borderRadius: 999,
                                                width: moderateScale(35),
                                                height: moderateScale(35),
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Text style={{
                                                fontFamily: "Poppins_700Bold",
                                                fontSize: moderateScale(13),
                                                color: isActive ? "#1F86FF" : "#495564"
                                            }}>{WEEK_DAYS[index]}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View style={{
                    marginBottom: verticalScale(100)
                }}></View>
            </ScrollView>
        </MainLayout>
    )
}
