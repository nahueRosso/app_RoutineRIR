import React, { useEffect, useState,useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { BackDelateButton, ButtonCustom } from "@/components/ui/Buttons";
import {daysOptions, exeOptions} from "@/constants/Days"
import { CustomCheckbox } from "@/components/ui/CapsuleTabs";


interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface DayOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const CreateDaysScreen = () => {
  const router = useRouter();
  const { routineName, routineID } = useLocalSearchParams();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [routines, setRoutines] = useState<any>([]);
  const [days, setDays] = useState<any[]>([]);
  const [isMaxDaysReached, setIsMaxDaysReached] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const arr = []
for (let i = 0; i < exeOptions.length; i++) {
  let element = exeOptions[i].label;
  arr.push(element.length)
  }
console.log(arr);


console.log();

  useFocusEffect(useCallback(() => {
    const fetchRoutines = async () => {
      try {
        const storedData = await AsyncStorage.getItem("routines");
        const routinesList = storedData ? JSON.parse(storedData) : [];
        setRoutines(routinesList);

        const currentRoutine = routinesList.find((r: any) => r.name === routineName);
        if (currentRoutine?.days) {
          const daysList = Object.values(currentRoutine.days);
          setDays(daysList);
          setIsMaxDaysReached(daysList.length >= 7);
        }
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    };

    fetchRoutines();
  }, [routineName]));



  useEffect(() => {
    setModalVisible(selectedDays.length > 1);
  }, [selectedDays]);

  const toggleDaySelection = (dayValue: string,key:number) => {
    setSelectedDays(prev => 
      prev.includes(dayValue) 
        ? prev.filter(d => d !== dayValue) 
        : [...prev, dayValue]
    );
  };

  const toggleExerciseSelection = (exeValue: string) => {
    setSelectedExercises(prev => 
      prev.includes(exeValue) 
        ? prev.filter(e => e !== exeValue) 
        : [...prev, exeValue]
    );
  };

  const saveDayRoutine = async () => {
    if (selectedDays.length === 0) {
      // Alert.alert("Error", "Selecciona al menos un día");
      return;
    }
    
    try {
      const storedData = await AsyncStorage.getItem("routines");
      let routinesList = storedData ? JSON.parse(storedData) : [];
      
      let routineIndex = routinesList.findIndex((r: any) => r.name === routineName);
      if (routineIndex === -1) {
        routinesList.push({
          name: routineName,
          id: Date.now(),
          days: {}
        });
        routineIndex = routinesList.length - 1;
      }
  
      const currentRoutine = {...routinesList[routineIndex]};
      currentRoutine.days = currentRoutine.days || {};
  
      const existingDays = Object.keys(currentRoutine.days);
      const newDaysToAdd = selectedDays.filter(day => !existingDays.includes(day));
      if (existingDays.length + newDaysToAdd.length > 7) {
        // Alert.alert("Error", "No puedes agregar más de 7 días a la rutina");
        return;
      }
  
      newDaysToAdd.forEach(dayName => {
        currentRoutine.days[dayName] = {
          id: `${Date.now()}-${dayName}`,
          name: dayName,
          key:daysOptions.find((e:any)=>e.label == dayName)?.key,
          exercises: [],
          priorityExercises: [...selectedExercises]
        };
      });
  
      selectedDays.forEach(dayName => {
        if (currentRoutine.days[dayName]) {
          currentRoutine.days[dayName].priorityExercises = [
            ...new Set([
              ...(currentRoutine.days[dayName].priorityExercises || []),
              ...selectedExercises
            ])
          ];
        }
      });
  
      routinesList[routineIndex] = currentRoutine;
  
      await AsyncStorage.setItem("routines", JSON.stringify(routinesList));
  
      setRoutines(routinesList);
      setDays(Object.values(currentRoutine.days));
      setIsMaxDaysReached(Object.keys(currentRoutine.days).length >= 7);
      setSelectedDays([]);
      setSelectedExercises([]);
  
      // Alert.alert("Éxito", "Días y ejercicios agregados a la rutina");
      router.replace({
        pathname: '/ViewDay',
        params: { 
          routineID: routineID,
          routineName: routineName,
          shouldRefresh: 'true' // Bandera para refrescar
        },
      });
    } catch (error) {
      // Alert.alert("Error", "Hubo un problema al guardar");
    }
  };

  const isSaveDisabled = selectedDays.length === 0 || isMaxDaysReached || selectedExercises.length === 0;



  return (
    <View style={styles.container}>
      <Text style={styles.title}>AGREGAR DÍAS</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Seleccione días</Text>
        <View style={styles.optionsContainer}>
          {daysOptions.map((day) => (
            <CustomCheckbox
              key={day.value}
              label={day.label}
              checked={selectedDays.includes(day.value)}
              onPress={() => toggleDaySelection(day.value,day.key)}
              disabled={days.some(d => d.name === day.value)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Seleccione ejercicios</Text>
        <View style={styles.optionsContainer}>
          {exeOptions.map((exercise) => (
            <CustomCheckbox
              key={exercise.value}
              label={exercise.label}
              checked={selectedExercises.includes(exercise.value)}
              onPress={() => toggleExerciseSelection(exercise.value)}
            />
          ))}
        </View>

        <ButtonCustom onPress={saveDayRoutine} textFirst="Guardar Días" styleContainer={isSaveDisabled?{...styles.saveButton,...styles.disabledButton}:styles.saveButton} styleText={{color:'#161618'}} styleBox={{backgroundColor:'transparent'}} />
      </ScrollView>


      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Si seleccionas más de un día, los cambios realizados en uno se
              replicarán en los demás.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        <BackDelateButton onPressBack={() => router.push({ pathname: '/ViewDay',params: {routineID, routineName,shouldRefresh:'true'}})}/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161618",
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 110,
  },
  title: {
    color: "white",
    fontSize: 25,
    fontFamily: "Cochin",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "300",
  },
  sectionTitle: {
    color: "white",
    fontSize: 15,
    marginBottom: 8,
    marginTop: 13,
    marginLeft:'12%',
    textAlign: "left",
    fontFamily: "Cochin",
    fontWeight: "300",
    textTransform:'capitalize'
  },
  optionsContainer: {
    flexDirection: 'row',  // Esto coloca los hijos en fila
    flexWrap: 'wrap',      // Permite que los elementos pasen a la siguiente línea si no caben
    gap: 8,      
    marginHorizontal:'10%',          // Espacio entre elementos (React Native 0.71+)
    marginBottom: 20,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#BCFD0E",
    // backgroundColor: "red",
    padding: 15,
    width: "80%",
    maxWidth: 300,
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    // position: "relative",
    marginTop:20,
    marginBottom: 5,
    // marginLeft:'10%',
    zIndex:10000,
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
    textTransform: "capitalize",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#161618",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    borderColor: "#28282A",
    borderWidth: 1,
  },
  modalText: {
    color: "white",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 15,
    fontFamily: "Cochin",
  },
  modalButton: {
    backgroundColor: "#BCFD0E",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  modalButtonText: {
    color: "#161618",
    textAlign: "center",
    fontWeight: "bold",
  } 
});

export default CreateDaysScreen;