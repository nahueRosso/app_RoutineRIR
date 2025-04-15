import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import { BackDelateButton, ButtonCustom } from "@/components/ui/Buttons";
import { images_obj } from "@/constants/Exercise";
import {Image} from "expo-image"

interface Day {
  id: string;
  exercises?: Exercise[];
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  weight: number;
  repetition: number;
  rir: number;
  idExeList:string;
  arrSetWeight: number[];
  arrSetRepetition: number[];
  arrSetRIR: number[];
}

const buildSetArray = (set: number, value: number): number[] => {
  return Array(set).fill(value);
};

const CreateDaysScreen = () => {
  const router = useRouter();
  const { dayID, dayName, routineID, routineName,titleExe ,imgExe ,idExeList } = useLocalSearchParams();
  const [exeName, setExeName] = useState<any>("");
  const [set, setSet] = useState("");
  const [weight, setWeight] = useState("");
  const [repetition, setRepetition] = useState("");
  const [rir, setRir] = useState("2");
  const [routines, setRoutines] = useState<any>([]);
  const [days, setDays] = useState<any[]>([]);
  const [error, setError] = useState("");
  
console.log(titleExe,imgExe,images_obj);

useEffect(() => {
  if (titleExe) {
    setExeName(titleExe);
  }
  if(titleExe==='s'){
    setExeName('');
  }

}, [titleExe]);

  const fetchRoutines = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList = storedData ? JSON.parse(storedData) : [];
      setRoutines(routinesList);

      const foundRoutine = routinesList.find(
        (r: any) => r.name === routineName
      );
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

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Teclado visible
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Teclado oculto
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRoutines();
    }, [fetchRoutines])
  );

  const validateName = (text: string) => {
    // const num = Number(text);
    if (text === "" || text.length > 40) {
      setError("Debe tener menos de 40 caracteres");
    } else {
      setError("");
    }
    setExeName(text);
  };
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

  const validateRepetition = (text: string) => {
    const num = Number(text);
    if (text === "" || isNaN(num) || num < 1 || num > 20) {
      setError("Peso debe estar entre 0 y 500");
    } else {
      setError("");
    }
    setRepetition(text);
  };

  const saveExercise = async () => {
    try {
      if (
        !exeName.trim() ||
        !set.trim() ||
        !weight.trim() ||
        !rir.trim() ||
        error
      ) {
        // Alert.alert("Error", "Todos los campos son obligatorios y deben ser válidos.");
        return;
      }

      const storedData = await AsyncStorage.getItem("routines");
      const routinesList = storedData ? JSON.parse(storedData) : [];

      const routineIndex = routinesList.findIndex(
        (r: any) => r.name === routineName
      );
      if (routineIndex === -1) {
        // Alert.alert("Error", "Rutina no encontrada.");
        return;
      }

      const currentRoutine = routinesList[routineIndex];

      if (Array.isArray(currentRoutine.days)) {
        currentRoutine.days = currentRoutine.days.reduce(
          (acc: any, day: any) => {
            acc[day.id] = day;
            return acc;
          },
          {}
        );
      }

      const currentDay: Day | undefined | any = Object.values(
        currentRoutine.days
      ).find((day: any) => day.id === dayID);

      if (!currentDay) {
        // Alert.alert("Error", "Día no encontrado.");
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
        repetition: parseFloat(repetition),
        rir: parseInt(rir),
        idExeList: idExeList,
        arrSetWeight: buildSetArray(parseInt(set), parseFloat(weight)),
        arrSetRepetition: buildSetArray(parseInt(set), parseFloat(repetition)),
        arrSetRIR: buildSetArray(parseInt(set), parseFloat(rir)),
      };

      currentDay.exercises.push(newExercise);

      await AsyncStorage.setItem("routines", JSON.stringify(routinesList));
      setDays(Object.values(currentRoutine.days));
      // Alert.alert("Éxito", "Ejercicio agregado al día.");
      setExeName("");
      setSet("");
      setWeight("");
      setRepetition("");
      setRir("2");

      router.push({
        pathname: "/ViewExercises",
        params: {
          dayID,
          dayName,
          routineID,
          routineName,
        },
      });
    } catch (error) {
      // Alert.alert("Error", "Hubo un problema al guardar el ejercicio.");
    }
  };

  const isSaveDisabled =
    !!error ||
    !exeName.trim() ||
    !set.trim() ||
    !weight.trim() ||
    parseInt(set) < 1 ||
    parseInt(set) > 5 ||
    parseFloat(weight) < 0 ||
    parseFloat(weight) > 500 ||
    exeName.length > 40;


  const getImageSource = (imageKey: keyof typeof images_obj) => {
    const image = images_obj[imageKey];
  
    if (Platform.OS === "web") {
      
      if (typeof image === 'object' && image !== null && 'default' in image) {
        return { uri: image.default };
      }
  
      if (typeof image === 'string') {
        return { uri: image };
      }
  
      return undefined; 
    }
  
    return typeof image === "number" ? image : { uri: image };
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#161618" }}
    >
      <Text style={styles.title}>CREAR EJERCICIOS</Text>

      <View style={styles.formContainer}>
      <TouchableOpacity
        style={{
          // flex: 2,
          backgroundColor: "#161618",
          borderStyle: "dashed",
          borderRadius: 25,
          borderWidth: 3,
          borderColor: "#28282A",
          marginHorizontal: 20,
          justifyContent: "center",
          alignItems: "center",
          width:300,
          height:200
          
        }}
      >
        {imgExe!==''?<Image 
          source={getImageSource(imgExe as keyof typeof images_obj)}
          contentFit="cover"
          style={{
              // position:'absolute',
              top:-10,
            //   backgroundColor:'red',
              // marginHorizontal:5,
              width: 200,
              height: 200,marginHorizontal: 20,
              justifyContent: "center",
              alignItems: "center",
              
            }}
        />:<><Icon name="add-a-photo" size={24} color="#aaaaaa" />
        <Text style={{color: "#aaa",marginTop: 10,}}>agregar imagen</Text></>}
        </TouchableOpacity>
        

        <TextInput
          placeholder="Nombre del ejercicio"
          placeholderTextColor="#888"
          value={exeName}
          onChangeText={validateName}
          style={{ ...styles.input, ...styles.inputName }}
        />

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "70%",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={styles.inputText}>Series</Text>
            <TextInput
              placeholder="1-5"
              placeholderTextColor="#888"
              value={set}
              onChangeText={validateSet}
              keyboardType="numeric"
              style={{ ...styles.input, ...styles.inputSmall }}
            />
          </View>
          <View>
            <Text style={styles.inputText}>Repes</Text>
            <TextInput
              placeholder="1-20"
              placeholderTextColor="#888"
              value={repetition}
              onChangeText={validateRepetition}
              keyboardType="numeric"
              style={{ ...styles.input, ...styles.inputSmall }}
            />
          </View>
          <View>
            <Text style={styles.inputText}>Peso</Text>
            <TextInput
              placeholder="kg"
              placeholderTextColor="#888"
              value={weight}
              onChangeText={validateWeight}
              keyboardType="numeric"
              style={{ ...styles.input, ...styles.inputSmall }}
            />
          </View>
         
          <View>
            <Text style={styles.inputText}>RIR</Text>
            <TextInput
              placeholder="1-5"
              placeholderTextColor="#888"
              value={rir}
              onChangeText={setRir}
              keyboardType="numeric"
              style={{ ...styles.input, ...styles.inputSmall }}
            />
          </View>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <ButtonCustom
          onPress={saveExercise}
          textFirst="Guardar Ejercicio"
          disabled={isSaveDisabled}
          styleContainer={
            isSaveDisabled
              ? { ...styles.saveButton, ...styles.disabledButton }
              : styles.saveButton
          }
          styleText={{ color: "#161618" }}
          styleBox={{ backgroundColor: "transparent" }}
        />
      </View>

      <BackDelateButton
        onPressBack={() =>
          router.push({
            pathname: "/ViewExercises",
            params: {
              dayID,
              dayName,
              routineID,
              routineName,
            },
          })
        }
        styleContainer={
          isKeyboardVisible ? { display: "none" } : { display: "flex" }
        }
      />
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
    marginTop: 40,
    marginBottom: 40,
    fontWeight: "300",
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10, // paddingHorizontal: 16,
    // marginHorizontal:'10%',
  },
  input: {
    backgroundColor: "#28282A",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 16,
    fontFamily: "Cochin",
  },
  inputName: {
    marginTop:10,
    width: "70%",

  },
  inputSmall: {
    width: 60,
    // paddingHorizontal:'10%'
  },
  inputText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    textTransform:'capitalize',
  },
  errorText: {
    color: "#C70000",
    marginBottom: 16,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#BCFD0E",
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
  },
});

export default CreateDaysScreen;
