import React, { memo } from "react"
import { View, Text, Image, TouchableOpacity } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

import dayjs from 'dayjs';
import { icons } from "../constants";

const FileIcon = ({ file }) => {
    let color;
    const fileExtension = file.libelle.split(".").length > 1 ? file.libelle.split(".").pop() : ""
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
                paddingHorizontal: moderateScale(3),
                position: "absolute",
                left: moderateScale(12),
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

const FileItem = memo(({ file, onPress, downloadingFile }) => {
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
                disabled={downloadingFile}
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
})

export default FileItem