import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  ScrollView,
  TextInput
} from "react-native";
import { Input, Button } from "react-native-elements";
import { useFormik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const SignupSchema = Yup.object({
  email: Yup.string().email("Correo inválido").required("Campo obligatorio"),
  password: Yup.string().required("Campo obligatorio"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Campo obligatorio"),
  name: Yup.string().required("Campo obligatorio"),
  surname: Yup.string().required("Campo obligatorio"),
  code: Yup.string().required("Campo obligatorio"),
});

export default function RegisterScreen() {
  const [group, setGroup] = useState(null);
  const navigation = useNavigation();
  const [pass, setPass] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirm: "",
      name: "",
      surname: "",
      code: "",
    },
    validationSchema: SignupSchema,
    validateOnChange: false,
    onSubmit: (formValue) => {
      console.log(formValue)
      onSubmite(formValue);
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
      const response = await axios.get('http://192.168.0.103:8080/api-siblab/classroom/');
      setGroups(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const onSubmite = async (values) => {
    try {
      const response = await axios.post(
        "http://192.168.0.103:8080/api-siblab/user/",
        {
          email: values.email,
          password: values.password,
          name: values.name,
          surname: values.surname,
          code: values.code,
          role: "alumno",
          Withcredentials:true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.status === 201) {
        alert("Cuenta creada exitosamente");
        navigation.navigate("navigation");
      } else {
        alert("Error al crear la cuenta");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear la cuenta");
  
      if (error.response && error.response.data) {
        console.log("Error en los datos:", error.response.data);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require("../assets/img/fondo.png")}
        resizeMode="cover"
        style={styles.image}
      ></ImageBackground>
      <Text style={styles.title}>Registrar Cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre(s)"
        onChangeText={(text) => formik.setFieldValue("name", text)}
        errorMessage={formik.errors.name}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellidos"
        onChangeText={(text) => formik.setFieldValue("surname", text)}
        errorMessage={formik.errors.surname}
      />
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        onChangeText={(text) => formik.setFieldValue("code", text)}
        errorMessage={formik.errors.code}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => formik.setFieldValue("email", text)}
        errorMessage={formik.errors.email}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        onChangeText={(text) => formik.setFieldValue("password", text)}
        errorMessage={formik.errors.password}
        secureTextEntry={pass ? false : true}
        rightIcon={{
          type: "material-community",
          name: pass ? "eye-off-outline" : "eye-outline",
          onPress: () => showPass(),
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        onChangeText={(text) => formik.setFieldValue("confirm", text)}
        errorMessage={formik.errors.confirm}
        secureTextEntry={confirm ? false : true}
        rightIcon={{
          type: "material-community",
          name: confirm ? "eye-off-outline" : "eye-outline",
          onPress: () => showConfirm(),
        }}
      />
      <Text>Seleccione su grupo:</Text>
      <Picker
        selectedValue={selectedGroup}
        onValueChange={(itemValue, itemIndex) => setSelectedGroup(itemValue)}
        style={{ height: 50, width: 150 }}
      >
        <Picker.Item label="Seleccione un grupo" value={null} />
        {groups.map(group => (
          <Picker.Item key={group.id} label={group.name} value={group.id} />
        ))}
      </Picker>

      <Button
        title="Registrar"
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
        buttonStyle={[styles.button]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: "center",
    backgroundColor: "cyan",
    height: "100%",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 50,
    marginTop: 50,
  },
  input: {
    fontSize: 14,
    padding: 10,
    top: 15,
    marginLeft: -10,
    backgroundColor: "#F5E7E7",
    marginBottom: 20,
    color: "#000",
    width: 270,
    height: 50,
    borderRadius: 10,
  },
  error: {
    color: "red",
  },
  image: {
    width: "100%",
    height: "100%",
    marginBottom: 20,
    position: "absolute",
  },
  button: {
    justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 8,
        height: 56,
        marginTop: 20,
        top: 30,
        width: 233,
        borderWidth: 2,
        borderColor: '#fff',
        color: '#fff',
  },
});