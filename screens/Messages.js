import React, { useState } from 'react';
import {
    Text, TextInput, View,
    Image, TouchableOpacity
} from 'react-native'
import { icons } from '../constants'
import { useSelector } from 'react-redux';

import dayjs from 'dayjs';
import 'dayjs/locale/fr'

import { verticalScale, moderateScale } from 'react-native-size-matters';

import MainLayout from './MainLayout'
import {
    BottomModal, BottomModalOption,
    BottomModalDivider, BottomModalButton,
    BottomModalRadio
} from '../components/BottomModal';

import useMessages from '../hooks/api/useMessages';

const YearSelect = ({ yearMessages, setYearMessages, modalVisible, setModalVisible }) => {
    const { accounts } = useSelector(state => state.auth)
    const currentYear = accounts[0].anneeScolaireCourante
    const previousYear = currentYear.split("-").map(part => +part - 1).join("-")

    return (
        <>
            <BottomModal
                visible={modalVisible}
                setVisible={setModalVisible}
                title="Année"
            >
                <BottomModalRadio
                    label={currentYear}
                    selected={yearMessages === currentYear || !yearMessages}
                    onPress={() => setYearMessages(currentYear)}
                />
                <BottomModalRadio
                    label={previousYear}
                    selected={yearMessages === previousYear}
                    onPress={() => setYearMessages(previousYear)}
                />
            </BottomModal>
            <View style={{
                flexDirection: "row",
                justifyContent: 'flex-end'
            }}>
                <TouchableOpacity
                    style={{
                        paddingVertical: verticalScale(10),
                        paddingHorizontal: moderateScale(25),
                        marginVertical: verticalScale(10),
                        backgroundColor: "#E9F2FF",
                        borderRadius: moderateScale(50),
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={{
                        fontFamily: "Poppins_500Medium",
                        fontSize: moderateScale(12),
                        color: "#1F86FF"
                    }}>
                        {yearMessages || currentYear}
                    </Text>
                    <Image
                        source={icons.bottomChevron}
                        style={{
                            tintColor: "#1F86FF",
                            width: moderateScale(15),
                            height: moderateScale(15),
                            marginLeft: moderateScale(5)
                        }}
                    />
                </TouchableOpacity>
            </View>
        </>
    )
}

const Searchfield = ({ setQuery }) => {
    return (
        <View
            style={{
                marginLeft: moderateScale(25),
                flex: 1
            }}
        >
            <TextInput
                multiline={false}
                autoCompleteType="off"
                autoCorrect={false}
                blurOnSubmit={true}
                maxLength={50}
                placeholder="Rechercher..."
                placeholderTextColor="#CFCFCF"
                returnKeyType="search"
                selectTextOnFocus={true}
                style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: moderateScale(13),
                    flex: 1,
                    textAlignVertical: "center"
                }}
                onSubmitEditing={(value) => {
                    setQuery(value.nativeEvent.text)
                }}
            />
        </View>
    )
}

