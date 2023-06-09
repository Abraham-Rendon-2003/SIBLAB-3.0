import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import QRScanner from "../screens/QRScanner"
import ReportScreen from "../screens/ReportScreen"
import QrScannerF from "../components/common/QrScannerF"



const Stack = createNativeStackNavigator()

export default function QRScannerN(){
    return(
        <Stack.Navigator initialRouteName="scanner" screenOptions={({route}) => ({
            headerShown: false,
        })}>
            <Stack.Screen name="scannerS" component={QRScanner} options={{title:'QrScanner'}}/>
            <Stack.Screen name="reports" component={ReportScreen} options={{title:'Report'}}/>
            <Stack.Screen name="scannerF" component={QrScannerF} options={{title:'QrScannerF'}}/>


        </Stack.Navigator>
    )
}