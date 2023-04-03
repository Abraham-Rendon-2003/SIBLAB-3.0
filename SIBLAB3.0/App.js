import React, { useEffect, useState } from "react"
import 'react-native-gesture-handler'
import { NavigationContainer } from "@react-navigation/native"
import { LogBox } from "react-native"
import IndexStack from "./src/navigation/IndexStack"
import AppNavigation from "./src/navigation/AppNavigation"
import { AuthProvider } from "./src/components/common/auth/AuthContext"

LogBox.ignoreAllLogs()
export default function App() {


  return (
    <NavigationContainer>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </NavigationContainer>
  )
}