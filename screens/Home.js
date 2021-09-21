import React from 'react'
import { Text, View, Image, ScrollView } from 'react-native'
import { icons, screens } from '../constants'

import MainLayout from './MainLayout'

export default function Home(props) {
    return (
        <MainLayout {...props} >
            <Text>Profil</Text>
        </MainLayout>
    )
}
