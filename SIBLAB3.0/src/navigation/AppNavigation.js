import React, {useContext } from "react"
import { AuthContext } from "../components/common/auth/AuthContext"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Icon } from "react-native-elements"
import PersonalStack from "./PersonalStack"
import QRScannerN from "./QRScannerN"
import IndexStack from "./IndexStack"
const Tab = createBottomTabNavigator()

const icons = {
  index: "home-circle",
  personal: "account",
  scanner: "qrcode",
};


export default function AppNavigation() {
  const { user } = useContext(AuthContext);

  return user ? (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "grey",

        tabBarIcon: ({ color, size }) => showIcon(route, color, size),
      })}
    >
      <Tab.Screen component={QRScannerN} name="scanner" options={{ title: 'qr' }} />
      <Tab.Screen component={IndexStack}  name='index' options={{ title: "Inicio" }} />
      <Tab.Screen component={PersonalStack} name="personal" options={{ title: 'Personal Information' }} />
    </Tab.Navigator>
  ) : (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "grey",

        tabBarIcon: ({ color, size }) => showIcon(route, color, size),
      })}
    >
      <Tab.Screen
        component={IndexStack}
        name='index'
        options={{ title: "Inicio" }} />

    </Tab.Navigator>
  )
}

function showIcon(route, color, size) {
  const iconName = icons[route.name];
  return (
    <Icon
      type="material-community"
      name={iconName}
      color={color}
      size={size}
    />
  );
}
