import React, { Component } from 'react'
import dayjs from 'dayjs';
import {
    Text, TouchableOpacity,
    Dimensions, StyleSheet,
    View
} from 'react-native'
import {
    RecyclerListView,
    DataProvider,
    LayoutProvider
} from 'recyclerlistview';

import { verticalScale, moderateScale } from 'react-native-size-matters';

const { width: screenWidth } = Dimensions.get('window');

const getDatesRange = (start, end) => {
    let date = dayjs(start)
    const endDate = dayjs(end)

    let dates = [date]
    while (date.diff(endDate) !== 0) {
        date = date.add(1, "day")
        dates.push(date)
    }
    return dates
}

export default class Calendar extends Component {
    constructor(props) {
        super(props)
        const {
            startDate,
            endDate,
            initialDate
        } = this.props

        this._dates = getDatesRange(startDate, endDate)
        this.state = {
            dataProvider: new DataProvider((r1, r2) => r1.date !== r2.date),
            scrollPositionX: 0,
            visibleMonth: "",
            extendedState: {
                currentDateIndex: initialDate ? this.getDateIndex(initialDate) : -1
            }
        }
    }

    getDateIndex = (date) => {
        return this._dates.findIndex((d) =>
            d.diff(dayjs(date)) === 0
        )
    }

    onPressDate = (date, index) => {
        this.setState({
            extendedState: {
                ...this.state.extendedState,
                currentDateIndex: index
            }
        })
        const scrollOffset = (index + 1) * this.props.dateWidth
            - screenWidth / 2 - this.props.dateWidth / 2

        this.props.onSelectDate(date)
        this._scrollView.scrollToOffset(scrollOffset)
    }

    componentDidMount() {
        this.setState({
            dataProvider: this.state.dataProvider.cloneWithRows(this._dates)
        })
    }

    layoutProvider = new LayoutProvider((index) => {
        return index;
    }, (type, dim) => {
        dim.width = this.props.dateWidth
        dim.height = this.props.dateHeight
    })

    rowRenderer = (type, date, index, extendedState) => {
        const isActive = index === extendedState.currentDateIndex
        const isInitialDate = index === this.getDateIndex(this.props.initialDate)

        return (
            <TouchableOpacity
                style={[dateStyles.dateWrapper, {
                    backgroundColor: isActive ? "#E9F2FF" : "transparent",
                    width: this.props.dateWidth,
                    height: this.props.dateHeight
                }]}
                onPress={() => this.onPressDate(this._dates[type], type)}
                key={index}
            >
                <Text style={[dateStyles.dayLetterStyle, {
                    fontFamily: isActive || isInitialDate ? "Inter_600SemiBold" : "Inter_400Regular",
                    color: isActive ? "#1F86FF" : "#6E7079"
                }]}>
                    {date.format("dd")[0].toUpperCase()}
                </Text>
                <Text style={[dateStyles.dateNumberStyle, {
                    fontFamily: isActive || isInitialDate ? "Inter_600SemiBold" : "Inter_500Medium",
                    color: isActive ? "#1F86FF" : isInitialDate ? "#999999" : "#495564"
                }]}>
                    {date.format("DD")}
                </Text>
                {this.props.datesWithIndicator?.includes(date.format("YYYY-MM-DD")) && (
                    <View style={{
                        position: "absolute",
                        backgroundColor: "#1F86FF",
                        width: moderateScale(4),
                        height: moderateScale(4),
                        borderRadius: 999,
                        bottom: verticalScale(7.5)
                    }}></View>
                )}
            </TouchableOpacity>
        )
    }

    updateVisibleMonth = () => {
        const { scrollPositionX } = this.state

        let datePositionX = 0
        let firstVisibleDateIndex = null
        let lastVisibleDateIndex = null

        this._dates.forEach((date, index) => {
            if (
                firstVisibleDateIndex === null &&
                datePositionX >= scrollPositionX
            ) {
                firstVisibleDateIndex = index > 0 ? index - 1 : index
            }

            if (
                lastVisibleDateIndex === null &&
                datePositionX >= scrollPositionX + screenWidth
            ) {
                lastVisibleDateIndex = index - 1
            }

            datePositionX += this.props.dateWidth

            return !!(firstVisibleDateIndex && lastVisibleDateIndex)
        })

        if (firstVisibleDateIndex === null) {
            lastVisibleDateIndex = 0
        }

        if (lastVisibleDateIndex === null) {
            lastVisibleDateIndex = this._dates.length - 1
        }

        const firstVisibleDate = this._dates[firstVisibleDateIndex]
        const lastVisibleDate = this._dates[lastVisibleDateIndex]

        const visibleMonth = firstVisibleDate.get("month") === lastVisibleDate.get("month") ?
            `${firstVisibleDate.format("MMMM")}` :
            `${firstVisibleDate.format("MMMM")}-${lastVisibleDate.format("MMMM")}`

        this.setState({
            visibleMonth
        })
    }

    render() {
        const {
            dateHeight,
            dateWidth,
            initialDate
        } = this.props

        const initialDateIndex = initialDate ?
            this.getDateIndex(initialDate) :
            this.getDateIndex(dayjs().format("YYYY-MM-DD")) // index of today
        const initialScrollOffset = (initialDateIndex + 1) * dateWidth
            - screenWidth / 2 - dateWidth / 2

        return (
            <View
                style={{
                    height: "100%",
                    width: "100%",
                    justifyContent: "center"
                }}
            >
                <View >
                    <Text style={{
                        fontFamily: "Inter_600SemiBold",
                        textTransform: "uppercase",
                        fontSize: moderateScale(10),
                        color: "#CFCFCF",
                        letterSpacing: moderateScale(2),
                        alignSelf: "flex-start",
                        marginLeft: moderateScale(25),
                        marginBottom: verticalScale(4)
                    }}>
                        {this.state.visibleMonth}
                    </Text>
                    <RecyclerListView
                        isHorizontal={true}
                        dataProvider={this.state.dataProvider}
                        layoutProvider={this.layoutProvider}
                        rowRenderer={this.rowRenderer}
                        initialOffset={initialScrollOffset}
                        showsHorizontalScrollIndicator={false}
                        extendedState={this.state.extendedState}
                        ref={scrollView => { this._scrollView = scrollView }}
                        onScroll={(event) => {
                            const { nativeEvent: { contentOffset: { x } } } = event
                            this.setState({ scrollPositionX: x }, this.updateVisibleMonth)
                        }}
                        {...this.props.recyclerListViewProps}

                        style={{
                            height: dateHeight,
                            width: "100%"
                        }}
                    />
                </View>
            </View>
        )
    }
}

const dateStyles = StyleSheet.create({
    dateWrapper: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: verticalScale(10),
        borderRadius: 999
    },
    dateNumberStyle: {
        fontSize: moderateScale(15),
        textAlign: "center",
        paddingVertical: verticalScale(1),
    },
    dayLetterStyle: {
        fontSize: moderateScale(10),
        textAlign: "center",
        paddingVertical: verticalScale(1),
    }
})