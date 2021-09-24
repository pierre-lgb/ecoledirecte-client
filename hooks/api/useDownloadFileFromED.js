import { useState } from 'react'
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
import Toast from 'react-native-simple-toast';
import * as mime from 'react-native-mime-types';
import { generateUniqueId } from '../../utils';

import { responseCodes } from '../../constants'
import { useDispatch } from 'react-redux'
import { useNetInfo } from "@react-native-community/netinfo";
import { refreshUser } from '../../store/auth/authActions';

const useDownloadFileFromED = (token) => {
    const [downloadProgress, setDownloadProgress] = useState(1)

    const { dispatch } = useDispatch()
    const { isConnected } = useNetInfo()

    const downloadFile = (file, additionalParams) => {
        if (!isConnected) {
            alert("Vous n'êtes pas connectés à internet :/")
            return
        }

        const { DownloadDir, DocumentDir } = RNFetchBlob.fs.dirs
        const directoryPath = Platform.select({
            ios: DocumentDir,
            android: DownloadDir // Only works on Android, not on IOS
        });

        const params = new URLSearchParams({
            token: token,
            fichierId: file.id,
            ...additionalParams
        }).toString();
        console.log(params);


        setDownloadProgress(0)
        RNFetchBlob
            .config({
                fileCache: true,
                notification: true // IOS Notification
            })
            .fetch("POST",
                "https://api.ecoledirecte.com/v3/telechargement.awp?verbe=get",
                { "Content-Type": "application/x-www-form-urlencoded" },
                params
            )
            .progress((loaded, total) => { setDownloadProgress(loaded / total) })
            .then(async (res) => {
                // Handle invalid token or expired session
                if ([
                    responseCodes.invalidToken,
                    responseCodes.sessionExpired
                ].some(value => value === res.respInfo.headers["x-code"])) {
                    console.log("[INFO] Refetching user")
                    dispatch(refreshUser)
                        .then(() => downloadFile(file, yearMessages, fileType))
                }

                // Filename (+ add unique ID on Android)
                const fileName = file.libelle.replace(/\.[^/.]+$/, "")
                    // Need to add this unique ID to prevent a bug on Android.
                    + (Platform.OS === "android" && `-${generateUniqueId()}`)

                // Get file extension (even with "Document" tab files) and mimeType
                const disposition = res.respInfo.headers["content-disposition"]
                const attachmentFilename = /filename\*?=([^']*'')?([^;]*)/.exec(disposition)[2].replace(/\"/gm, "")
                const fileExt = attachmentFilename.split(".").length > 1 ? attachmentFilename.split(".").pop() : ""
                const mimeType = mime.lookup(fileExt)

                // Combine all → path
                const filePath = `${directoryPath}/${fileName}${fileExt ? "." + fileExt : ""}`

                await RNFetchBlob.fs.writeFile(filePath, await res.base64(), "base64")
                Toast.show("Fichier téléchargé")

                if (Platform.OS === "android") {
                    // Android Notification
                    if (mimeType) {
                        RNFetchBlob.android.addCompleteDownload({
                            title: fileName,
                            description: 'Fichier téléchargé',
                            mime: mimeType,
                            path: filePath,
                            showNotification: true
                        })
                    }

                    // Open file
                    await RNFetchBlob.android.actionViewIntent(filePath, mimeType || "");
                }

                if (Platform.OS === "ios") {
                    // Open file
                    RNFetchBlob.ios.openDocument(res.path())
                }

                return
                // Handle invalid token
            })
            .catch(e => console.log(e))
            .finally(() => {
                setDownloadProgress(1)
            })
    }

    return { downloadFile, downloadProgress }
}

export default useDownloadFileFromED