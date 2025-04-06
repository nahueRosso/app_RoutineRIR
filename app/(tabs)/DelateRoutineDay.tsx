import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  FlatList,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { BackDelateButton } from "@/components/ui/Buttons";

interface Day {
  id: string;
  name: string;
  priorityExercises: string[];
}

interface Routine {
  id: number;
  name: string;
  days: Record<string, Day>;
}

const DeleteRoutineDayScreen = () => {
  const router = useRouter();
  const { routineID, routineName } = useLocalSearchParams();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dayToDelete, setDayToDelete] = useState<{ routineId: number; dayId: string } | null>(null);

  const fetchRoutines = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("routines");
      let routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
      
      // Normalizar la estructura de days
      routinesList = routinesList.map(routine => {
        if (Array.isArray(routine.days)) {
          const daysObj = routine.days.reduce((acc: Record<string, Day>, day: Day) => {
            acc[day.id] = day;
            return acc;
          }, {});
          return { ...routine, days: daysObj };
        }
        return routine;
      });
      
      setRoutines(routinesList);
    } catch (error) {
      console.error("Error fetching routines:", error);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    fetchRoutines();
  }, [fetchRoutines]));

  // Resto del código permanece igual...
  const showDeleteDialog = (routineId: number | any, dayId: string) => {
    setDayToDelete({ routineId, dayId });
    setModalVisible(true);
  };

  const hideDeleteDialog = () => {
    setModalVisible(false);
    setDayToDelete(null);
  };

  const confirmDelete = async () => {
    if (dayToDelete) {
      try {
        const updatedRoutines = routines.map(routine => {
          if (routine.id === dayToDelete.routineId) {
            const updatedDays = { ...routine.days };
            delete updatedDays[dayToDelete.dayId];
            return { ...routine, days: updatedDays };
          }
          return routine;
        });

        await AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines));
        setRoutines(updatedRoutines);
      } catch (error) {
        Alert.alert("Error", "No se pudo eliminar el día");
      }
    }
    hideDeleteDialog();
  };

  const renderDayItem = ({ item }: { item: [string, Day] }) => {
    const [dayId, day] = item;
    return (
      <TouchableOpacity
        key={dayId}
        style={styles.dayButton}
        onPress={() => showDeleteDialog(routineID, dayId)}
      >
        <Text style={styles.dayButtonText}>
          {day.priorityExercises[0]}{" "}
          {day.priorityExercises[1] ? `- ${day.priorityExercises[1]}` : ""}
        </Text>

        <View style={styles.deleteIconContainer}>
          <Icon name="delete" size={20} color="#161618" />
        </View>

        <View style={styles.buttonDecoration} />
      </TouchableOpacity>
    );
  };

  const currentRoutine = routines.find((item:any) => item.id === routineID);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ELIMINAR DÍA</Text>

      {currentRoutine && (
        <FlatList
          data={Object.entries(currentRoutine.days)}
          renderItem={renderDayItem}
          keyExtractor={([dayId]) => dayId}
          contentContainerStyle={styles.listContainer}
        />
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
              ¿Estás seguro de que deseas eliminar este día?
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
      <BackDelateButton onPressBack={() => router.push({ pathname: '/ViewDay',params: {routineID, routineName,shouldRefresh:'true'}})}/>
     
    </View>
  );
};

// Los estilos permanecen exactamente iguales
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161618",
    padding: 20,
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
  dayButton: {
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
  dayButtonText: {
    color: "white",
    fontSize: 17,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "300",
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
  buttonDecoration: {
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

export default DeleteRoutineDayScreen;