import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useFocusEffect } from 'expo-router';
import { BackDelateButton, ButtonCustom } from "@/components/ui/Buttons";

interface Routine {
  id: string;
  name: string;
}

const DeleteRoutineScreen = () => {
  const router = useRouter();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);

  const fetchRoutines = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
      setRoutines(routinesList);
    } catch (error) {
      console.error("Error fetching routines:", error);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    fetchRoutines();
  }, [fetchRoutines]));

  const showDeleteDialog = (routine: Routine) => {
    setRoutineToDelete(routine);
    setModalVisible(true);
  };

  const hideDeleteDialog = () => {
    setModalVisible(false);
    setRoutineToDelete(null);
  };

  const confirmDelete = async () => {
    if (routineToDelete) {
      try {
        const updatedRoutines = routines.filter(
          (routine) => routine.id !== routineToDelete.id
        );
        await AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines));
        setRoutines(updatedRoutines);
      } catch (error) {
        Alert.alert("Error", "No se pudo eliminar la rutina");
      }
    }
    hideDeleteDialog();
  };

  const renderRoutineItem = ({ item }: { item: Routine }) => (
    <ButtonCustom onPress={() => showDeleteDialog(item)} textFirst={item.name} styleBox={{backgroundColor:'#C70000'}} textSecond={<Icon name="delete" size={25} style={{marginRight: -40}} color="#262628" />} />
    // <TouchableOpacity
    //   style={styles.routineButton}
    //   onPress={() => showDeleteDialog(item)}
    // >
    //   <Text style={styles.routineButtonText}>{item.name}</Text>
      
    //   <View style={styles.deleteIconContainer}>
    //     <Icon name="delete" size={20} color="#161618" />
    //   </View>
      
    //   <View style={styles.deleteDecoration} />
    // </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ELIMINAR RUTINA</Text>

      <FlatList
        data={routines}
        renderItem={renderRoutineItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideDeleteDialog}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              ¿Estás seguro de que deseas eliminar la rutina "{routineToDelete?.name}"?
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


     <BackDelateButton onPressBack={() => router.push({ pathname: '/View'})}/>  
    </View>
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
  routineButton: {
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
  routineButtonText: {
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
  deleteDecoration: {
    position: "absolute",
    width: 100,
    height: 100,
    right: -60,
    bottom: -20,
    borderRadius: 10,
    backgroundColor: "#C70000",
    transform: [{ rotate: "25deg" }],
  },
  modalContainer: {
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

export default DeleteRoutineScreen;