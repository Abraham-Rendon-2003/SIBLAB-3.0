import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, Text, View, ImageBackground, Animated } from "react-native";
import { Icon, Image } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import Loading from "../components/common/Loading"
import LoginScreen from "./LoginScreen";
import { getDocentes, getReport } from "../services/GeneralService";
import { AuthContext } from "../components/common/auth/AuthContext";
import { useIsFocused } from "@react-navigation/native";
export default function IndexScreen({ route }) {
    const values = route.params;
    const [loading, setLoading] = useState(true);
    const [sesion, setSesion] = useState(null);
    const [history, setHistory] = useState([])
    const [userD, setUser] = useState("")
    const [docente, setDocente] = useState([])
    const { user } = useContext(AuthContext);
    const isFocused = useIsFocused();
    const opacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {

        getHistory();
        getDocente();
        setLoading(false)
    }, [userD, values])
    const getHistory = async () => {
        const respponse = await getReport();
        const historyFiltrado = respponse.filter(his => his.user && his.user.id && his.user.id === userD.id);
        setHistory(historyFiltrado.reverse());
    }
    const getDocente = async () => {
        const response = await getDocentes();
        setDocente(response);
    }
    useEffect(() => {
        const getSession = async () => {
            const userData = await AsyncStorage.getItem("user")
            setSesion(JSON.parse(userData) ? true : false)
            setUser(JSON.parse(userData))
        }
        getSession()

    }, [user])
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


    return (
        loading ? <Loading visible={true} text={"Validando Sesion"} /> : user ?
            <View style={styles.container}>
                <ImageBackground source={require('../assets/img/fondo.png')} resizeMode="cover" style={styles.image}></ImageBackground>
                <Animated.View style={{ opacity, position: "absolute", width: "100%", height: "100%", }}>
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>Historial</Text>
                        <View style={styles.content}>
                            {history.map(histo => {
                                const docentes = docente.find(doc => doc.id === histo.id_teacher);
                                const docenteName = docentes ? docentes.name + " " + docentes.surname : '';
                                return (
                                    <View style={styles.card} key={histo.id}>
                                            <Image
                                                source={{ uri: `http://192.168.1.74:8080/api-siblab/image/${histo.machine.id}` }}
                                                style={{ width: 100, height: 100, marginLeft:5 }}
                                            />                                 
                                        <View style={styles.info}>
                                            <Text>Equipo: {histo.machine.name}</Text>
                                            <Text>Docencia: {histo.machine.laboratory.building.name}</Text>
                                            <Text>Laboratorio: {histo.machine.laboratory.name}</Text>
                                            <Text>Docente: {docenteName}</Text>
                                            <Text>Hora de inicio: {new Date(histo.time_Register).toLocaleString("es-MX", {
                                                timeZone: "America/Bogota",
                                                hour12: false,
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            }).substring(11, 19).replace('T', ' ')}</Text>
                                            <Text>Hora final:  {new Date(histo.time_Finish).toLocaleString("es-MX", {
                                                timeZone: "America/Bogota",
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
                </Animated.View>

            </View>

            : (<LoginScreen />)
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
    },
    card: {
        backgroundColor: '#D9D9D9',
        width: 360,
        height: 130,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    info: {
        fontSize: 16,
        fontWeight: "bold",
        alignContent: 'space-between',
        position: "relative",
        marginLeft: 10,
        flex: 1
    },

    image: {
        width: '100%',
        height: '100%',
        marginBottom: 20,
        alignContent: 'space-between',
        position: 'absolute',
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
})
