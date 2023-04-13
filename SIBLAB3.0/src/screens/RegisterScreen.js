import React, { useState, useEffect, useContext, useRef } from "react";
import { View, StyleSheet, Text, ImageBackground, ScrollView, StatusBar, Animated } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { useFormik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { RegisterService } from "../services/GeneralService";

import { AuthContext } from "../components/common/auth/AuthContext";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useIsFocused } from '@react-navigation/native';
export default function RegisterScreen() {
  const navigation = useNavigation();
  const [pass, setPass] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [groups, setGroups] = useState([]);
  const { login } = useContext(AuthContext);
  const [classrooms, setClassrooms] = useState([]);
  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isFocused) {
      Animated.timing(opacity, {
        toValue: 2,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      opacity.setValue(0);
    }
  }, [isFocused, opacity]);

  const fillSemesters = async () => {
    try {
        const response = await axios.get("http:// 192.168.137.11:8080/api-siblab/semester/" ,{
          Withcredentials: true,
      });
        const data = response.data.data;

        let current = {};
        if(data.length > 0)
            current = data.find(sem => new Date() < new Date(sem.semester_finish) && new Date() > new Date(sem.semester_start));
        setCurrentSemester(current);
        current && fillGroups(current.id)
        fillGroups();
    } catch (error) {
        console.log(error)
    }
}

const fillGroups = async (current = null) => {
    try {
        const response = await axios.get("http:// 192.168.137.11:8080/api-siblab/classroom/", {
          Withcredentials: true,
      });
        const data = response.data.data;
        
        let filter = [];
        data.forEach(group =>{
            if(current != null && current !== "")
                group.period.find(p => p.semester.id == current) && filter.push(group);
            
        })
        setClassrooms(filter);
        
    } catch (error) {
        console.log("error de perio", error)
    }
}

