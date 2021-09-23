import React, { useState, useEffect, useRef, memo } from "react";
import {
    Text, View, Animated,
    Image, TouchableOpacity,
    TextInput, RefreshControl
} from "react-native";
import {
    BottomModal, BottomModalOption,
    BottomModalDivider, BottomModalRadio,
    BottomModalButton,
    BottomModalChoice
} from "../../components/BottomModal"
import MainLayout from "../MainLayout";
import useMessages from '../../hooks/api/useMessages';
import { useSelector } from "react-redux";

import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import dayjs from 'dayjs';

import { icons } from "../../constants";
const SEARCHBAR_HEADER_HEIGHT = verticalScale(75)

const SearchBarHeader = ({ flatListScrollY, setBoxModalVisible, query, setQuery }) => {
    const translateY = Animated
        .diffClamp(flatListScrollY.current, 0, SEARCHBAR_HEADER_HEIGHT)
        .interpolate({
            inputRange: [0, SEARCHBAR_HEADER_HEIGHT],
            outputRange: [0, -(SEARCHBAR_HEADER_HEIGHT)],
            extrapolateLeft: 'clamp'
        })

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                width: '100%',
                backgroundColor: "#FFFFFF",
                borderBottomColor: "#F9F9F9",
                borderBottomWidth: 1,
                transform: [{ translateY }]
            }}
        >
            <View style={{
                height: SEARCHBAR_HEADER_HEIGHT,
                justifyContent: "center",
                alignItems: "center",
                // paddingVertical: verticalScale(15),
                paddingHorizontal: moderateScale(40)
            }}>
                <View style={{
                    backgroundColor: "#FDFDFD",
                    width: "100%",
                    borderRadius: moderateScale(6),
                    borderWidth: 1.5,
                    borderColor: "#F5F5F5",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: moderateScale(5)
                }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#E9F2FF",
                            borderRadius: moderateScale(6),
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        onPress={() => setBoxModalVisible(true)}
                    >
                        <Image
                            source={icons.inbox}
                            style={{
                                width: scale(20),
                                height: scale(20),
                                tintColor: "#1F86FF",
                                margin: moderateScale(5)
                            }}
                        />
                    </TouchableOpacity>
                    <View style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: moderateScale(20)
                    }}>
                        <Image
                            source={icons.search}
                            style={{
                                width: moderateScale(18),
                                height: moderateScale(18),
                                tintColor: "#CFCFCF",
                                marginRight: moderateScale(10)
                            }}
                        />
                        <TextInput
                            placeholder="Rechercher..."
                            placeholderTextColor="#CFCFCF"
                            style={{
                                flex: 1,
                                color: "#6E7079",
                                textAlignVertical: "center",
                                fontFamily: "Inter_400Regular",
                                fontSize: moderateScale(12)
                            }}
                            onSubmitEditing={(value) => {
                                setQuery(value.nativeEvent.text)
                            }}
                        />
                    </View>
                </View>
            </View>
        </Animated.View>
    )
}

const BoxModal = ({ visible, setVisible, classeurs, idClasseur, setIdClasseur, box, setBox, yearMessages, setYearMessages }) => {
    const { accounts } = useSelector(state => state.auth)
    const currentYear = accounts[0].anneeScolaireCourante
    const previousYear = currentYear.split("-").map(part => +part - 1).join("-")

    return (
        <BottomModal
            visible={visible}
            setVisible={(status) => {
                setVisible(status)
            }}
            title="Boîtes"
        >
            <View style={{
                flexDirection: "row"
            }}>
                <BottomModalChoice
                    label={previousYear}
                    selected={yearMessages === previousYear}
                    onPress={() => {
                        setYearMessages(previousYear)
                        setIdClasseur(0) // If user was in a "classeur", send it back to main Inbox.
                    }}
                />
                <BottomModalChoice
                    label={currentYear}
                    selected={yearMessages === currentYear || !yearMessages}
                    onPress={() => {
                        setYearMessages(currentYear)
                        setIdClasseur(0)
                    }}
                />
            </View>

            <BottomModalDivider />

            <BottomModalOption
                icon={icons.inbox}
                label="Boîte de réception"
                onPress={() => {
                    setBox("received")
                    setIdClasseur(0)
                }}
                selected={box === "received" && idClasseur === 0}
            />
            <BottomModalOption
                icon={icons.send}
                label="Envoyés"
                onPress={() => setBox("sent")}
                selected={box === "sent"}
            />
            <BottomModalOption
                icon={icons.draft}
                label="Brouillons"
                onPress={() => setBox("draft")}
                selected={box === "draft"}
            />
            <BottomModalOption
                icon={icons.box}
                label="Archivés"
                onPress={() => setBox("archived")}
                selected={box === "archived"}
            />

            <BottomModalDivider />

            {/* Custom folders */}
            {classeurs.map((classeur, key) => (
                <BottomModalOption
                    icon={icons.folder}
                    label={classeur.libelle}
                    onPress={() => {
                        setBox("received")
                        setIdClasseur(classeur.id)
                    }}
                    selected={box === "received" && idClasseur === classeur.id}
                    key={key}
                />
            ))}

            <BottomModalButton
                icon={icons.addFolder}
                label="Nouveau dossier"
                style={{
                    marginTop: verticalScale(10)
                }}
            />
        </BottomModal>
    )
}

