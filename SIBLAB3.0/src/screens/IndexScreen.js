import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState,useContext } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import Loading from "../components/common/Loading"
import LoginScreen from "./LoginScreen";
import { getDocentes, getReport } from "../services/GeneralService";
import { AuthContext } from "../components/common/auth/AuthContext";
export default function IndexScreen() {
 
    const [sesion, setSesion] = useState(null);
    const [history, setHistory] = useState([])
    const [userD, setUser] = useState("")
    const [docente, setDocente] = useState([])
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const getSession = async () => {
            const userData = await AsyncStorage.getItem("user")
            setSesion(JSON.parse(userData) ? true : false)
            setUser(JSON.parse(userData))
        }
        getSession()
        if (user) {
            getHistory();
            getDocente();
          }
    
    }, [user])

    const getHistory = async () => {
        const respponse = await getReport();
        const historyFiltrado = respponse.filter(his => his.user.id == userD.id)
        setHistory(historyFiltrado)
    }
    const getDocente = async () => {
        const response = await getDocentes();
        setDocente(response);
    }

    if (user === null) {
        return <Loading visible={true} text={"Validando Sesion"} />
    }

    return user ? (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <ImageBackground source={require('../assets/img/fondo.png')} resizeMode="cover" style={styles.image}></ImageBackground>
            <Text style={styles.title}>Historial</Text>
            <View style={styles.content}>
                {history.map(histo => {
                    const docentes = docente.find(doc => doc.id === histo.id_teacher);
                    const docenteName = docentes ? docentes.name : '';
                    return (
                        <View style={styles.card} key={histo.id}>
                            <View>
                                <Icon type="material-comunity" name="laptop" size={130} style={{ marginLeft: 5 }} />
                            </View>
                            <View style={styles.info}>
                                <Text>{histo.machine.name}</Text>
                                <Text>Docencia:{histo.machine.laboratory.building.name}</Text>
                                <Text>Laboratorio: {histo.machine.laboratory.name}</Text>
                                <Text>Docente: {docenteName}</Text>
                                <Text>Hora de inicio: {new Date(histo.time_Register).toLocaleString("es-MX", {
                                    timeZone: "America/Mexico_City",
                                    hour12: false,
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                }).substring(11, 19).replace('T', ' ')}</Text>
                                <Text>Hora final:  {new Date(histo.time_Finish).toLocaleString("es-MX", {
                                    timeZone: "America/Mexico_City",
                                    hour12: false,
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                }).substring(11, 19).replace('T', ' ')}</Text>
                            </View>
                        </View>
                    );
                })}

            </View>
        </ScrollView>
    ) : (<LoginScreen />)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        top: 100,
    },
    card: {
        backgroundColor: '#D9D9D9',
        width: 320,
        height: 130,
        borderRadius: 10,
        flexDirection: 'row',
        alignContent: 'space-between',
        marginBottom: 10
    },
    info: {
        fontSize: 16,
        fontWeight: "bold",
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'space-between'
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#fff',
        top: 70
    },
    image: {
        width: '100%',
        height: '100%',
        marginBottom: 20,
        position: 'absolute',
    },
})
