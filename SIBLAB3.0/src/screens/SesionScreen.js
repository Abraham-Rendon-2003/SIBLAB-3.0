import React, { useState, useContext, useEffect } from "react"
import { View, StyleSheet, ImageBackground, ActivityIndicator, StatusBar } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Image, Button, Text, Icon, Input, } from "react-native-elements"
import { AuthContext } from "../components/common/auth/AuthContext";
import * as Yup from "yup";
import { useFormik } from 'formik';
import { LoginService } from "../services/GeneralService";

export default function SesionScreen() {

  const navigation = useNavigation()
  const [password, setPassword] = useState(false);
  const { login, user } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .email('Ingrese un correo electrónico válido')
        .matches(/^[^\s@]+@utez\.edu\.mx$/, 'El correo debe ser del dominio utez.edu.mx')
        .required('Ingrese su correo electrónico'),
      password: Yup.string().required("Contraseña obligatoria")
    }),
    onSubmit: async (values) => {
      console.log("Values", values);
      const response = await LoginService(values);
      login(response)
      console.log("respuesta", response)
    }
  })

  useEffect(() => {
    if (user) {
      navigation.navigate('indexS', user)
    }
  }, [user]);
  const showPass = () => {
    setPassword(!password)
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/img/fondo.png')} resizeMode="cover" style={styles.image}></ImageBackground>
      <Image source={require('../assets/img/libro.png')} style={styles.logo} />
      <Image source={require('../assets/img/FotoPerfil.png')} style={styles.profile} />
      <Input
        containerStyle={styles.input}
        placeholder="Email"
        rightIcon={
          <Icon type="material-community" name="at" iconStyle={styles.icon} />}
        onChangeText={(text) =>
          formik.setFieldValue('username', text)
        }
        onBlur={formik.handleBlur}
        value={formik.values.username}
        errorMessage={formik.errors.username}
        color="white"
      />

      <Input
        containerStyle={styles.input}
        placeholder="Password"
        secureTextEntry={password ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={password ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.icon}
            onPress={showPass} />}
        onChangeText={(text) =>
          formik.setFieldValue('password', text)
        }
        onBlur={formik.handleBlur}
        value={formik.values.password}
        errorMessage={formik.errors.password}
        color="white"

      />
      <Button
        containerStyle={styles.containerBtn}
        buttonStyle={styles.btnR}
        title="Iniciar Sesion"
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting} />
      {/* {loading && <ActivityIndicator />} */}
      <StatusBar barStyle={'light-content'} />
      <Text style={styles.text}>SIBLAB</Text>
    </View>
  )
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
    height: 55,
    marginBottom: 20,
    color: "white",
    borderColor: '#fff',
    fontSize: 16,
    paddingLeft: 20,
    top: 30,
  },
  profile: {
    width: 160,
    height: 160,
    marginBottom: 35
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    top: -8,
  },
  image: {
    width: '100%',
    height: '100%',
    marginBottom: 20,
    position: 'absolute',
  },
  btnR: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    height: 56,
    borderWidth: 2,
    borderColor: '#fff',
    color: '#fff',
  },
  containerBtn: {
    width: "50%",
    marginTop: 50
  },
  text: {
    color: '#fff',
    fontSize: 20,
    top: 70,
  },
  icon: {
    color: "#c1c1c1"
  },
})
