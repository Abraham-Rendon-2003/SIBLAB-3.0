import React, { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, StatusBar } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { useFormik } from "formik";
import { Icon, Image } from "react-native-elements";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { CreateReport } from "../services/GeneralService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Toast } from "react-native-toast-message/lib/src/Toast";

export default function ReportScreen({ route }) {
    const { data, now, now1 } = route.params;
    const [teachers, setTeachers] = useState([]);
    const [computer, setComputer] = useState("")
    const [showScanButton, setShowScanButton] = useState(true);
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false)
    const [imageUri, setImageUri] = useState('');

    const SegundoEscaneo = () => {
        navigation.navigate('scannerF', { now: now });
    }

    const selectTeacher = async () => {
        try {
            const response = await axios.get('http://192.168.1.74:8080/api-siblab/user/', {
                withCredentials: true,
            });
            const docenteFiltro = response.data.data;
            const filterTeacter = docenteFiltro.filter(docente => docente.role === 'Teacher');
            console.log("Filtro d", filterTeacter)
            setTeachers(filterTeacter);
        } catch (error) {
        }
    }

    useEffect(() => {
        const getComputer = async () => {
            try {
                const response = await axios.get(`http://192.168.1.74:8080/api-siblab/machine/${data}`, { withCredentials: true })
                const imageUrl = response.data.data.path_image;  
                              setImageUri(imageUrl);
                response.data.data.status === true ? setComputer(response.data.data) : navigation.goBack() || Toast.show({ type: "error", position: "bottom", text1: "La computadora se encuentra desabilitada", text2: "Por favor usa una diferente!" })

            } catch (error) {
            }
        }
        getComputer()
        selectTeacher();
    }, []);
    useEffect(() => {
        const getSession = async () => {
            const userData = await AsyncStorage.getItem("user")
            console.log("user", userData)
            setUserData(JSON.parse(userData))
        }
        getSession()
        formik.setValues({
            info: "",
            id_teacher: 0,
            time_Register: now ? now : "",
            time_Finish: now1 ? now1 : "",
        })
    }, [data, now, now1])

    const formik = useFormik({
        initialValues: {
            info: "",
            id_teacher: 0,
            time_Register: "",
            time_Finish: "",
        },
        onSubmit: async (values) => {
            console.log("values report", values)
            const response = await CreateReport({ values, data, userData, now1 })
            response.data.message === "Ok" ? Toast.show({ type: "success", position: "bottom", text1: "Registrado correctamente" }) : Toast.show({ type: "error", position: "bottom", text1: "Error al crear el reporte" })
            navigation.navigate('indexS', values);
        }
    });

    useEffect(() => {
        if (now1) {
            setShowScanButton(false);
        }
    }, [now1]);

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <ImageBackground source={require('../assets/img/fondo.png')} resizeMode="cover" style={styles.image}></ImageBackground>

                <Image
                    source={{ uri: `http://192.168.1.74:8080/api-siblab/image/${computer.id}` }}
                    style={{ width: 150, height: 150,marginTop:29,marginBottom:15 }}
                />            
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput style={styles.input} placeholder={computer.name} editable={false} value={computer.name && computer.name} />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Marca</Text>
                    <TextInput style={styles.input} placeholder={computer.brand} editable={false} value={computer.brand && computer.brand} />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Ubicación</Text>
                    <TextInput style={styles.input} placeholder={computer.laboratory && computer.laboratory.name} editable={false} value={computer.laboratory && computer.laboratory.name} />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Horario Inicio</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={now}
                        name="time_Register"
                        onChangeText={(text) => formik.setFieldValue("time_Register", text)}
                        errorMessage={formik.errors.time_Register}
                        value={now}
                        editable={false}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Horario Final</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={now1}
                        name="time_Finish"
                        onChangeText={(text) => formik.setFieldValue("time_Finish", text)}
                        errorMessage={formik.errors.now1}
                        value={now1}
                        editable={false}
                    />
                </View>

                <Text style={styles.label}>Docente</Text>
                <View style={styles.picker}>
                    <Picker
                        style={styles.pickerItem}
                        onValueChange={(itemValue) => {
                            formik.setFieldValue("id_teacher", itemValue);
                            console.log(formik.values.id_teacher);
                        }}
                        selectedValue={formik.values.id_teacher}
                        errorMessage={formik.errors.id_teacher}
                        prompt="Selecciona un profesor"
                    >
                        {teachers.map((teacher) => {
                            return (
                                <Picker.Item label={teacher.name + " " + teacher.surname} value={teacher.id} key={teacher.id} />
                            )
                        })}
                    </Picker>
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Comentarios</Text>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={6}
                        maxLength={100}
                        style={styles.textArea}
                        name="info"
                        onChangeText={(text) => formik.setFieldValue("info", text)}
                        errorMessage={formik.errors.info}
                        value={formik.values.info}
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                {showScanButton ? (
                    <View>
                        <TouchableOpacity onPress={SegundoEscaneo} style={styles.button}>
                            <Text style={styles.buttonText}>Escanear salida</Text>
                        </TouchableOpacity>
                        <StatusBar barStyle={'light-content'} />
                    </View>
                ) : (
                    <View>
                        <TouchableOpacity onPress={formik.handleSubmit} style={styles.button}>
                            <Text style={styles.buttonText}>Enviar reporte</Text>
                        </TouchableOpacity>
                        <StatusBar barStyle={'light-content'} />
                    </View>
                )}
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
        marginBottom: 20,
        position: 'absolute',
    },
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        marginTop: 40,
        marginBottom: 15,
        justifyContent: "center",
    },
    logo: {
        color: "#61dafb",

    },
    inputContainer: {
        justifyContent: "center"
    },
    inputWrapper: {
        marginBottom: 20,

    },
    label: {
        fontSize: 16,
        fontWeight: "semibold",
        marginBottom: 5,
        color: '#fff',

    },
    input: {
        borderColor: "#ccc",
        borderWidth: 0.5,
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        marginBottom: 5,
        color: '#EFEFEF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        width: 300,

    },
    picker: {
        borderColor: "#ccc",
        borderWidth: 0.5,
        borderRadius: 10,
        marginBottom: 20,
        height: 50,
    },
    pickerItem: {
        color: "white"
    },
    textArea: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        textAlignVertical: "top",
        height: 100,
        color: "#EFEFEF"
    },
    buttonContainer: {

        width: 400,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',

    },
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
});