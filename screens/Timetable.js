import React, { useState } from 'react'
import useDidMountEffect from '../hooks/useDidMountEffect'
import {
    View,
    RefreshControl
} from 'react-native'
import {
    verticalScale,
    moderateScale
} from 'react-native-size-matters'
import dayjs from 'dayjs'

import useTimetableEvents from '../hooks/api/useTimetableEvents'

import TimeTable from '../components/TimeTable'
import Calendar from '../components/Calendar'
import MainLayout from './MainLayout'



export default function Timetable(props) {
    const [currentDate, setCurrentDate] = useState(dayjs())

    const {
        events,
        error,
        loading,
        refetchTimelineEvents
    } = useTimetableEvents(currentDate)

    useDidMountEffect(() => {
        refetchTimelineEvents()
    }, [currentDate])

    return (
        <MainLayout {...props} >
            <View style={{
                height: verticalScale(90),
                borderBottomColor: "#F9F9F9",
                borderBottomWidth: verticalScale(1)
            }}>
                <View style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Calendar
                        initialDate={dayjs().format("YYYY-MM-DD")}
                        onSelectDate={(date) => setCurrentDate(date)}
                        startDate="2021-09-01"
                        endDate="2022-09-01"
                        dateWidth={moderateScale(40)}
                        dateHeight={verticalScale(60)}
                    />
                </View>
            </View>
            <View style={{
                flex: 1
            }}>
                <TimeTable
                    config={{
                        startHour: 8,
                        endHour: 22,
                        eventHourHeight: verticalScale(100),
                        currentDate: currentDate.format("YYYY-MM-DD")
                    }}
                    events={events}
                    getEventColors={(event) => {
                        switch (event.codeMatiere) {
                            case "FRANC":
                                return {
                                    backgroundColor: "#EEEBFA",
                                    textColor: "#9A89CE"
                                }
                            case "HI-GE":
                                return {
                                    backgroundColor: "#E9F4F5",
                                    textColor: "#6CABAC"
                                }
                            case "ALL1":
                                return {
                                    backgroundColor: "#DCFCEF",
                                    textColor: "#478970"
                                }
                            case "MATHS":
                                return {
                                    backgroundColor: "#DDEFFB",
                                    textColor: "#4C668B"
                                }
                            case "SLA":
                                return {
                                    backgroundColor: "#FDEEEA",
                                    textColor: "#E1A793"
                                }
                            case "ENSC":
                                return {
                                    backgroundColor: "#FDEBDD",
                                    textColor: "#E6B26A"
                                }
                            case "HGGSP":
                                return {
                                    backgroundColor: "#FFE4E4",
                                    textColor: "#9F8081"
                                }
                            case "LCALA":
                                return {
                                    backgroundColor: "#E7F8F2",
                                    textColor: "#67BF90"
                                }
                            case "PH-CH":
                                return {
                                    backgroundColor: "#F5F3FF",
                                    textColor: "#B6AEE8"
                                }
                            default:
                                return {
                                    backgroundColor: "#E9F2FF",
                                    textColor: "#1F86FF"
                                }
                        }
                    }}
                    timeIndicatorColor="#1F86FF"
                    scrollViewProps={{
                        refreshControl: (
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={() => refetchTimelineEvents()}
                                colors={["#1F86FF"]}
                                tintColor="#1F86FF"
                            />
                        )
                    }}
                />
            </View>
        </MainLayout >
    )
}
