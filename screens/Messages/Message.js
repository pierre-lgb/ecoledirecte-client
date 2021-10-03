import React from "react"
import {
    View, Text, ScrollView
} from 'react-native'
import RenderHtml from 'react-native-render-html'
import FileItem from "../../components/FileItem"
import StackHeader from '../../components/StackHeader'
import DownloadProgressBar from "../../components/DownloadProgressBar"
import * as Progress from 'react-native-progress'

import { useWindowDimensions } from 'react-native'
import { moderateScale, verticalScale } from 'react-native-size-matters'
import { useSelector } from 'react-redux'

import useMessageContent from '../../hooks/api/useMessageContent'
import useDownloadFileFromED from '../../hooks/api/useDownloadFileFromED'

import { renderHtmlConfig } from "../../constants"


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

export default function Message({ route, navigation }) {
    const { message, yearMessages } = route.params
    const { width } = useWindowDimensions()

    const { token } = useSelector(state => state.auth)
    const { messageContent, error, loading } = useMessageContent(message, yearMessages)
    const { downloadFile, downloadProgress } = useDownloadFileFromED(token)

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
                        lineHeight: verticalScale(25),
                        color: "#495564",
                        marginTop: verticalScale(50),
                        marginBottom: verticalScale(30)

                    }}>
                        {message.subject}
                    </Text>

                    {loading ? (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Progress.CircleSnail color="#1F86FF" size={30} indeterminate={true} />
                        </View>

                    ) : (
                        <RenderHtml
                            contentWidth={width}
                            source={{ html: messageContent }}
                            {...renderHtmlConfig}
                        />
                    )}


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
                                <FileItem
                                    key={key}
                                    file={file}
                                    onPress={() => downloadFile(file, {
                                        anneeMessages: yearMessages || "",
                                        leTypeDeFichier: "PIECE_JOINTE"
                                    })}
                                    downloadingFile={downloadProgress !== 1}
                                />
                            ))}
                        </View>
                    )}

                </View>
            </ScrollView>
            <DownloadProgressBar downloadProgress={downloadProgress} />
            <View style={{
                height: verticalScale(75),
                borderTopColor: "#F9F9F9",
                borderTopWidth: moderateScale(2)
            }}>

            </View>
        </View>
    )
}
