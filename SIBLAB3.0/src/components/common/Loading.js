import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import {Overlay} from 'react-native-elements'

export default function Loading(props) {
  const {visible, text} = props;
  return (
    <Overlay
    isVisible={visible}
    overlayStyle={styles.overlay}>
      <View style={styles.viewLoad}>
        <ActivityIndicator size="large" color="#0D5BD7"/>
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
      
    </Overlay>
  )
}

Loading.defaultProps = {
  visible: false
}

const styles = StyleSheet.create({

  overlay:{
    backgroundColor: 'white',
  paddingVertical: 20,
  paddingHorizontal: 40,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  },
  text:{
    marginTop: 10,
    color: 'black',
    fontSize: 16,
    fontWeight: 'semibold',
    textTransform: 'uppercase',
  }

})


