import React from 'react'
import {
    View,
    Text,
    SectionList,
    RefreshControl
} from 'react-native'
import DownloadProgressBar from '../components/DownloadProgressBar'
import MainLayout from './MainLayout'
import FileItem from '../components/FileItem'

import {
    moderateScale,
    verticalScale
} from 'react-native-size-matters'

import { useSelector } from 'react-redux'
import useDocuments from '../hooks/api/useDocuments'
import useDownloadFileFromED from '../hooks/api/useDownloadFileFromED'

const renderSectionHeader = ({ section: { title, data } }) => {
    return (
        <>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: verticalScale(50),
                marginBottom: verticalScale(10)
            }}>
                <Text style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: moderateScale(15),
                    textTransform: "capitalize",
                    color: "#6E7079",
                }}>{title}</Text>
                <View style={{
                    height: verticalScale(1.5),
                    backgroundColor: "#F9F9F9",
                    marginLeft: moderateScale(15),
                    flex: 1
                }}></View>
            </View>
            {!data.length && (
                <Text style={{
                    fontFamily: "Inter_400Regular",
                    color: "#B7B7B7",
                    fontSize: moderateScale(12)
                }}>Aucun document à afficher</Text>
            )}
        </>
    )
}

export default function Documents(props) {
    const { token, accounts } = useSelector(state => state.auth)
    const account = accounts[0]

    const { downloadFile, downloadProgress } = useDownloadFileFromED(token)
    const { documents, loading, error, refetchDocuments } = useDocuments(account)

    if (!account) {
        return <MainLayout {...props}></MainLayout>
    }

    return (
        <MainLayout {...props} >
            <SectionList
                renderItem={({ item: document }) => (
                    <FileItem
                        file={document}
                        onPress={() => downloadFile(document)}
                        downloadingFile={downloadProgress !== 1}
                    />
                )}
                renderSectionHeader={renderSectionHeader}
                refreshControl={
                    <RefreshControl
                        onRefresh={refetchDocuments}
                        refreshing={loading}
                        colors={['#1F86FF']}
                        tintColor={['#1F86FF']}
                    />
                }
                ListFooterComponent={() => (
                    <View style={{ marginBottom: verticalScale(100) }}></View>
                )}

                ItemSeparatorComponent={() => null}
                sections={documents || []}
                keyExtractor={(item, index) => index.toString()}
                style={{
                    paddingHorizontal: moderateScale(30)
                }}
            />
            <DownloadProgressBar
                downloadProgress={downloadProgress}
            />
        </MainLayout>
    )
}

