import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { verticalScale, moderateScale } from 'react-native-size-matters'
import dayjs from 'dayjs'

const TimeTableGrid = ({
    startHour,
    endHour,
    eventHourHeight,
    events,
    currentDate,
    getEventColors,
    timeIndicatorColor
}) => {
    let hours = []

    // Handling invalid startDate / endDate
    if (
        startHour > endHour ||
        !(startHour > 0 && startHour < 24) ||
        !(endHour > 0 && endHour < 24) ||
        !Number.isInteger(startHour) ||
        !Number.isInteger(endHour)
    ) {
        console.warn("[Timetable]: Invalid startDate and/or endDate")
    }

    for (let i = startHour; i <= endHour; i++) {
        hours.push(`${i}:00`)
    }

    return (
        <View style={{
            flexDirection: "row"
        }}>
            <View>
                {hours.map((hour, index) =>
                    <View
                        key={index}
                        style={{
                            height: eventHourHeight,
                            flexDirection: "row"
                        }}
                    >
                        <View style={{
                            borderTopColor: "#F2F2F2",
                            borderTopWidth: verticalScale(1.5),
                            width: moderateScale(40)
                        }}>

                        </View>
                        <View style={{
                            paddingTop: verticalScale(10)
                        }}>
                            <Text style={{
                                fontFamily: "Poppins_400Regular",
                                fontSize: moderateScale(13),
                                color: "#BEBFBF"
                            }}>{hour}</Text>
                        </View>
                    </View>
                )}
            </View>
            <View style={{
                flex: 1,
                marginHorizontal: moderateScale(30)
            }}>
                {events.map((event, index) =>
                    <EventCard
                        event={event}
                        calendarStartHour={startHour}
                        key={index}
                        getEventColors={getEventColors}
                        eventHourHeight={eventHourHeight}
                        currentCalendarDate={currentDate}
                    />
                )}
                <TimeIndicator
                    timeIndicatorColor={timeIndicatorColor}
                    calendarStartHour={startHour}
                    eventHourHeight={eventHourHeight}
                    currentCalendarDate={currentDate}
                />
            </View>
        </View>
    )
}

const EventCard = ({
    event,
    calendarStartHour,
    getEventColors,
    eventHourHeight,
    currentCalendarDate
}) => {
    const timeTableStartDate = dayjs(`${dayjs(currentCalendarDate || event.startDate).format("YYYY-MM-DD")} ${calendarStartHour}:00`)
    const marginTop = dayjs(event.startDate).diff(timeTableStartDate) / 3600000 * eventHourHeight
    const height = dayjs(event.endDate).diff(dayjs(event.startDate)) / 3600000 * eventHourHeight

    if (!event.matiere || !event.profs || !event.codeMatiere) {
        return null
    }

    const {
        backgroundColor,
        textColor
    } = getEventColors(event)

    return (
        <View style={{
            backgroundColor: backgroundColor,
            height: height - verticalScale(2),
            padding: moderateScale(20),
            borderRadius: moderateScale(10),
            position: "absolute",
            width: "100%",
            top: marginTop,
            marginVertical: verticalScale(1),
            opacity: event.canceled ? 0.3 : 1
        }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <Text style={{
                    fontFamily: "Poppins_500Medium",
                    lineHeight: moderateScale(12),
                    fontSize: moderateScale(10),
                    color: textColor,
                    opacity: 0.5
                }}>
                    {dayjs(event.startDate).format("HH:mm")} - {dayjs(event.endDate).format("HH:mm")}
                </Text>
                <Text
                    style={{
                        fontFamily: "Poppins_500Medium",
                        lineHeight: moderateScale(12),
                        fontSize: moderateScale(10),
                        color: textColor,
                        opacity: 0.5
                    }}
                    numberOfLines={2}
                >
                    {event.salle}
                </Text>
            </View>
            <Text
                style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: moderateScale(13),
                    color: textColor
                }}
                numberOfLines={1}
            >{event.matiere}</Text>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <Text
                    style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: moderateScale(12),
                        color: textColor,
                        opacity: 0.5,
                        flex: 1
                    }}
                    numberOfLines={2}
                >
                    {event.profs.map((prof, index) =>
                        `${prof}${!(index + 1 === event.profs.length) ? ", " : ""}`
                    )}
                </Text>

            </View>
        </View>
    )
}

const TimeIndicator = ({
    timeIndicatorColor,
    eventHourHeight,
    calendarStartHour,
    currentCalendarDate
}) => {
    if (
        !currentCalendarDate ||
        dayjs(currentCalendarDate).get("date") !== dayjs().get("date")
    ) {
        return null
    }

    const [currentTime, setCurrentTime] = useState(dayjs())

    useEffect(() => {
        const timeUpdater = setInterval(() => {
            setCurrentTime(dayjs())
        }, 1000);
        return () => {
            clearInterval(timeUpdater);
        };
    }, [])

    const timeTableStartDate = dayjs(`${dayjs(currentCalendarDate).format("YYYY-MM-DD")} ${calendarStartHour}:00`)
    const marginTop = dayjs().diff(timeTableStartDate) / 3600000 * eventHourHeight

    return (
        <View style={{
            position: "absolute",
            width: "100%",
            top: marginTop
        }}>
            <View style={{
                flexDirection: "row",
                alignItems: "center"
            }}>
                <View style={{
                    position: "absolute",
                    width: moderateScale(10),
                    height: moderateScale(10),
                    marginLeft: -moderateScale(10),
                    backgroundColor: timeIndicatorColor,
                    borderRadius: 999,
                }}>

                </View>
                <View style={{
                    width: "100%",
                    height: verticalScale(2),
                    backgroundColor: timeIndicatorColor
                }}></View>
            </View>
        </View>
    )
}

const TimeTable = (props) => {
    return (
        <ScrollView
            {...props.scrollViewProps}
        >
            <View style={{
                marginTop: verticalScale(50)
            }}>
                <TimeTableGrid
                    {...props.config}
                    {...props}
                />
            </View>
        </ScrollView>
    )
}

export default TimeTable