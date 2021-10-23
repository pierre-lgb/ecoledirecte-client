import React from 'react'
import { View } from 'react-native'
import { verticalScale } from 'react-native-size-matters'
import * as Progress from 'react-native-progress'

export default function DownloadProgressBar({ downloadProgress }) {
    return downloadProgress !== 1 ? (
        <View style={{
            height: verticalScale(8)
        }}>
            <Progress.Bar
                height={verticalScale(6)}
                width={null}
                borderRadius={0}
                color="#1F86FF"
                borderColor="transparent"
                progress={downloadProgress}
            />
        </View>
    ) : null
}
