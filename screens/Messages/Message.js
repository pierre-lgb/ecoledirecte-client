import React from 'react'
import {
    View, Text, ScrollView,
    Image, TouchableOpacity
} from 'react-native'
import NativeBlobModule from 'react-native/Libraries/Blob/NativeBlobModule';
import { moderateScale, verticalScale } from 'react-native-size-matters'
import { useWindowDimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'
import * as FileSystem from "expo-file-system"
import * as MediaLibrary from 'expo-media-library';
import axios from "axios"

import StackHeader from '../../components/StackHeader'
import useMessageContent from '../../hooks/api/useMessageContent'

import dayjs from 'dayjs';
import { icons } from '../../constants'
import { useSelector } from 'react-redux'

const renderHtmlConfig = {
    tagsStyles: {
        p: {
            fontFamily: "Inter_400Regular",
            color: "#999999",
            fontSize: moderateScale(12),
            marginVertical: verticalScale(5)
        },
        a: {
            color: '#1F86FF',
            // textDecorationLine: "none",
            // backgroundColor: "#E9F2FF",
            fontSize: moderateScale(12)
        }
    },
    ignoredStyles: ["fontSize"],
    systemFonts: ["Inter_400Regular"]
}

const MessageHeader = ({ message }) => {
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: verticalScale(30),
            marginBottom: verticalScale(20)
        }}>
            <View style={{
                width: moderateScale(40),
                height: moderateScale(40),
                backgroundColor: "#F9F9F9",
                borderRadius: moderateScale(20),
                alignItems: "center",
                justifyContent: "center",
                marginRight: moderateScale(20)
            }}>
                <Text style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: moderateScale(13)
                }}>
                    <Text style={{ color: "#1F86FFFF" }}>{message.from.prenom[0]}</Text>
                    <Text style={{ color: "#1F86FF77" }}>{message.from.nom[0]}</Text>
                </Text>
            </View>
            <View>
                <Text
                    style={{
                        fontFamily: "Inter_600SemiBold",
                        color: "#6E7079",
                        fontSize: moderateScale(13),
                        marginBottom: verticalScale(3)
                    }}
                >
                    <Text>{message.from.name}</Text>
                </Text>
                <View style={{ flexDirection: "row" }}>
                    <Text
                        style={{
                            fontFamily: "Inter_400Regular",
                            color: "#CFCFCF",
                            fontSize: moderateScale(10)
                        }}
                        numberOfLines={1}
                    >
                        {message.mtype === "received" ? (
                            <Text>À moi</Text>
                        ) : (
                            <Text numberOfLines={1}> À {message.to.map((dest, index) =>
                                `${(index > 0) ? "," : ""} ${dest.name}`
                            )}</Text>
                        )}
                    </Text>
                    {(message.to_cc_cci !== "" && message.to_cc_cci !== "to") && (
                        <Text style={{
                            borderColor: "#CFCFCF",
                            borderWidth: moderateScale(1),
                            borderRadius: moderateScale(5),
                            fontFamily: "Inter_500Medium",
                            color: "#CFCFCF",
                            paddingHorizontal: moderateScale(2),
                            textAlign: "center",
                            marginLeft: moderateScale(6),
                            fontSize: moderateScale(10)
                        }}>
                            {message.to_cc_cci.toUpperCase()}
                        </Text>
                    )}

                </View>
            </View>
        </View>
    )
}

const FileIcon = ({ file }) => {
    let color;
    // const fileExtension = file.libelle.split(".").pop()
    const fileExtension = "pdf"
    switch (fileExtension) {
        case "pdf":
            color = "#D47373"
            break;
        default:
            color = "#B6B6B6"
    }

    return (
        <View>
            <Image
                source={icons.fileBlank}
                style={{
                    tintColor: color,
                    width: moderateScale(40),
                    height: moderateScale(40)
                }}
            />
            <View style={{
                backgroundColor: "#FFFFFF",
                paddingHorizontal: moderateScale(2),
                position: "absolute",
                left: moderateScale(10),
                bottom: moderateScale(5)
            }}>
                <Text
                    style={{
                        fontFamily: "Poppins_700Bold",
                        fontSize: moderateScale(8),
                        color
                    }}
                >{fileExtension.toUpperCase()}</Text>
            </View>
        </View>
    )
}

