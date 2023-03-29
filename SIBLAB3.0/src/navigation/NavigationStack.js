import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import IndexScreen from "../screens/IndexScreen"
import PersonalScreen from "../screens/PersonalScreen"
import QRScanner from "../screens/QRScanner"
import ReportScreen from "../screens/ReportScreen"

const Stack = createNativeStackNavigator()

export default function IndexStack(){
    return(
        <Stack.Navigator  screenOptions={({route})=>({
            headerShown:false,
            tabBarShowLabel:false,

            })}>
            {/* <Stack.Screen name="historial" component={IndexScreen} options={{title:"historial"}}/> */}
            {/* <Stack.Screen name="personal" component={PersonalScreen} options={{title:"personal"}}/> */}
            <Stack.Screen name="scanner" component={QRScanner} options={{title:"scanner"}}/>
            {/* <Stack.Screen name="report" component={ReportScreen} options={{title: 'report'}}/> */}
        </Stack.Navigator>
    )
}