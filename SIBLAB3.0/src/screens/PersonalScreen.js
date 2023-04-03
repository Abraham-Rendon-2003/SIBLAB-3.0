import React, { useState, useEffect,useContext } from "react";
import { StyleSheet, Text, View, TextInput, ImageBackground } from "react-native";
import axios from "axios";
import { Button } from "react-native-elements";
import Loading from "../components/common/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from "../components/common/auth/AuthContext";


export default function PersonalScreen() {

  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const getSession = async () => {
      const userData = await AsyncStorage.getItem("user")
      setUserData(JSON.parse(userData))
    }
    getSession()
  }, []);

  const cerrarSesion = async () => {
    const user = await AsyncStorage.removeItem('user')
    console.log("elimniado", user)
    logout();
    navigation.navigate("index", { Screen: "indexS" })
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/img/fondo.png')} resizeMode="cover" style={styles.image}></ImageBackground>
      <Text style={styles.title}>Información Personal</Text>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={userData?.name}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellido Paterno</Text>
          <TextInput
            style={styles.input}
            value={userData?.surname}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            value={userData?.username}
            editable={false}
          />
        </View>
        <Button
          title="Cerrar Sesion"
          onPress={cerrarSesion}
          buttonStyle={styles.button}
          titleStyle={styles.title} />
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0968ED",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: 'space-between'
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#fff",
    top: 90,

  },
  input: {
    width: 300,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 18,
    color: '#fff'
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    top: 10,
    left: 20,
    color: '#fff'
  },
  image: {
    width: '100%',
    height: '100%',
    marginBottom: 20,
    position: 'absolute',
  },
  button: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomColor: "#e3e3e3",
    marginTop: 30,
    paddingVertical: 10
  },
  title: {
    color: "#0D5BD7"
  }
})
