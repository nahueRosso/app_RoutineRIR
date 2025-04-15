import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  BackDelateButton,
} from "@/components/ui/Buttons";
import Icon from "react-native-vector-icons/MaterialIcons";

const RoutineExercisesScreen = () => {
  const router = useRouter();
const { dayID, dayName, routineID, routineName,exercises  } =
    useLocalSearchParams();


    console.log(exercises);
    
    const goAddExe = () => {
        router.push({
          pathname: "/CreateExercises",
          params: { dayID, dayName, routineID, routineName, titleExe:'s',imgExe:'',idExeList:''},
        });
      };

  return (
    <View style={styles.container}>
      <Text style={{...styles.title,textTransform:'uppercase'}}>agregar ejercicio</Text>
      <View style={{ display: "flex",height:'80%',justifyContent:'center',alignItems:'center' }}>
          
          <TouchableOpacity style={styles.imagePlaceholder} onPress={() => router.push({
          pathname: "/ExercisesSerch",
          params: { dayID, dayName, routineID, routineName,exercises },
        })}>
                   <Icon name="format-list-bulleted" size={40} color="#aaaaaa" />
                   <Text style={styles.imagePlaceholderText}>lista de ejercicios</Text>
                </TouchableOpacity>
          
                    <TouchableOpacity style={styles.imagePlaceholder} onPress={goAddExe}>
                             <Icon name="add" size={40} color="#aaaaaa" />
                             <Text style={styles.imagePlaceholderText}>crear ejercicios</Text>
                             {/* <Text style={styles.imagePlaceholderText}>add image</Text> */}
                           </TouchableOpacity>
        <View style={{height:50,width:2}}></View>
      </View>

      
        <BackDelateButton
          onPressBack={() =>
            router.push({
              pathname: "/ViewExercises",
              params: { dayID, dayName, routineID, routineName , shouldRefresh: "true" ,exercises},
            })
          }
          delate={false}
        />
    

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161618",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#161618",
  },
  title: {
    color: "white",
    fontSize: 25,
    fontFamily: "Cochin",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
    fontWeight: "300",
  },
  exerciseButton: {
    backgroundColor: "#28282A",
    margin: 10,
    width: "80%",
    maxWidth: 300,
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    position: "relative",
    padding: 15,
  },
  imagePlaceholder: {
    // flex: 2,
    height: 150,
    width: 150,
    margin:20,
    backgroundColor: "#161618",
    borderStyle: "dashed",
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#28282A",
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: "#aaaaaa",
    marginTop: 10,
    textTransform:'capitalize'
  },
  exerciseText: {
    color: "white",
    fontSize: 17,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "300",
  },
  exerciseDecoration: {
    position: "absolute",
    width: 100,
    height: 100,
    right: -60,
    bottom: -20,
    borderRadius: 10,
    backgroundColor: "#BCFD0E",
    transform: [{ rotate: "25deg" }],
  },
  noExercisesText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Cochin",
  },
});

export default RoutineExercisesScreen;
