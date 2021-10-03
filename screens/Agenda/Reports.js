import React, { useRef, useState } from 'react'
import {
    View,
    Text,
    Animated,
    RefreshControl,
    Dimensions
} from 'react-native'
import RenderHtml from 'react-native-render-html'
import Calendar from '../../components/Calendar'
import FileItem from '../../components/FileItem'

import { base64UTF8Decode } from '../../utils';
import {
    verticalScale,
    moderateScale
} from "react-native-size-matters"
import dayjs from 'dayjs';

import { useSelector } from 'react-redux'
import useDownloadFileFromED from '../../hooks/api/useDownloadFileFromED'
import useHomework from '../../hooks/api/useHomework'

import { renderHtmlConfig } from '../../constants'

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
    const calendarEndDate = dayjs().format("YYYY-MM-DD")

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
                <Calendar
                    initialDate={dayjs().format("YYYY-MM-DD")}
                    onSelectDate={(date) => setCurrentDate(date)}
                    startDate={calendarStartDate}
                    endDate={calendarEndDate}
                    dateWidth={moderateScale(40)}
                    dateHeight={verticalScale(60)}
                    recyclerListViewProps={{
                        renderFooter: () => (
                            <View style={{
                                width: Dimensions.get("screen").width / 2 - moderateScale(20)
                            }}></View>
                        )
                    }}
                />
            </View>
        </Animated.View>
    )
}

const renderItem = ({ item }, {
    downloadFile,
    downloadProgress
}) => {
    const htmlContent = base64UTF8Decode(item.contenuDeSeance.contenu)

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
                <RenderHtml
                    contentWidth={Dimensions.get("window").width}
                    source={{ html: htmlContent }}
                    {...renderHtmlConfig}
                />
            </View>
            <View style={{
                marginHorizontal: moderateScale(30),
            }}>
                {item.contenuDeSeance.documents.map((file, key) => (
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

export default function Reports({ account }) {
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
                data={homework.matieres?.filter(item => !!item.contenuDeSeance.contenu)}
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