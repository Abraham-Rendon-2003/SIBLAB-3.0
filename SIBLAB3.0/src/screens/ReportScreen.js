import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { useFormik } from "formik";
import { Button, Input } from "react-native-elements";
import axios from 'axios';

export default function ReportScreen() {
    const [selectedValue, setSelectedValue] = useState("");
    const [reporteValue, setReporteValue] = useState("");
    const [defectValue, setDefectValue] = useState("");
    const [profesorValue, setProfesorValue] = useState("");
    const [marcaValue, setMarcaValue] = useState("");
    const [procesadorValue, setProcesadorValue] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [machineData, setMachineData] = useState({});

    const formik = useFormik({
        initialValues: {
            reporte: "",
            profesor: "",
            defect: "",
            marca: "",
            procesador: "",
            Horafinal: "",
        },
        handleSendReport: (formValue) => {
            console.log(formValue)
            handleSendReport(formValue);
        }
    });
    const handleSendReport = async () => {
        const idEscaneado = obtenerIdEscaneado();
        const maquina = machines.find((m) => m.id === idEscaneado);

        if (!maquina) {
            alert("No se encontró una máquina con el ID escaneado");
            return;
        }

        try {
            const response = await axios.post("http://192.168.0.103:8080/api-siblab/report", {
                profesor: selectedValue,
                reporte: reporteValue,
                marca: maquina.marca,
                procesador: maquina.procesador,
                ubicacion: maquina.ubicacion,
                withCredentials: true,
            },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

            if (response.status === 201) {
                alert("Reporte enviado exitosamente");
                navigation.navigate("navigation");
            } else {
                alert("Error al enviar el reporte");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al enviar el reporte");

            if (error.response && error.response.data) {
                console.log("Error en los datos:", error.response.data);
            }
        }
    };


    useEffect(() => {
        const selectTeacher = async () => {
            try {
                const response = await axios.get('http://192.168.0.103:8080/api-siblab/user/', {
                    withCredentials: true,
                });
                const docenteFiltro = response.data.data;
                const filterTeacter = docenteFiltro.filter(docente => docente.role === 'Teacher');
                setTeachers(filterTeacter);
            } catch (error) {
                console.error(error);
                // Aquí puedes agregar lógica para mostrar un mensaje de error
            }
        }
        selectTeacher();
    }, []);

    useEffect(() => {
        axios
            .get("http://192.168.0.103:8080/api-siblab/machine")
            .then((response) => {
                setMachineData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const machineId = machine.id;

    // Comparar el ID escaneado con el ID de la máquina de la base de datos
    if (scannedId !== machineId) {
        // Mostrar un mensaje de error o tomar alguna otra acción
        console.log('El ID escaneado no coincide con el ID de la máquina recibida');
    } else {
        return (
            <View style={styles.container}>


                <View style={styles.container}>
                    <View style={styles.marca2}>
                        <Text style={styles.texto}>{machineData.brand}</Text>
                    </View>
                    <View style={styles.Procesador2}>
                        <Text style={styles.texto}>{machineData.cpu}</Text>
                    </View>
                    <View style={styles.DiscoDuro}>
                        <Text style={styles.texto}>{machineData.hard_disk}</Text>
                    </View>
                </View>
                {/* <View style={styles.Ubicacion}>
                <Text style={styles.texto}>Ubicacion</Text>
            </View> */}
                <View style={styles.Ubicacion2}>
                    <Text style={styles.texto}>Ubicacion</Text>
                </View>
                {/* <View style={styles.Horario}>
                <Text style={styles.texto}>Horario Inicio</Text>
            </View> */}
                {/* <View style={styles.Horario2}>
                <Text style={styles.texto}>Horario</Text>
            </View> */}
                <View style={styles.HorarioF}>
                    <Text style={styles.texto}>Horario Final</Text>
                </View>
                <View style={styles.Horario2F}>
                    <TextInput
                        style={styles.texto}
                        placeholder="Horario Final"
                        onChangeText={(text) => formik.setHorarioValue("Horafinal", text)}
                        errorMessage={formik.errors.Horafinal}
                        value={horarioValue}
                    />
                </View>
                <View style={styles.docente}>
                    <Text style={styles.texto}>Docente</Text>
                </View>
                <Picker
                    selectedValue={formik.values.profesor}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => formik.setFieldValue("profesor", itemValue)}
                    errorMessage={formik.errors.profesor}
                    prompt="Selecciona un profesor"
                >
                    {teachers.map((teacher) => {
                        return (
                            <Picker.Item label={teacher.name} value={teacher._id} key={teacher._id} />
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
                        value={reporteValue}
                        onChangeText={setReporteValue}
                    />
                </View>

                <View style={styles.area}>
                    <View style={styles.button}>
                        <Button
                            title="Agregar Reporte"
                            buttonStyle={{ backgroundColor: 'transparent' }}
                            onPress={formik.handleSubmit}
                            loading={formik.isSubmitting}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        position: 'absolute',
        width: 200,
        height: 50,
        borderWidth: 1,
        top: 50,
        borderRadius: 10,
        borderEndColor: 'white',
        borderStartColor: 'white',
        borderTopColor: 'white',
        borderBottomColor: 'white',
    },
    reporte: {
        backgroundColor: 'transparent',
        width: 300,
        height: 100,
        justifyContent: 'center',
        borderWidth: 1,
        top: 280,
        borderRadius: 10,
    },
    area: {
        width: 400,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121732',
        top: 300,
    },
    picker: {
        width: 150,
        height: 50,
        right: 30,
        top: 490,
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        position: 'absolute',
    },
    marca: {
        width: 150,
        height: 50,
        top: 220,
        left: 30,
        backgroundColor: '#D9D9D9',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    marca2: {
        width: 150,
        height: 50,
        top: 220,
        right: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Procesador: {
        width: 150,
        height: 50,
        top: 270,
        left: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Procesador2: {
        width: 150,
        height: 50,
        top: 270,
        right: 30,
        backgroundColor: '#D9D9D9',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    docente: {
        width: 150,
        height: 50,
        top: 490,
        left: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },

    Ubicacion: {
        width: 150,
        height: 50,
        top: 340,
        left: 30,
        backgroundColor: '#D9D9D9',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Ubicacion2: {
        width: 150,
        height: 50,
        top: 340,
        right: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Horario: {
        width: 150,
        height: 50,
        top: 390,
        left: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Horario2: {
        width: 150,
        height: 50,
        top: 390,
        right: 30,
        backgroundColor: '#D9D9D9',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    HorarioF: {
        width: 150,
        height: 50,
        top: 440,
        left: 30,
        backgroundColor: '#D9D9D9',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Horario2F: {
        width: 150,
        height: 50,
        top: 440,
        right: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
