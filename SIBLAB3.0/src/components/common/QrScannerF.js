import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, ImageBackground } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from '@react-navigation/native';

export default function QrScannerF({ route }) {
  const { now } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('');
  const navigation = useNavigation();
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaF, setFechaF] = useState(null);
  const [segundoEscaneoRealizado, setSegundoEscaneoRealizado] = useState(false);
  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };
  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanner = ({ type, data }) => {
    setScanned(true);
    const horaMx = new Date().toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).substring(0, 19).replace('T', ' ');
    const parts = horaMx.split(/[\/ :]/);
    const now1 = parts[2] + "-" + parts[1] + "-" + parts[0] + " " + parts[3] + ":" + parts[4] + ":" + parts[5];

    if (fechaInicio && !segundoEscaneoRealizado) {
      setFechaF(now1);
      setSegundoEscaneoRealizado(false);
      setScanned(false);
    } else {
      setFechaInicio(now);
    }
    console.log('Type: ' + type + '\nData: ' + data);
    navigation.navigate('reports', { data, now, now1 });
  };

  const resetScan = () => {
    setScanned(false);
    setFechaInicio("")
    setFechaF("")
  };
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requiere permiso de cámara</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No acceso a cámara</Text>
        <Button title={'Allo Camara'} onPress={askForCameraPermission} />
        <Text style={styles.mainText}>{text}</Text>
        {scanned && (
          <Button
            title={'Escanear nuevamente'}
            onPress={() => {
              setScanned(false);
              setSegundoEscaneoRealizado(false);
            }}
            color='tomato'
          />
        )}
      </View>
    );
  }


  return (
    <View style={styles.barcodebox}>
      <ImageBackground source={require('../../assets/img/fondo.png')} resizeMode="cover" style={styles.image}></ImageBackground>

      {scanned ? (
        <TouchableOpacity style={styles.button} onPress={resetScan}>
          <Text style={styles.text}>Escanea tu hora final</Text>
        </TouchableOpacity>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanner}
          style={{ height: 350, width: 350 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: '100%',
    height: '100%',
    marginBottom: 20,
    position: 'absolute',
  },
  barcodebox: {
    flex:1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainText: {
    fontSize: 16,
    margin: 20,
  },
  button: {
    backgroundColor: '#0B3C5D',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