useEffect(() => {
    fillSemesters();
}, []);

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
        .required("Correo obligatorio"),
      password: Yup.string()
      .min(6,"La contraseña es de minimo 6 caracteres")
      .required("Contraseña obligatorio"),
      confirm: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        .required("Campo obligatorio"),
      name: Yup.string().required("Nombre obligatorio")
      .matches(/^[a-zA-Z' ]+$/, 'Ingresa un nombre válido')
      .min(4, 'El nombre debe tener al menos 4 caracteres').
      max(20, 'El nombre no puede tener más de 20 caracteres')
      .matches(/^[A-Z][a-zÀ-ÖØ-öø-ÿ \'-]*$/, 'El nombre debe empezar con una letra mayúscula'),
      surname: Yup.string().required("Apellido obligatorio").
      min(4, 'El apellido debe tener al menos 4 caracteres')
      .matches(/^[a-zA-Z' ]+$/, 'Ingresa un apellido válido')
      .matches(/^[A-Z][a-zÀ-ÖØ-öø-ÿ \'-]*$/, 'El apellido debe empezar con una letra mayúscula')
      .max(20, 'El apellido no puede tener más de 20 caracteres'),
      code: Yup.string().min(10,"La matricula es de minimo 10 caracteres").required("Matricula obligatorio"),
      id_classroom: Yup.string().required("Grupo obligatorio"),
    }),
    onSubmit: async (values) => {
      console.log(values)
      const response = await RegisterService(values);
      response.data.message === "Usuario existente" ? Toast.show({ type: "error", position: "bottom", text1: "Cuenta ya registrada" }) : navigation.navigate("indexS") || login(response.data.data)

    }
  });
  const showPass = () => {
    setPass(!pass);
  };

  const showConfirm = () => {
    setConfirm(!confirm);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require("../assets/img/fondo.png")}
        resizeMode="cover"
        style={styles.image}
      ></ImageBackground>
      <Animated.View style={{ opacity }}>

        <Text style={styles.title}>Registrar Cuenta</Text>
        <Input
          containerStyle={styles.input}
          placeholder="Nombre(s)"
          onChangeText={(text) => formik.setFieldValue("name", text)}
          errorMessage={formik.touched.name &&formik.errors.name}
          value={formik.values.name}
          onBlur={formik.handleBlur}
          color="white"
          placeholderTextColor="#B8C9CB"

        />
        <Input
          containerStyle={styles.input}
          placeholder="Apellidos"
          onChangeText={(text) => formik.setFieldValue("surname", text)}
          errorMessage={formik.touched.surname&&formik.errors.surname}
          value={formik.values.surname}
          onBlur={formik.handleBlur}
          color="white"
          placeholderTextColor="#B8C9CB"

        />
        <Input
          containerStyle={styles.input}
          placeholder="Matrícula"
          onChangeText={(text) => formik.setFieldValue("code", text)}
          errorMessage={formik.touched.code && formik.errors.code}
          value={formik.values.code}
          onBlur={formik.handleBlur}
          color="white"
          placeholderTextColor="#B8C9CB"

        />
        <Input
          containerStyle={styles.input}
          placeholder="Email"
          onChangeText={(text) => formik.setFieldValue("email", text)}
          errorMessage={ formik.touched.email  && formik.errors.email }
          value={formik.values.email}
          onBlur={formik.handleBlur}
          color="white"
          placeholderTextColor="#B8C9CB"

        />
        <Input
          containerStyle={styles.input}
          placeholder="Contraseña"
          onChangeText={(text) => formik.setFieldValue("password", text)}
          errorMessage={formik.touched.password&&formik.errors.password }
          value={formik.values.password}
          onBlur={formik.handleBlur}
          color="white"
          placeholderTextColor="#B8C9CB"

          secureTextEntry={pass ? false : true}
          rightIcon={
            <Icon 
            type="material-community" 
            name= {pass ? "eye-off-outline" : "eye-outline"} 
            iconStyle={styles.icon}
            onPress={showPass}/>}
        />
        <Input
          containerStyle={styles.input}
          placeholder="Confirmar Contraseña"
          onChangeText={(text) => formik.setFieldValue("confirm", text)}
          errorMessage={ formik.touched.confirm&&formik.errors.confirm }
          value={formik.values.confirm}
          onBlur={formik.handleBlur}
          color="white"
          placeholderTextColor="#B8C9CB"
          secureTextEntry={confirm ? false : true}
          rightIcon={
            <Icon 
            type="material-community" 
            name= {confirm ? "eye-off-outline" : "eye-outline"} 
            iconStyle={styles.icon}
            onPress={showConfirm}/>}
        
        />
        <View style={styles.pickerContainer}>
          <Picker
          style={styles.pickerItem}
            selectedValue={formik.values.id_classroom}
            onValueChange={(itemValue, itemIndex) => formik.setFieldValue("id_classroom", itemValue)}
            errorMessage={formik.errors.id_classroom}
            value={formik.values.id_classroom}>
            <Picker.Item label="Seleccione un grupo" value={null} />
            {classrooms.map(group => (
              <Picker.Item key={group.id} label={group.grade+"°"+group.name + "  " + group.career}  value={group.id} />
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
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    
  },
  title: {
    marginBottom: 40,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginTop: 20,
  },
  icon:{
    color:"#c1c1c1"
  },
  input: {
    fontSize: 16,
    padding: 3,
    marginBottom: 20,
    color: "#000",
    width: 300,
    height: 50,
    borderRadius: 10,
    borderColor:"white",
    borderWidth:0.5
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
    borderColor: "#ccc",
    borderWidth: 0.5,
    borderRadius: 10,
    marginBottom: 20,
    height: 50,
  },
  pickerItem:{
    color:"#B8C9CB"
},
  button: {
    marginBottom: 20,
    marginLeft:33,
    height: 56,
    width: 233,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#fff',
    color: '#fff',
  },
 
});