const saveFile = async (fileUri) => {
    console.log(fileUri)
    // await Sharing.shareAsync(fileUri);
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status === "granted") {
        console.log("Permissions granted")
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        console.log("ASSET:", asset)
        const album = await MediaLibrary.getAlbumAsync('EDClient');
        if (album == null) {
            await MediaLibrary.createAlbumAsync('EDClient', asset, false).catch(e => console.log(e));
        } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false).catch(e => console.log(e));
        }
    }
}

export default function Message({ route, navigation }) {
    const { message, yearMessages } = route.params
    const { messageContent, error, loading } = useMessageContent(message, yearMessages)
    const { width } = useWindowDimensions()

    const { token } = useSelector(state => state.auth)

    React.useEffect(() => {
        try {
            axios.post(
                "https://api.ecoledirecte.com/v3/telechargement.awp?verbe=post&&annee-messages=2021-2022&fichierId=901&leTypeDeFichier=PIECE_JOINTE",
                `data={ "token": "${token}"}`,
                {
                    headers: {
                        "referer": "https://www.ecoledirecte.com/"
                    },
                    responseType: "blob"
                }
            )
                .then(async (response) => {
                    const fr = new FileReader();
                    fr.onload = async (e) => {
                        const fileUri = `${FileSystem.documentDirectory}my-great-document.pdf`;
                        const result = await FileSystem.writeAsStringAsync(fileUri, fr.result.split(',')[1], { encoding: FileSystem.EncodingType.Base64 });
                        saveFile(fileUri);
                    }
                    fr.readAsDataURL(response.data);
                })
                .catch(e => console.log(e))
        } catch (e) {
            console.log(e)
        }
    }, [])

    return (
        <View style={{
            flex: 1,
            backgroundColor: "#FFFFFF"
        }}>
            <StackHeader goBack={navigation.pop} />

            <ScrollView style={{
                flex: 1,
                paddingHorizontal: moderateScale(40)
            }}>
                <View style={{
                    paddingBottom: verticalScale(50)
                }}>
                    <MessageHeader message={message} />
                    <View style={{ height: verticalScale(1), backgroundColor: "#F9F9F9" }}></View>

                    <Text style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: moderateScale(20),
                        lineHeight: verticalScale(20),
                        color: "#495564",
                        marginTop: verticalScale(50),
                        marginBottom: verticalScale(30)

                    }}>
                        {message.subject}
                    </Text>

                    {messageContent ? (
                        <RenderHtml
                            contentWidth={width}
                            source={{ html: messageContent }}
                            {...renderHtmlConfig}
                        />
                    ) : <Text>Chargement...</Text>}


                    {message.files.length > 0 && (
                        <View>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: verticalScale(50),
                                marginBottom: verticalScale(10)
                            }}>
                                <Text style={{
                                    fontFamily: "Inter_500Medium",
                                    fontSize: moderateScale(12),
                                    color: "#6E7079",
                                }}>Fichiers joints </Text>
                                <View style={{
                                    height: verticalScale(1),
                                    backgroundColor: "#F9F9F9",
                                    marginLeft: moderateScale(10),
                                    flex: 1
                                }}></View>
                            </View>
                            {message.files.map((file, key) => (
                                <View
                                    key={key}
                                    style={{
                                        borderColor: "#E6E9EB",
                                        borderWidth: moderateScale(1),
                                        borderRadius: moderateScale(7),
                                        paddingVertical: verticalScale(10),
                                        paddingHorizontal: moderateScale(20),
                                        marginVertical: verticalScale(5),
                                        flexDirection: "row"
                                    }}
                                >
                                    <View>
                                        <FileIcon file={file} />
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        paddingHorizontal: moderateScale(10),
                                        justifyContent: "center"
                                    }}>
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: "Inter_600SemiBold",
                                                fontSize: moderateScale(13),
                                                color: "#6E7079",
                                            }}
                                        >{file.libelle}</Text>
                                        <Text style={{
                                            fontFamily: "Inter_400Regular",
                                            fontSize: moderateScale(10),
                                            color: "#CFCFCF"
                                        }}>Ajouté le {dayjs(message.date).format('D MMM YYYY')}</Text>
                                    </View>
                                    <TouchableOpacity style={{
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <Image
                                            source={icons.download}
                                            style={{
                                                tintColor: "#1F86FF",
                                                width: moderateScale(20),
                                                height: moderateScale(20)
                                            }}
                                        />
                                    </TouchableOpacity>

                                </View>
                            ))}
                        </View>
                    )}

                </View>
            </ScrollView>
            <View style={{
                height: 75,
                borderTopColor: "#F9F9F9",
                borderTopWidth: moderateScale(2)
            }}>

            </View>
        </View>
    )
}
