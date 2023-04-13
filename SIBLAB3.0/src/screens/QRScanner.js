import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native'
import QRScannerI from "../components/common/QRScannerI";

export default function QRScanner() {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/img/fondo.png')} resizeMode="cover" style={styles.image}></ImageBackground>
            <QRScannerI />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        marginBottom: 20,
        position: 'absolute',
    },
})