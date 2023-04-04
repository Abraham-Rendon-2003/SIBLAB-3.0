import React, { useState,useContext } from "react"
import { View, TextInput, StyleSheet, ImageBackground, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Image, Button, Text } from "react-native-elements"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from "../components/common/auth/AuthContext";

export default function SesionScreen( ) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation()
  const { login } = useContext(AuthContext);

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    const req = {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }

    try {
      const res = await fetch('http://192.168.0.103:8080/api-siblab/login/', req)
      const data = await res.json()
      await AsyncStorage.setItem('user', JSON.stringify(data))
      login(data)
      console.log(data)
      if (!username || !password) {
        alert('Ingrese los datos para iniciar sesión')
      } else if (data && (data.username === username || data.password === password)) {
        navigation.navigate('indexS')
      } else {
        alert('Usuario no encontrado')
      }
    } catch (err) {
      console.log(err)
      alert('Error',err)
    }
  }
  AsyncStorage.getItem('user')
    .then((value) => {
      console.log("traiodo a se", JSON.parse(value));
    })
    .catch((error) => {
      console.log(error);
    });

    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/img/fondo.png')} resizeMode="cover" style={styles.image} />
        <Image source={require('../assets/img/libro.png')} style={styles.logo} />
        <Image source={require('../assets/img/FotoPerfil.png')} style={styles.profile} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={(ev) => setUsername(ev)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry={password ? false : true}
          onChangeText={(ev) => setPassword(ev)}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={handleSubmit}
        >
          <Text style={styles.btnText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <Text style={styles.text}>SIBLAB</Text>
      </View>
    );
}
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      input: {
        width: 300,
        borderWidth: 1,
        borderRadius: 10,
        height: 50,
        marginBottom: 10,
        borderColor: '#fff',
        color: '#fff',
        fontSize: 16,
        paddingLeft: 20,
        marginTop: 20,
      },
      profile: {
        width: 160,
        height: 160,
        marginBottom: 15,
        marginTop: 20,
      },
      logo: {
        width: 120,
        height: 120,
        marginBottom: 10,
        marginTop: -5,
      },
      image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
      },
      btn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        height: 50,
        marginTop: 20,
        width: 200,
      },
      btnText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
      },
      text: {
        color: '#fff',
        fontSize: 24,
        top: 70,
        fontWeight: 'bold',
      },
    });    