export default function Messages(props) {


    const [box, setBox] = useState("received") // Current box
    const [idClasseur, setIdClasseur] = useState(0) // Current "classeur"
    const [query, setQuery] = useState("") // Query for filtering messages
    const [yearMessages, setYearMessages] = useState()

    const {
        messages,
        classeurs,
        error,
        loading,
        refetchMessages
    } = useMessages(box, idClasseur, query, yearMessages)

    const [modals, setModals] = useState({
        boxModal: false, // Box selection modal
        yearModal: false // Year selection modal
    })

    dayjs.locale('fr')

    return (
        <MainLayout {...props}
            onRefresh={() => { refetchMessages() }}
            refreshing={loading}
        >
            <View>
                <YearSelect
                    yearMessages={yearMessages}
                    setYearMessages={setYearMessages}
                    modalVisible={modals.yearModal}
                    setModalVisible={(status) => {
                        setModals((prevState) => ({
                            ...prevState,
                            yearModal: status
                        }))
                    }}
                />
                <View
                    style={{
                        borderColor: "#F9F9F9",
                        borderTopWidth: 2,
                        borderBottomWidth: 2,
                        paddingVertical: verticalScale(5),
                        paddingHorizontal: moderateScale(15),
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <BottomModal
                        visible={modals.boxModal}
                        setVisible={(status) => {
                            setModals((prevState) => ({
                                ...prevState,
                                boxModal: status
                            }))
                        }}
                        title="Boîtes"
                    >
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

                    <TouchableOpacity
                        style={{
                            backgroundColor: "#E9F2FF",
                            width: moderateScale(38),
                            height: moderateScale(38),
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: moderateScale(10)
                        }}
                        onPress={() => {
                            setModals(prevState => ({
                                ...prevState,
                                boxModal: true
                            }))
                        }}
                    >
                        <Image
                            source={icons.inbox}
                            style={{
                                width: moderateScale(24),
                                height: moderateScale(24),
                                tintColor: "#1F86FF"
                            }}
                        />
                    </TouchableOpacity>
                    <Searchfield setQuery={setQuery} />
                </View>
                <View>
                    {/* No message info */}
                    {!messages.length && !error ? (
                        <Text style={{
                            fontFamily: "Poppins_400Regular",
                            fontSize: moderateScale(12),
                            color: "#BEBFBF",
                            textAlign: "center",
                            paddingVertical: verticalScale(40),
                            paddingHorizontal: moderateScale(20)
                        }}>
                            Aucun message à afficher
                        </Text>
                    ) : null}

                    {/* Error */}
                    {error ? (
                        <View style={{
                            flexDirection: "row",
                            alignSelf: "center",
                            alignItems: "center",
                            paddingVertical: verticalScale(40),
                            paddingHorizontal: moderateScale(20)
                        }}>
                            <Image
                                source={icons.warning}
                                style={{
                                    width: moderateScale(15),
                                    height: moderateScale(15),
                                    tintColor: "#FC7D7D"
                                }}
                            />
                            <Text style={{
                                fontFamily: "Poppins_400Regular",
                                fontSize: moderateScale(12),
                                color: "#FC7D7D",
                                textAlign: "center",
                                marginLeft: moderateScale(10)
                            }}>
                                {error}
                            </Text>
                        </View>
                    ) : null}

                    {messages && messages.map((message, id) => (
                        <View key={id} >
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingVertical: verticalScale(12),
                                    // paddingHorizontal: moderateScale(25),
                                    marginVertical: verticalScale(10)
                                }}
                            >
                                <View style={{
                                    paddingHorizontal: moderateScale(20),
                                    flex: 1
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: verticalScale(5)
                                    }}>
                                        {!message.read ? <View
                                            style={{
                                                backgroundColor: "#1F86FF",
                                                width: moderateScale(8),
                                                height: moderateScale(8),
                                                position: 'absolute',
                                                left: moderateScale(-20),
                                                borderRadius: moderateScale(10)
                                            }}>
                                        </View> : null}

                                        <Text
                                            ellipsizeMode="tail"
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: "Inter_600SemiBold",
                                                color: "#6E7079",
                                                fontSize: moderateScale(13)
                                            }}
                                        >{message.subject}</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: "Inter_400Regular",
                                        fontSize: moderateScale(10),
                                        color: "#CFCFCF"
                                    }}>{message.from.name}</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginTop: verticalScale(12)
                                    }}>
                                        <Image source={icons.calendar} style={{
                                            tintColor: "#BEBFBF",
                                            width: moderateScale(16),
                                            height: moderateScale(16),
                                            marginRight: moderateScale(7)
                                        }} />
                                        <Text style={{
                                            fontFamily: "Poppins_400Regular",
                                            fontSize: moderateScale(10),
                                            color: "#BEBFBF"
                                        }}>{dayjs(message.date).format('D MMM YYYY à HH:mm')}</Text>
                                    </View>
                                </View>
                                {message.files.length ? (
                                    <View style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: moderateScale(10),
                                        // backgroundColor: "red"
                                    }}>
                                        <Image
                                            source={icons.paperclip}
                                            style={{
                                                tintColor: "#CFCFCF",
                                                width: moderateScale(20),
                                                height: moderateScale(20)
                                            }}
                                        />
                                    </View>
                                ) : null}
                            </TouchableOpacity>
                            <View
                                style={{
                                    backgroundColor: "#F9F9F9",
                                    height: verticalScale(1)
                                }}
                            ></View>
                        </View>
                    ))}
                </View>
            </View>

        </MainLayout >
    )
}




