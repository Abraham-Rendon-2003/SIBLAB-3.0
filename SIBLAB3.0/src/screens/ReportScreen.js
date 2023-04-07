import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { useFormik } from "formik";
import { Button, Input } from "react-native-elements";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { CreateReport } from "../services/GeneralService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReportScreen({ route }) {
    const { data, fechaInicio, fechaFinal } = route.params;
    console.log("fecha inicio", fechaInicio)
    console.log("fecha final", fechaFinal)
    const [teachers, setTeachers] = useState([]);
    const [computer, setComputer] = useState("")
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
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
            console.error("ERROR t", error);
        }
    }

    useEffect(() => {
        const getComputer = async () => {
            try {
                const response = await axios.get(`http://192.168.1.74:8080/api-siblab/machine/${data}`, { withCredentials: true })
                setComputer(response.data.data)

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
            time_Register: fechaInicio ?fechaInicio : "",
            time_Finish: fechaFinal ? fechaFinal : "",
        })
    }, [data])
    const formik = useFormik({
        initialValues: {
            info: "",
            id_teacher: 0,
            time_Register: "",
            time_Finish: "",
        },
        onSubmit: async (values) => {
            console.log("values report", values)
            const response = await CreateReport({ values, data, userData })
            response.data.message === "Ok" ? alert("Registrado") : alert("Error al crear el reporte")
            console.log("Respuesta", response)
        }
    });


    return (
        <ScrollView contentContainerStyle={styles.scrollview}>
            <Text style={styles.title}>Registrar reporte</Text>
            <View style={styles.container}>
                <View style={styles.marca}>
                    <Text style={styles.texto}>Nombre</Text>
                </View>
                <View style={styles.marca2}>
                    <TextInput style={styles.texto} placeholder={computer.name}
                    />
                </View>
                <View style={styles.Procesador}>
                    <Text style={styles.texto}>Marca</Text>
                </View>
                <View style={styles.Procesador2}>
                    <TextInput style={styles.texto} placeholder={computer.brand} />
                </View>

                <View style={styles.Ubicacion}>
                    <Text style={styles.texto}>Ubicacion</Text>
                </View>
                <View style={styles.Ubicacion2}>
                    <TextInput style={styles.texto} placeholder={computer.laboratory && computer.laboratory.name} />
                </View>
                <View style={styles.Horario}>
                    <Text style={styles.texto}>Horario Inicio</Text>
                </View>
                <View style={styles.Horario2}>
                    <TextInput style={styles.texto} placeholder={fechaInicio}
                        name="time_Register"
                        onChangeText={(text) => formik.setFieldValue("time_Register", text)}
                        errorMessage={formik.errors.time_Register}
                        value={fechaInicio}
                    />
                </View>
                <View style={styles.HorarioF}>
                    <Text style={styles.texto}>Horario Final</Text>
                </View>
                <View style={styles.Horario2F}>
                    <TextInput
                        style={styles.texto}
                        placeholder={fechaFinal}
                        name="time_Finish"
                        onChangeText={(text) => formik.setFieldValue("time_Finish", text)}
                        errorMessage={formik.errors.time_Finish}
                        value={fechaFinal}
                    />
                </View>
                <View style={styles.docente}>
                    <Text style={styles.texto}>Docente</Text>
                </View>
                <Picker
                    style={styles.picker}
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
                            <Picker.Item label={teacher.name} value={teacher.id} key={teacher.id} />
                        )
                    })}
                </Picker>

                <View style={styles.reporte}>
                    <TextInput
                        placeholder="Reporte"
                        editable
                        multiline
                        numberOfLines={6}
                        maxLength={100}
                        style={{ padding: 10 }}
                        name="info"
                        onChangeText={(text) => formik.setFieldValue("info", text)}
                        errorMessage={formik.errors.info}
                        value={formik.values.info}
                    />
                </View>

                <View style={styles.area}>
                    <Button
                        title={fechaFinal ? "Registrar" : "Regresar al escaner"}
                        onPress={fechaFinal ? formik.handleSubmit :() =>  navigation.navigate("scannerS")}
                        loading={formik.isSubmitting}
                        buttonStyle={[styles.button]}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    scrollview: {
        flex: 1,

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
        borderWidth: 1
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#121732',
        top: 40
    },
    reporte: {
        backgroundColor: 'transparent',
        width: 300,
        height: 90,
        justifyContent: 'center',
        borderWidth: 1,
        top: 250,
        borderRadius: 10,
    },
    area: {
        width: 400,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121732',
        top: 280,
    },
    picker: {
        width: 150,
        height: 50,
        right: 30,
        top: 400,
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        position: 'absolute',
    },
    marca: {
        width: 150,
        height: 50,
        top: 150,
        left: 30,
        backgroundColor: '#D9D9D9',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    marca2: {
        width: 150,
        height: 50,
        top: 150,
        right: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Procesador: {
        width: 150,
        height: 50,
        top: 200,
        left: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Procesador2: {
        width: 150,
        height: 50,
        top: 200,
        right: 30,
        backgroundColor: '#D9D9D9',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    docente: {
        width: 150,
        height: 50,
        top: 400,
        left: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Ubicacion: {
        width: 150,
        height: 50,
        top: 250,
        left: 30,
        backgroundColor: '#D9D9D9',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Ubicacion2: {
        width: 150,
        height: 50,
        top: 250,
        right: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Horario: {
        width: 150,
        height: 50,
        top: 300,
        left: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Horario2: {
        width: 150,
        height: 50,
        top: 300,
        right: 30,
        backgroundColor: '#D9D9D9',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    HorarioF: {
        width: 150,
        height: 50,
        top: 350,
        left: 30,
        backgroundColor: '#D9D9D9',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Horario2F: {
        width: 150,
        height: 50,
        top: 350,
        right: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
