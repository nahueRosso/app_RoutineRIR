import React, { useEffect, useState,useCallback } from "react";
import { View, Dimensions, StyleSheet, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {useRouter} from 'expo-router'

const imageBk = require("../../assets/images/fotoPortada_full.png");

export default function HomeScreen() {
  
  const router = useRouter();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <ImageBackground 
          source={imageBk} 
          resizeMode="cover"
          style={styles.image}
        >
         
          <View style={styles.textContainer}>
            <Text style={{...styles.textH2,textTransform:'uppercase'}}>Tu mejor versión</Text>
            <Text style={{...styles.textH1,textTransform:'uppercase'}}>empieza hoy</Text>
            
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => router.push({
  pathname: '/View',
})}
              // onPress={() => router.push('/View')}
              style={styles.button}
            >
              <Text style={{...styles.buttonText,textTransform:'uppercase'}}>empezar</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  textContainer:{
    position: 'absolute',
    bottom: 180, // Ajusta este valor según necesites
    left: 0,
    right: 0,
    alignItems: 'center', // Centra horizontalmente
  },
  textH1: {
    color: 'white',
    fontSize: 25,
    fontFamily:'Cochin',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textH2: {
    color: 'white',
    fontSize: 25,
    fontFamily:'Cochin',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80, 
    left: 0,
    right: 0,
    display:'flex',
    alignContent:'center',
    alignItems: 'center', 
  },
  button: {
    fontFamily:'Cochin',
    fontWeight: 'bold',
    fontSize: 17,
    color:'#161618',
    borderColor:'#A1D70F',
    backgroundColor:'#BCFD0E',
    width: '80%',
    maxWidth: 300,
    borderStyle:'solid',
    borderRadius:30,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  svg:{
    position:'absolute',
    right:20,
    top:10,
    color:'#161618',
    marginLeft:10,
    fontWeight: 'bold',
  }, 
    buttonText: {
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    fontSize: 17,
    height:40,
    color: '#161618',
    marginTop:15,
    // display:'flex',
    // justifyContent:'center',
    // alignItems:'center',
  },
});