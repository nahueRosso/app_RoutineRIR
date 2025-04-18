import React, { useState, useCallback, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  KeyboardAvoidingView,
  Modal
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useFocusEffect } from 'expo-router';
import { BackDelateButton,ButtonCustom } from "@/components/ui/Buttons";

const CreateRoutineScreen = () => {
  const router = useRouter();
  const [routineName, setRoutineName] = useState("");
  const [routinesCount, setRoutinesCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const loadRoutinesCount = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routines = storedData ? JSON.parse(storedData) : [];
      setRoutinesCount(routines.length);
    } catch (error) {
      console.error("Error loading routines count:", error);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadRoutinesCount();
  }, [loadRoutinesCount]));

  const saveRoutine = async () => {
    try {
      const storedData = await AsyncStorage.getItem("routines");
      let routines = storedData ? JSON.parse(storedData) : [];

      if (!Array.isArray(routines)) {
        routines = [];
      }

      if (routines.length >= 15) {
        setModalVisible(true);
        return;
      }

      if (!routineName.trim()) {
        // Alert.alert("Error", "El nombre de la rutina no puede estar vacío.");
        return;
      }

      const newRoutine = {
        id: Date.now().toString(),
        name: routineName,
        days: {}
      };

      const updatedRoutines = [...routines, newRoutine];

      await AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines));
      setRoutinesCount(updatedRoutines.length);

      // Alert.alert("Éxito", "Rutina guardada");
      setRoutineName("");
      router.push({
        pathname: '/View',
        // pathname: '/CreateDaysRoutines',
        // params: { routineName },
      });
    } catch (error) {
      // Alert.alert("Error", "Hubo un problema al guardar la rutina.");
    }
  };

  const goToDeleteRoutine = () => {
    setModalVisible(false);
    router.push('/DelateRoutine');
  };


  return (
    <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  style={{flex: 1, backgroundColor: '#161618'}}
>
  <View style={styles.container}>
    <Text style={styles.title}>AGREGAR RUTINA</Text>
    
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Nombre de la rutina"
        placeholderTextColor="#888"
        value={routineName}
        onChangeText={setRoutineName}
        style={styles.input}
      />
      <ButtonCustom 
        onPress={saveRoutine} 
        textFirst="Guardar rutina" 
        styleContainer={{backgroundColor: "#BCFD0E"}} 
        styleText={{color:'#161618'}}
      />
    </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¡Llegaste al máximo de rutinas (7)!</Text>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={goToDeleteRoutine}
              >
              <Text style={styles.modalButtonText}>Eliminar Rutina</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
               
        <BackDelateButton onPressBack={() => router.push({ pathname: '/View',params: { routineName,shouldRefresh:'true'}})}/>  
      
</View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161618",
    paddingTop: 20,
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
  inputContainer: {
    // marginTop:0,
    marginVertical:'30%',
    backgroundColor: "#28282A",
    height:'35%',
    width:'90%',
    margin:'5%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    left:0,
    right:0,
    top:0,
    bottom:0,
    borderRadius:10,
  },
  input: {
    backgroundColor: "#161618",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginHorizontal:'10%',
    width: "80%",
    marginBottom: 16,
    fontFamily: "Cochin",
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
  modalButton: {
    backgroundColor: "#C70000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
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

export default CreateRoutineScreen;