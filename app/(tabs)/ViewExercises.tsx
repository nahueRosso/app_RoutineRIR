import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';

interface Routine {
  id: number;
  name: string;
  days: any;
}


const RoutineExercisesScreen = () => {
  const router = useRouter();
  const { dayID, dayName, routineID, routineName,shouldRefresh } = useLocalSearchParams();
  const [routines, setRoutines] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoutines = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
      const foundRoutine = routinesList.find((item: any) => item.id === routineID);

      if (!foundRoutine) return;
      const daysArray = Object.values(foundRoutine.days);
      if (!Array.isArray(daysArray)) return;

      const foundDay = daysArray.find((day: any) => day.id === dayID);
      if (!foundDay) return;

      setRoutines(foundDay);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [routineID, dayID]);

  useFocusEffect(
    useCallback(() => {
      fetchRoutines();
    }, [fetchRoutines])
  );

  const goAddExe = () => {
    router.push({
      pathname: '/CreateExercises',
      params: { dayID, dayName, routineName },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  console.log(routines,routineID  ,routineName)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EJERCICIOS</Text>
      <View style={{ display: 'flex' }}>
        {Array.isArray(routines?.exercises) && routines.exercises.length > 0 ? (
          <FlatList
            data={routines.exercises}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push({
                  pathname: '/ViewOneExercise',
                  params: {
                    routineID: item.id,
                    routineName: item.name,
                    dayID,
                    routineNameFirst: routineName,
                  },
                })}
                style={styles.exerciseButton}
              >
                <Text style={styles.exerciseText}>{item.name}</Text>
                <View style={styles.exerciseDecoration} />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <Text style={styles.noExercisesText}>No hay ejercicios disponibles</Text>
        )}

        <TouchableOpacity onPress={goAddExe} style={styles.addButton}>
          <View style={styles.addButtonTextContainer}>
            <Text style={styles.addButtonText}>ADD NEW{"\n"}EXERCISES</Text>
          </View>
          <View style={styles.addButtonIconContainer}>
            <Icon name="add" size={40} color="#28282A" />
          </View>
          <View style={styles.addButtonDecoration} />
        </TouchableOpacity>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/ViewDay'})} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#161618" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push({
            pathname: '/DelateRoutineExercises',
            params: { dayID, dayName, routineID, routineName },
          })}
          style={styles.deleteButton}
        >
          <Icon name="delete" size={20} color="#161618" />
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: "#28282A",
    // marginTop: 20,
    width: "80%",
    height: 100,
    maxWidth: 300,
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    position: "relative",
  },
  addButtonTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 100,
    width: "70%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "300",
    lineHeight: 30,
  },
  addButtonIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 100,
    height: "100%",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonDecoration: {
    position: "absolute",
    width: 150,
    height: 120,
    right: -60,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: "#BCFD0E",
    transform: [{ rotate: "30deg" }],
  },
  navigationContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  backButton: {
    backgroundColor: "#BCFD0E",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#C70000",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RoutineExercisesScreen;