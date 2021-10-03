import dayjs from 'dayjs';
import React, { useRef, useState } from 'react'
import * as Progress from 'react-native-progress'
import {
    View,
    Text,
    Animated,
    RefreshControl,
    Dimensions,
    Image
} from 'react-native'
import Calendar from "../../components/Calendar"
import RenderHtml from 'react-native-render-html'
import FileItem from '../../components/FileItem'

import { verticalScale, moderateScale } from "react-native-size-matters"
import base64UTF8Decode from "../../utils/base64UTF8Decode"

import { useSelector } from 'react-redux';
import useDatesWithHomework from '../../hooks/api/useDatesWithHomework'
import useHomework from '../../hooks/api/useHomework'
import useDownloadFileFromED from '../../hooks/api/useDownloadFileFromED'

import { icons, renderHtmlConfig } from "../../constants"

const DATEPICKER_HEADER_HEIGHT = verticalScale(90)

const DatePickerHeader = ({
    flatListScrollY,
    setCurrentDate,
    account
}) => {
    const translateY = Animated
        .diffClamp(flatListScrollY.current, 0, DATEPICKER_HEADER_HEIGHT)
        .interpolate({
            inputRange: [0, DATEPICKER_HEADER_HEIGHT],
            outputRange: [0, -(DATEPICKER_HEADER_HEIGHT)],
            extrapolateLeft: 'clamp'
        })
    const calendarStartDate = account.anneeScolaireCourante.split("-")[0] + "-09-01"
    const calendarEndDate = account.anneeScolaireCourante.split("-")[1] + "-09-01"

    const { datesWithHomework, error, loading } = useDatesWithHomework()

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                width: '100%',
                backgroundColor: "#FFFFFF",
                borderBottomColor: "#F9F9F9",
                borderBottomWidth: verticalScale(1),
                transform: [{ translateY }]
            }}
        >
            <View style={{
                height: DATEPICKER_HEADER_HEIGHT,
                justifyContent: "center",
                alignItems: "center"
            }}>
                {loading ? (
                    <Progress.CircleSnail
                        color="#1F86FF"
                        size={moderateScale(30)}
                        indeterminate={true}
                        thickness={moderateScale(3)}
                    />
                ) : error ? (
                    <Text style={{
                        fontFamily: "Poppins_400Regular",
                        color: "#FC7D7D",
                        fontSize: moderateScale(13)
                    }}>Une erreur est survenue :/</Text>
                ) : (
                    <Calendar
                        initialDate={dayjs().format("YYYY-MM-DD")}
                        onSelectDate={(date) => setCurrentDate(date)}
                        startDate={calendarStartDate}
                        endDate={calendarEndDate}
                        datesWithIndicator={datesWithHomework}
                        dateWidth={moderateScale(40)}
                        dateHeight={verticalScale(60)}
                    />
                )}

            </View>
        </Animated.View>
    )
}

const renderItem = ({ item }, {
    downloadFile,
    downloadProgress
}) => {
    const htmlContent = base64UTF8Decode(item.aFaire.contenu)

    return (
        <View style={{
            marginTop: verticalScale(50)
        }}>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <View style={{
                        borderTopRightRadius: moderateScale(5),
                        borderBottomRightRadius: moderateScale(5),
                        backgroundColor: "#1F86FF",
                        width: moderateScale(20),
                        height: moderateScale(10)
                    }}></View>
                    <Text style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: moderateScale(13),
                        color: "#6E7079",
                        marginLeft: moderateScale(10)
                    }}>
                        {item.matiere}
                    </Text>
                </View>

            </View>
            <View style={{
                marginHorizontal: moderateScale(30),
                padding: moderateScale(20),
                borderWidth: moderateScale(1.5),
                borderColor: "#F9F9F9",
                borderRadius: moderateScale(15),
                marginTop: verticalScale(10),
                marginBottom: verticalScale(5)
            }}>
                {item.interrogation && (
                    <View style={{
                        alignItems: "flex-start"
                    }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#FFE4E4",
                            paddingVertical: verticalScale(3),
                            paddingHorizontal: moderateScale(15),
                            borderRadius: 999
                        }}>
                            <Image
                                source={icons.warning}
                                style={{
                                    tintColor: "#FC7D7D",
                                    width: moderateScale(13),
                                    height: moderateScale(13),
                                    marginRight: moderateScale(10)
                                }}
                            />
                            <Text style={{
                                color: "#FC7D7D",
                                fontFamily: "Inter_500Medium",
                                fontSize: moderateScale(13)
                            }}>Contrôle </Text>
                        </View>
                    </View>
                )}
                <RenderHtml
                    contentWidth={Dimensions.get("window").width}
                    source={{ html: htmlContent }}
                    {...renderHtmlConfig}
                />

                <Text style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: moderateScale(12),
                    color: "#BEBFBF"
                }}>
                    (Donné le {dayjs(item.aFaire.donneLe).format("DD MMM")}{item.nomProf})
                </Text>
            </View>
            <View style={{
                marginHorizontal: moderateScale(30),
            }}>
                {item.aFaire.documents.map((file, key) => (
                    <FileItem
                        key={key}
                        file={file}
                        onPress={() => downloadFile(file, {
                            leTypeDeFichier: file.type
                        })}
                        downloadingFile={downloadProgress !== 1}
                    />
                ))}
            </View>
        </View>
    )
}

export default function Homework({ account }) {
    const flatListScrollY = useRef(new Animated.Value(0))
    const [currentDate, setCurrentDate] = useState(dayjs())

    const { homework, loading, error, refetchHomework } = useHomework(currentDate)
    const { token } = useSelector(state => state.auth)
    const { downloadFile, downloadProgress } = useDownloadFileFromED(token)

    return (
        <>
            <Animated.FlatList
                contentInset={{ top: DATEPICKER_HEADER_HEIGHT }}
                contentOffset={{ y: -DATEPICKER_HEADER_HEIGHT }}
                overScrollMode="never"
                onScroll={Animated.event(
                    [{
                        nativeEvent: {
                            contentOffset: { y: flatListScrollY.current },
                        }
                    }],
                    { useNativeDriver: true }
                )}
                refreshControl={
                    <RefreshControl
                        onRefresh={refetchHomework}
                        refreshing={loading}
                        colors={['#1F86FF']}
                        tintColor={['#1F86FF']}
                        progressViewOffset={DATEPICKER_HEADER_HEIGHT}
                    />
                }
                data={homework.matieres?.filter(item => !!item.aFaire) || []}
                contentContainerStyle={{
                    paddingTop: DATEPICKER_HEADER_HEIGHT
                }}
                renderItem={(props) => renderItem(props, {
                    downloadFile,
                    downloadProgress
                })}
                ListFooterComponent={() =>
                    <View style={{
                        marginBottom: verticalScale(100)
                    }}></View>
                }
                keyExtractor={(item, index) => index.toString()}
            />
            <DatePickerHeader
                flatListScrollY={flatListScrollY}
                setCurrentDate={setCurrentDate}
                account={account}
            />
        </>
    )
}
