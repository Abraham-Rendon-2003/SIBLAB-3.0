import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import QRScannerI from "../components/common/QRScannerI";

export default function QRScanner() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <QRScannerI />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
    }
})