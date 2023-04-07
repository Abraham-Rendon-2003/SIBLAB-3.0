import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from '@react-navigation/native';

export default function QRScannerI() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('');
  const navigation = useNavigation();
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);
  const [reset, setReset] = useState(false);


  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanner = ({ type, data }) => {
    if (!scanned) {
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
      const now = parts[2] + "-" + parts[1] + "-" + parts[0] + " " + parts[3] + ":" + parts[4] + ":" + parts[5];
      const finish = parts[2] + "-" + parts[1] + "-" + parts[0] + " " + parts[3] + ":" + parts[4] + ":" + parts[5];

      if (!fechaInicio) {
        setFechaInicio(now);
        navigation.navigate('reports', { fechaInicio: now, data });
        return
      }
      if (!fechaFinal) {
        setFechaFinal(finish);
        navigation.navigate('reports', { fechaInicio: fechaInicio, fechaFinal: finish, data });
        setFechaInicio(null);
        setFechaFinal(null);
        setScanned(false);
        return;
      }

    }
  };

  const handlePress = () => {
    console.log("status",scanned)
    setScanned(false)
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

      </View>
    );
  }


  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanner}
        style={{ height: 350, width: 350 }}
      />
      {scanned && (
        <View style={styles.buttonContainer}>
          <Button title={fechaInicio ? (fechaFinal ? 'Enviar' : 'Escanear fecha final') : 'Escanear fecha inicio'} onPress={() => handlePress()} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 16,
    margin: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 32,
    left: 32,
    right: 32,

  },
});
