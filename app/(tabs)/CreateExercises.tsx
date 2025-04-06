import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { BackDelateButton } from "@/components/ui/Buttons";

interface Day {
  id: string;
  exercises?: Exercise[];
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  weight: number;
  rir: number;
  arrSetWeight: number[];
  arrSetRIR: number[];
}

const buildSetArray = (set: number, value: number): number[] => {
  return Array(set).fill(value);
};

const CreateDaysScreen = () => {
  const router = useRouter();
  const { dayID, dayName, routineID,routineName } = useLocalSearchParams();
  const [exeName, setExeName] = useState("");
  const [set, setSet] = useState("");
  const [weight, setWeight] = useState("");
  const [rir, setRir] = useState("2");
  const [routines, setRoutines] = useState<any>([]);
  const [days, setDays] = useState<any[]>([]);
  const [error, setError] = useState("");

  const fetchRoutines = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList = storedData ? JSON.parse(storedData) : [];
      setRoutines(routinesList);

      const foundRoutine = routinesList.find((r: any) => r.name === routineName);
      if (!foundRoutine) return;

      const daysArray = foundRoutine.days
        ? Array.isArray(foundRoutine.days)
          ? foundRoutine.days
          : Object.values(foundRoutine.days)
        : [];

      setDays(daysArray);
    } catch (error) {
      console.error("Error fetching routines:", error);
    }
  }, [routineName]);

  useFocusEffect(useCallback(() => {
    fetchRoutines();
  }, [fetchRoutines]));

  const validateSet = (text: string) => {
    const num = Number(text);
    if (text === "" || isNaN(num) || num < 1 || num > 5) {
      setError("Series debe estar entre 1 y 5");
    } else {
      setError("");
    }
    setSet(text);
  };

  const validateWeight = (text: string) => {
    const num = Number(text);
    if (text === "" || isNaN(num) || num < 0 || num > 500) {
      setError("Peso debe estar entre 0 y 500");
    } else {
      setError("");
    }
    setWeight(text);
  };

  const saveExercise = async () => {
    try {
      if (!exeName.trim() || !set.trim() || !weight.trim() || !rir.trim() || error) {
        Alert.alert("Error", "Todos los campos son obligatorios y deben ser válidos.");
        return;
      }
  
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList = storedData ? JSON.parse(storedData) : [];
  
      const routineIndex = routinesList.findIndex((r: any) => r.name === routineName);
      if (routineIndex === -1) {
        Alert.alert("Error", "Rutina no encontrada.");
        return;
      }
  
      const currentRoutine = routinesList[routineIndex];
  
      if (Array.isArray(currentRoutine.days)) {
        currentRoutine.days = currentRoutine.days.reduce((acc: any, day: any) => {
          acc[day.id] = day;
          return acc;
        }, {});
      }

      const currentDay: Day | undefined | any = Object.values(currentRoutine.days).find((day: any) => day.id === dayID);

      if (!currentDay) {
        Alert.alert("Error", "Día no encontrado.");
        return;
      }
      
      if (!Array.isArray(currentDay.exercises)) {
        currentDay.exercises = [];
      }
  
      const newExercise = {
        id: Date.now().toString(),
        name: exeName,
        sets: parseInt(set),
        weight: parseFloat(weight),
        rir: parseInt(rir),
        arrSetWeight: buildSetArray(parseInt(set), parseFloat(weight)),
        arrSetRIR: buildSetArray(parseInt(set), parseFloat(rir)),
      };
  
      currentDay.exercises.push(newExercise);
  
      await AsyncStorage.setItem("routines", JSON.stringify(routinesList));
      setDays(Object.values(currentRoutine.days));
      Alert.alert("Éxito", "Ejercicio agregado al día.");
      setExeName("");
      setSet("");
      setWeight("");
      setRir("2");

      router.push({
        pathname: "/ViewExercises",
        params: {
          dayID,
          dayName,
          routineID,
          routineName,
        },
      })

    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar el ejercicio.");
    }
  };

  const isSaveDisabled = !!error || !exeName.trim() || !set.trim() || !weight.trim() || 
    parseInt(set) < 1 || parseInt(set) > 5 || 
    parseFloat(weight) < 0 || parseFloat(weight) > 500;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>CREAR EJERCICIOS</Text>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Nombre del ejercicio"
          placeholderTextColor="#888"
          value={exeName}
          onChangeText={setExeName}
          style={styles.input}
        />
        
        <TextInput
          placeholder="Series (1-5)"
          placeholderTextColor="#888"
          value={set}
          onChangeText={validateSet}
          keyboardType="numeric"
          style={styles.input}
        />
        
        <TextInput
          placeholder="Peso (0-500 kg)"
          placeholderTextColor="#888"
          value={weight}
          onChangeText={validateWeight}
          keyboardType="numeric"
          style={styles.input}
        />
        
        <TextInput
          placeholder="RIR"
          placeholderTextColor="#888"
          value={rir}
          onChangeText={setRir}
          keyboardType="numeric"
          style={styles.input}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={saveExercise}
          disabled={isSaveDisabled}
          style={[styles.saveButton, isSaveDisabled && styles.disabledButton]}
        >
          <Text style={styles.saveButtonText}>Guardar Ejercicio</Text>
          
          <View style={styles.buttonDecoration} />
        </TouchableOpacity>
      </View>

      <BackDelateButton onPressBack={() => 
        router.push({
          pathname: "/ViewExercises",
          params: {
            dayID,
            dayName,
            routineID,
            routineName,
          },
        })
      }/>
      
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161618",
    padding: 20,
  },
  title: {
    color: "white",
    textTransform: "uppercase",
    fontSize: 25,
    fontFamily: "Cochin",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
    fontWeight: "300",
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: "#28282A",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 16,
    fontFamily: "Cochin",
  },
  errorText: {
    color: "#C70000",
    marginBottom: 16,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#28282A",
    marginVertical: 10,
    width: "80%",
    maxWidth: 300,
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    position: "relative",
    padding: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 17,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "300",
  },
  buttonDecoration: {
    position: "absolute",
    width: 100,
    height: 100,
    right: -60,
    bottom: -20,
    borderRadius: 10,
    backgroundColor: "#BCFD0E",
    transform: [{ rotate: "25deg" }],
  }
});

export default CreateDaysScreen;