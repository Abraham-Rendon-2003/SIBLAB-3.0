import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  ScrollView,
  TextInput,
  StatusBar
} from "react-native";
import { Input, Button } from "react-native-elements";
import { useFormik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {RegisterService } from "../services/GeneralService";
import { AuthContext } from "../components/common/auth/AuthContext";


export default function RegisterScreen() {
  const navigation = useNavigation();
  const [pass, setPass] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [groups, setGroups] = useState([]);
  const { login } = useContext(AuthContext);
  const [nombreError, setNombreError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirm: "",
      name: "",
      surname: "",
      role: "alumno",
      code: "",
      id_classroom: "",

    },
    validationSchema: Yup.object({
      email: Yup.string().email("Correo inválido").matches(/^[^\s@]+@utez\.edu\.mx$/, 'El correo debe ser del dominio utez.edu.mx')
        .required("Campo obligatorio"),
      password: Yup.string().required("Campo obligatorio"),
      confirm: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        .required("Campo obligatorio"),
      name: Yup.string().required("Campo obligatorio"),
      surname: Yup.string().required("Campo obligatorio"),
      code: Yup.string().required("Campo obligatorio"),
      id_classroom: Yup.string().required("Campo obligatorio"),
    }),
    onSubmit: async (values) => {
      console.log(values)
      const response = await RegisterService(values);
      response.data.message === "Usuario existente" ? alert("Cuenta ya registrada") : navigation.navigate("indexS") || login(response.data.data)

    }
  });
  const showPass = () => {
    setPass(!pass);
  };

  const showConfirm = () => {
    setConfirm(!confirm);
  };
  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://192.168.1.74:8080/api-siblab/classroom/');
      setGroups(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require("../assets/img/fondo.png")}
        resizeMode="cover"
        style={styles.image}
      ></ImageBackground>
      <Text style={styles.title}>Registrar Cuenta</Text>
      <Input
        containerStyle={styles.input}
        placeholder="Nombre(s)"
        onChangeText={(text) => formik.setFieldValue("name", text)}
        errorMessage={formik.errors.name}
        value={formik.values.name}

      />
      <Input
        containerStyle={styles.input}
        placeholder="Apellidos"
        onChangeText={(text) => formik.setFieldValue("surname", text)}
        errorMessage={formik.errors.surname}
                value={formik.values.surname}

      />
      <Input
        containerStyle={styles.input}
        placeholder="Matrícula"
        onChangeText={(text) => formik.setFieldValue("code", text)}
        errorMessage={formik.errors.code}
                value={formik.values.code}

      />
      <Input
        containerStyle={styles.input}
        placeholder="Email"
        onChangeText={(text) => formik.setFieldValue("email", text)}
        errorMessage={formik.errors.email}
                value={formik.values.email}

      />
      <Input
        containerStyle={styles.input}
        placeholder="Contraseña"
        onChangeText={(text) => formik.setFieldValue("password", text)}
        errorMessage={formik.errors.password}
                value={formik.values.password}

        secureTextEntry={pass ? false : true}
        rightIcon={{
          type: "material-community",
          name: pass ? "eye-off-outline" : "eye-outline",
          onPress: () => showPass(),
        }}
      />
      <Input
        containerStyle={styles.input}
        placeholder="Confirmar Contraseña"
        onChangeText={(text) => formik.setFieldValue("confirm", text)}
        errorMessage={formik.errors.confirm}
                value={formik.values.confirm}

        secureTextEntry={confirm ? false : true}
        rightIcon={{
          type: "material-community",
          name: confirm ? "eye-off-outline" : "eye-outline",
          onPress: () => showConfirm(),
        }}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formik.values.id_classroom}
          onValueChange={(itemValue, itemIndex) => formik.setFieldValue("id_classroom", itemValue)}
          errorMessage={formik.errors.id_classroom}
                  value={formik.values.id_classroom}>
          <Picker.Item label="Seleccione un grupo" value={null} />
          {groups.map(group => (
            <Picker.Item key={group.id} label={group.name} value={group.id} />
          ))}
        </Picker>
      </View>
      <Button
        title="Registrar"
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
        buttonStyle={[styles.button]}
      />
            <StatusBar barStyle={'light-content'} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    height: "100%",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    marginTop: 20,
  },

  input: {
    fontSize: 16,
    padding: 3,
    backgroundColor: "#F5E7E7",
    marginBottom: 20,
    color: "#000",
    width: 300,
    height: 50,
    borderRadius: 10,
    
  },
  error: {
    color: "red",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  pickerContainer: {
    backgroundColor: "#F5E7E7",
    borderRadius: 10,
    top: 18,
    marginBottom: 20,
    height: 50,
    width: 300,
  },
  button: {
    marginBottom: 20,
    height: 50,
    width: 300,
    paddingLeft: 10,
    paddingRight: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    height: 56,
    marginTop: 20,
    width: 233,
    borderWidth: 2,
    borderColor: '#fff',
    color: '#fff',
  },
});
