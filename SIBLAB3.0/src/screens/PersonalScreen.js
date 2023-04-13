import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, Text, View, TextInput, ImageBackground, StatusBar, TouchableOpacity, Animated } from "react-native";
import Loading from "../components/common/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from "../components/common/auth/AuthContext";
import { useIsFocused } from '@react-navigation/native';

export default function PersonalScreen() {
  const navigation = useNavigation();
  const { logout, userLoaded, setUserLoaded, user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null)
  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getSession = async () => {
      const userData = await AsyncStorage.getItem("user")
      console.log("user",userData)
      setUserData(JSON.parse(userData))
      setUserLoaded(true);
    }
    getSession()
  }, [user]);
  useEffect(() => {
    if (isFocused) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      opacity.setValue(0);
    }
  }, [isFocused, opacity]);


  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('user')
   await logout();
  }
  useEffect(() => {
    if (!user) {
      navigation.navigate('index', user)
    }
  }, [user]);
  if (!userLoaded) { return <Loading visible={true} text={"Cargando informacion"} /> }
  return (
    <View style={styles.container}>

      <ImageBackground source={require('../assets/img/fondo.png')} resizeMode="cover" style={styles.image}></ImageBackground>
            <Animated.View style={{ opacity,position: "absolute",    width: "100%",  height: "100%",}}>
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
            value={userData?.username || userData?.email}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Matricula</Text>
          <TextInput
            style={styles.input}
            value={userData?.code || userData?.code}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Grupo</Text>
          <TextInput
            style={styles.input}
            value={userData?.classroom.name || userData?.classroom.name}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Carrera</Text>
          <TextInput
            style={styles.input}
            value={userData?.classroom.career || userData?.classroom.career}
            editable={false}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={cerrarSesion}>
          <Text style={styles.buttonText}>Cerrar sesion</Text>
        </TouchableOpacity>
      
        <StatusBar barStyle={'light-content'} />
      </View>
      </Animated.View>

    </View>
  );
}


const styles = StyleSheet.create({

button: {
    marginBottom: 20,
    height: 50,
    width: 200,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "transparent",
    borderColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    top: 15,
},
buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    top: 40

  },
  input: {
    width: 300,
    padding: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#fff',
    borderRadius: 10,
    fontSize: 16,
    color: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1
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
    marginTop: 18,
    borderColor: "white",
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
})
