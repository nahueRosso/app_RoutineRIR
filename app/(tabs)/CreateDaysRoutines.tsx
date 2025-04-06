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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { BackDelateButton } from "@/components/ui/Buttons";
import {daysOptions, exeOptions} from "@/constants/Days"

interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface DayOption {
  label: string;
  value: string;
  disabled?: boolean;
}


const CustomCheckbox = ({ label, checked, onPress, disabled }: { label: string, checked: boolean, onPress: () => void, disabled?: boolean }) => (
  
  <TouchableOpacity 
    onPress={onPress} 
    style={[styles.customCheckboxContainer, disabled && styles.disabledCheckbox]}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <View style={[styles.checkbox, checked && styles.checked]}>
      {checked && <Icon name="check" size={15} color="#BCFD0E" />}
    </View>
    <Text style={[styles.checkboxLabel, disabled && styles.disabledLabel]}>{label}</Text>
  </TouchableOpacity>
);

const CreateDaysScreen = () => {
  const router = useRouter();
  const { routineName, routineID } = useLocalSearchParams();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [routines, setRoutines] = useState<any>([]);
  const [days, setDays] = useState<any[]>([]);
  const [isMaxDaysReached, setIsMaxDaysReached] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


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

  const toggleDaySelection = (dayValue: string) => {
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
      Alert.alert("Error", "Selecciona al menos un día");
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
        Alert.alert("Error", "No puedes agregar más de 7 días a la rutina");
        return;
      }
  
      newDaysToAdd.forEach(dayName => {
        currentRoutine.days[dayName] = {
          id: `${Date.now()}-${dayName}`,
          name: dayName,
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
  
      Alert.alert("Éxito", "Días y ejercicios agregados a la rutina");
      router.replace({
        pathname: '/ViewDay',
        params: { 
          routineID: routineID,
          routineName: routineName,
          shouldRefresh: 'true' // Bandera para refrescar
        },
      });
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar");
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
              onPress={() => toggleDaySelection(day.value)}
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
      </ScrollView>

      <TouchableOpacity
        onPress={saveDayRoutine}
        disabled={isSaveDisabled}
        style={[styles.saveButton, isSaveDisabled && styles.disabledButton]}
      >
        <Text style={styles.saveButtonText}>Guardar Días</Text>
        <View style={styles.buttonDecoration} />
      </TouchableOpacity>

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
    textAlign: "left",
    fontFamily: "Cochin",
    fontWeight: "300",
  },
  optionsContainer: {
    marginBottom: 20,
  },
  saveButton: {
    // backgroundColor: "#28282A",
    backgroundColor: "#red",
    padding: 15,
    width: "80%",
    maxWidth: 300,
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    position: "relative",
    marginBottom: 5,
    marginLeft:'10%',
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
  },
  backButton: {
    position: "absolute",
    bottom: 30,
    left: 30,
    backgroundColor: "#BCFD0E",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  // Estilos para el CustomCheckbox
  customCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#28282A',
    padding: 10,
    borderRadius: 25,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    borderColor: '#BCFD0E',
  },
  checkboxLabel: {
    color: '#aaa',
    fontFamily: 'Cochin',
    fontWeight: '300',
  },
  disabledCheckbox: {
    opacity: 0.5,
  },
  disabledLabel: {
    color: '#666',
  },
});

export default CreateDaysScreen;