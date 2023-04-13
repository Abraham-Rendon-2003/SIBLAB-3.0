import React from "react"
import 'react-native-gesture-handler'
import { NavigationContainer } from "@react-navigation/native"
import { LogBox } from "react-native"
import AppNavigation from "./src/navigation/AppNavigation"
import { AuthProvider } from "./src/components/common/auth/AuthContext"
import Toast  from 'react-native-toast-message'

LogBox.ignoreAllLogs()
export default function App() {
  


  return (
    <>
    <NavigationContainer>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </NavigationContainer>
    <Toast/>
    </>
    
  )
}