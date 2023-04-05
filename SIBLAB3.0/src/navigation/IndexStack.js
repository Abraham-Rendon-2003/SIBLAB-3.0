import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import RegisterScreen from "../screens/RegisterScreen"
import SesionScreen from "../screens/SesionScreen"
import IndexScreen from "../screens/IndexScreen"

const Stack = createNativeStackNavigator()

export default function IndexStack(){
    return(
        <Stack.Navigator  screenOptions={({route})=>({
            headerShown:false,
            tabBarShowLabel:false,

            })}>
            <Stack.Screen name="indexS" component={IndexScreen} options={{title:"Inicio"}}/>
            <Stack.Screen name="sesionS" component={SesionScreen} options={{title:"Inicio de sesion"}}/>
            <Stack.Screen name="registerS" component={RegisterScreen} options={{title:"Registro"}}/>
        </Stack.Navigator>
    )
}