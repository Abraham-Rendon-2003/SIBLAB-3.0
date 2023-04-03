import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ReportScreen from '../screens/ReportScreen'

const Stack = createNativeStackNavigator()

export default function ReportStack(){
    return(
        <Stack.Navigator initialRouteName="report" screenOptions={({route}) => ({
            headerShown: false,
        })}>
            <Stack.Screen name="reports" component={ReportScreen} options={{title:'Report'}}/>
        </Stack.Navigator>
    )
}