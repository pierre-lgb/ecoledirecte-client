import { useState } from 'react'
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
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

    const downloadFile = (file, yearMessages, fileType) => {
        if (!isConnected) {
            alert("Vous n'êtes pas connectés à internet :/")
            return
        }

        const { DownloadDir, DocumentDir } = RNFetchBlob.fs.dirs
        const directoryPath = Platform.select({
            ios: DocumentDir,
            android: DownloadDir,
        });
        const fileName = file.libelle.replace(/\.[^/.]+$/, "")
            // Need to add this unique ID to prevent a bug.
            + (Platform.OS === "android" && `-${generateUniqueId()}`)
        const fileExt = file.libelle.split(".").pop()
        const filePath = `${directoryPath}/${fileName}.${fileExt}`;

        setDownloadProgress(0)
        RNFetchBlob
            .config({
                fileCache: true,
                path: filePath,
                appendExt: fileExt,
                notification: true
            })
            .fetch("POST",
                "https://api.ecoledirecte.com/v3/telechargement.awp?verbe=get",
                { "Content-Type": "application/x-www-form-urlencoded" },
                `leTypeDeFichier=${fileType}&fichierId=${file.id}&token=${token}&anneeMessages=${yearMessages || ""}`
            )
            .progress((loaded, total) => { setDownloadProgress(loaded / total) })
            .then(async (res) => {
                // Handle invalid token
                if ([
                    responseCodes.invalidToken,
                    responseCodes.sessionExpired
                ].some(value => value === res.respInfo.headers["x-code"])) {
                    console.log("[INFO] Refetching user")
                    dispatch(refreshUser)
                        .then(() => downloadFile(file, yearMessages, fileType))
                }

                if (Platform.OS === "android") {
                    // Notification
                    if (mime.lookup(fileExt)) {
                        RNFetchBlob.android.addCompleteDownload({
                            title: fileName,
                            description: 'Fichier téléchargé',
                            mime: mime.lookup(fileExt),
                            path: filePath,
                            showNotification: true
                        })
                    }
                    RNFetchBlob.android.actionViewIntent(res.path(), mime.lookup(fileExt));
                }

                if (Platform.OS === "ios") {
                    RNFetchBlob.ios.openDocument(res.path())
                }
            })
            .catch(e => console.log(e))
            .finally(() => {
                setDownloadProgress(1)
            })
    }

    return { downloadFile, downloadProgress }
}

export default useDownloadFileFromED