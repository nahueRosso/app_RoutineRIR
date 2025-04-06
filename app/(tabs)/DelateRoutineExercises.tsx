import React, { useEffect, useState,useCallback } from "react";
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  FlatList,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRouter,useFocusEffect,useLocalSearchParams } from 'expo-router'
import { BackDelateButton,ButtonCustom } from "@/components/ui/Buttons";


interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
}

interface Day {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface Routine {
  id: number;
  name: string;
  days: Day[];
}



const DeleteRoutineExercisesScreen = () => {
  const router = useRouter();
  const { dayID, dayName, routineID, routineName } = useLocalSearchParams();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [currentDay, setCurrentDay] = useState<Day | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchRoutines = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
      setRoutines(routinesList);
      
      const foundRoutine = routinesList.find((item: Routine | any) => item.id === routineID);
      if (foundRoutine) {
        const foundDay = Object.values(foundRoutine.days).find(day => day.id === dayID);
        setCurrentDay(foundDay || null);
      }
    } catch (error) {
      Alert.alert("Error", `${error}`);
    } finally {
      setLoading(false);
    }
  }, [routineID, dayID]);

  useFocusEffect(
    useCallback(() => {
      fetchRoutines();
    }, [fetchRoutines])
  );
  const showDeleteDialog = (exerciseId: string) => {
    setExerciseToDelete(exerciseId);
    setModalVisible(true);
  };

  const hideDeleteDialog = () => {
    setModalVisible(false);
    setExerciseToDelete(null);
  };

  const confirmDelete = async () => {
    if (exerciseToDelete && currentDay) {
      try {
        // Actualizamos las rutinas
        const updatedRoutines = routines.map((routine:any) => {
          if (routine.id === routineID) {
            const updatedDays = Object.values(routine.days).map((day:any) => {
              if (day.id === dayID) {
                // Filtramos el ejercicio a eliminar
                const updatedExercises = day.exercises.filter((ex:any) => ex.id !== exerciseToDelete);
                return { ...day, exercises: updatedExercises };
              }
              return day;
            });
            return { ...routine, days: updatedDays };
          }
          return routine;
        });

        await AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines));
        setRoutines(updatedRoutines); 
        const updatedDay = updatedRoutines
          .find(r => r.id === routineID)
          ?.days.find((d:any) => d.id === dayID);
        setCurrentDay(updatedDay || null);
      } catch (error) {
        Alert.alert("Error", `${error}` );
      }
    }
    hideDeleteDialog();
  };
  
  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <ButtonCustom onPress={() => showDeleteDialog(item.id)} textFirst={item.name} styleBox={{backgroundColor:'#C70000'}} textSecond={<Icon name="delete" size={25} style={{marginRight: -40}} color="#262628" />} />
    // <TouchableOpacity
    // style={styles.exerciseButton}
    // onPress={() => showDeleteDialog(item.id)}
    // >
    //   <Text style={styles.exerciseButtonText}>{item.name}</Text>
      
    //   <View style={styles.deleteIconContainer}>
    //     <Icon name="delete" size={20} color="#161618" />
    //   </View>
      
    //   <View style={styles.buttonDecorationRed} />
    // </TouchableOpacity>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BCFD0E" />
      </View>
    );
  }
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ELIMINAR EJERCICIOS</Text>

      {currentDay?.exercises?.length ? (
        <FlatList
          data={currentDay.exercises}
          renderItem={renderExerciseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noExercisesText}>No hay ejercicios disponibles</Text>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideDeleteDialog}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              ¿Estás seguro de que deseas eliminar este ejercicio?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={hideDeleteDialog}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteButtonModal}
                onPress={confirmDelete}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BackDelateButton onPressBack={() => router.push({ pathname: '/ViewExercises',params: {dayID, dayName, routineID, routineName,shouldRefresh:'true'}})}/>
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
  listContainer: {
    paddingBottom: 80,
  },
  exerciseButton: {
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
  exerciseButtonText: {
    color: "white",
    fontSize: 17,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "300",
  },
  noExercisesText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Cochin",
  },
  deleteIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDecorationRed: {
    position: "absolute",
    width: 100,
    height: 100,
    right: -60,
    bottom: -20,
    borderRadius: 10,
    backgroundColor: "#C70000",
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
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#28282A",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  deleteButtonModal: {
    backgroundColor: "#C70000",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
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
});

export default DeleteRoutineExercisesScreen;