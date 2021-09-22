import React, { useState } from 'react'
import {
    View, Text, ScrollView,
    Image, TouchableOpacity, Platform
} from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import * as RNFS from "react-native-fs"
import * as mime from 'react-native-mime-types';
import { useWindowDimensions } from 'react-native'
import { moderateScale, verticalScale } from 'react-native-size-matters'

import * as Progress from 'react-native-progress'
import RenderHtml from 'react-native-render-html'
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

const useDownloadFileFromED = (token) => {
    const [downloadProgress, setDownloadProgress] = useState(1)

    const downloadFile = async (file, yearMessages, fileType) => {
        const { DownloadDir, DocumentDir } = RNFetchBlob.fs.dirs
        const directoryPath = Platform.select({
            ios: DocumentDir,
            android: DownloadDir,
        });
        const filename = file.libelle.replace(/\.[^/.]+$/, "")
        const fileExt = file.libelle.split(".").pop()
        const filePath = `${directoryPath}/${filename}`;

        const configOptions = Platform.select({
            ios: {
                fileCache: true,
                path: filePath,
                appendExt: fileExt,
                notification: true,
            },
            android: {
                fileCache: true,
                appendExt: fileExt
            }
        });

        setDownloadProgress(0)
        RNFetchBlob
            .config(configOptions)
            .fetch("POST",
                "https://api.ecoledirecte.com/v3/telechargement.awp?verbe=get",
                { "Content-Type": "application/x-www-form-urlencoded" },
                `leTypeDeFichier=${fileType}&fichierId=${file.id}&token=${token}&anneeMessages=${yearMessages || ""}`
            )
            .progress((loaded, total) => { setDownloadProgress(loaded / total) })
            .then(async (res) => {
                setDownloadProgress(1)
                if (Platform.OS === "android") {
                    RNFetchBlob.android.actionViewIntent(res.path(), mime.lookup(fileExt));
                }

                if (Platform.OS === "ios") {
                    RNFetchBlob.ios.openDocument(res.path())
                }
            })
            .catch(e => console.log(e))
    }

    return { downloadFile, downloadProgress }
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
    const fileExtension = file.libelle.split(".").pop()
    switch (fileExtension) {
        case "pdf":
        case "ppt":
        case "pptx":
        case "odf":
            color = "rgb(212, 115, 115)";
            break;
        case "html":
        case "xml":
        case "odt":
        case "doc":
        case "docx":
            color = "rgb(62, 116, 218)";
            break;
        case "png":
        case "mp4":
        case "jpg":
        case "jpeg":
            color = "rgb(246, 118, 166)"
            break;
        case "ods":
        case "xls":
        case "xlsx":
            color = "rgb(63, 158, 100)"
            break;
        case "txt":
        case "zip":
            color = "rgb(79, 86, 111)"
            break;
        default:
            color = "#B6B6B6";
            break;
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

const FileItem = ({ file, onPress }) => {
    return (
        <View
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
                paddingHorizontal: moderateScale(15),
                justifyContent: "center"
            }}>
                <Text
                    numberOfLines={1}
                    style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: moderateScale(12),
                        color: "#6E7079",
                    }}
                >{file.libelle}</Text>
                <Text style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: moderateScale(9),
                    color: "#CFCFCF"
                }}>Ajouté le {dayjs(file.date).format('D MMM YYYY')}</Text>
            </View>
            <TouchableOpacity
                style={{
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onPress={onPress}
            >
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
    )
}

export default function Message({ route, navigation }) {
    const { message, yearMessages } = route.params
    const { messageContent, error, loading } = useMessageContent(message, yearMessages)
    const { width } = useWindowDimensions()

    const { token } = useSelector(state => state.auth)

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
                    ) : (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Progress.CircleSnail color="#1F86FF" size={30} indeterminate={true} />
                        </View>

                        // <Text>Chargement...</Text>
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
                                    onPress={() => downloadFile(file, yearMessages, "PIECE_JOINTE")}
                                />
                            ))}
                        </View>
                    )}

                </View>
            </ScrollView>
            {downloadProgress !== 1 && (
                <View style={{
                    height: verticalScale(8)
                }}>
                    <Progress.Bar
                        height={verticalScale(6)}
                        width={null}
                        borderRadius={0}
                        color="#1F86FF"
                        borderColor="transparent"
                        progress={downloadProgress}
                    />
                </View>
            )}
            <View style={{
                height: 75,
                borderTopColor: "#F9F9F9",
                borderTopWidth: moderateScale(2)
            }}>

            </View>
        </View>
    )
}