const MessageItem = memo(({ message, yearMessages, navigation }) => {
    const [disabled, setDisabled] = useState(false)
    const [read, setRead] = useState(message.read)

    return (
        <TouchableOpacity
            style={{
                backgroundColor: "#ffffff",
                paddingVertical: verticalScale(10),
                paddingHorizontal: moderateScale(30),
                marginBottom: verticalScale(10),
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
            }}
            disabled={disabled}
            onPress={() => {
                setRead(true)
                setDisabled(true) // Prevents opening the screen multiple times when spam clicking
                if (!message.brouillon) {
                    navigation.navigate("Messages", {
                        screen: "ViewMessage",
                        message,
                        yearMessages
                    })
                } else {
                    // ...
                }
                setTimeout(() => {
                    setDisabled(false)
                }, 500)
            }}
        >
            <View style={{
                alignItems: "center",
                justifyContent: "center"
            }}>
                <View style={{
                    width: moderateScale(40),
                    height: moderateScale(40),
                    backgroundColor: "#F9F9F9",
                    borderRadius: moderateScale(20),
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={{
                        fontFamily: "Poppins_700Bold",
                        fontSize: moderateScale(13)
                    }}>
                        <Text style={{ color: "#1F86FFFF" }}>{message.from.prenom[0]}</Text>
                        <Text style={{ color: "#1F86FF77" }}>{message.from.nom[0]}</Text>
                    </Text>
                </View>
            </View>
            <View style={{
                marginHorizontal: moderateScale(15),
                flex: 1
            }}>
                <Text
                    style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: moderateScale(10),
                        color: "#CFCFCF",
                        marginBottom: verticalScale(5)
                    }}
                    numberOfLines={1}
                >
                    {message.mtype === "received" ? (
                        <>
                            <Text>{message.from.civilite} </Text>
                            <Text style={{ textTransform: "capitalize" }}>{message.from.prenom}</Text>
                            <Text> {message.from.nom}</Text>
                        </>
                    ) : (
                        <Text>
                            À {message.to.map((dest, index) => `${(index > 0) ? "," : ""} ${dest.name}`)}
                        </Text>
                    )}
                </Text>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: verticalScale(10)
                }}>
                    {!read && (
                        <View style={{
                            width: moderateScale(6),
                            height: moderateScale(6),
                            borderRadius: moderateScale(6),
                            marginRight: moderateScale(8),
                            backgroundColor: "#1F86FF"
                        }}></View>
                    )}
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            fontFamily: "Inter_600SemiBold",
                            fontSize: moderateScale(13),
                            color: "#6E7079"
                        }}
                    >{message.subject}</Text>
                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <Image
                        source={icons.calendar}
                        style={{
                            width: moderateScale(16),
                            height: moderateScale(16),
                            tintColor: "#BEBFBF",
                            marginRight: moderateScale(7)
                        }}
                    />
                    <Text style={{
                        fontFamily: "Poppins_400Regular",
                        fontSize: moderateScale(10),
                        color: "#BEBFBF"
                    }}>{dayjs(message.date).format('D MMM YYYY à HH:mm')}</Text>
                </View>
            </View>
            {message.files.length ? (
                <View style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginHorizontal: moderateScale(8)
                }}>
                    <Image
                        source={icons.paperclip}
                        style={{
                            width: moderateScale(18),
                            height: moderateScale(18),
                            tintColor: "#CFCFCF"
                        }}
                    />
                </View>
            ) : null}
        </TouchableOpacity>
    )
})

const renderItem = (message, yearMessages, navigation) => {
    return <MessageItem
        message={message}
        navigation={navigation}
        yearMessages={yearMessages}
    />
}

export default function MessageList(props) {
    const flatListScrollY = useRef(new Animated.Value(0))

    const [box, setBox] = useState("received") // Current box
    const [idClasseur, setIdClasseur] = useState(0) // Current "classeur"
    const [query, setQuery] = useState("") // Query for filtering messages
    const [yearMessages, setYearMessages] = useState()

    const [boxModalVisible, setBoxModalVisible] = useState(false)

    const {
        messages,
        classeurs,
        error,
        loading,
        refetchMessages
    } = useMessages(box, idClasseur, query, yearMessages)

    return (
        <MainLayout {...props}>
            <BoxModal
                visible={boxModalVisible}
                setVisible={setBoxModalVisible}
                classeurs={classeurs}
                idClasseur={idClasseur}
                setIdClasseur={setIdClasseur}
                box={box}
                setBox={setBox}
                yearMessages={yearMessages}
                setYearMessages={setYearMessages}
            />
            <Animated.FlatList
                contentInset={{ top: SEARCHBAR_HEADER_HEIGHT }}
                contentOffset={{ y: -SEARCHBAR_HEADER_HEIGHT }}
                bounces={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{
                        nativeEvent: {
                            contentOffset: { y: flatListScrollY.current },
                        }
                    }],
                    { useNativeDriver: true },
                )}
                refreshControl={
                    <RefreshControl
                        onRefresh={refetchMessages}
                        refreshing={loading}
                        colors={['#1F86FF']}
                        tintColor={['#1F86FF']}
                        progressViewOffset={SEARCHBAR_HEADER_HEIGHT}
                    />
                }

                data={messages}
                contentContainerStyle={{
                    paddingTop: SEARCHBAR_HEADER_HEIGHT + verticalScale(10)
                }}
                renderItem={({ item: message }) => renderItem(message, yearMessages, props.navigation)}
                keyExtractor={(item, index) => index.toString()}
            />
            <SearchBarHeader
                flatListScrollY={flatListScrollY}
                setBoxModalVisible={setBoxModalVisible}
                query={query}
                setQuery={setQuery}
            />
        </MainLayout >
    )
}