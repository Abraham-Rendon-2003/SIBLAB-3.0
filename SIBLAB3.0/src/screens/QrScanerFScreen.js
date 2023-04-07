import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import QrScannerF from '../components/common/QrScannerF';

export default function QrScanerFScreen() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <QrScannerF />
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