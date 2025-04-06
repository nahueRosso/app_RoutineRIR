import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import {
  BackDelateButton,
  AddButtonBig,
} from "@/components/ui/Buttons";

interface Routine {
  id: number;
  name: string;
}

const RoutineScreen = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const router = useRouter();

  const fetchRoutines = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
      setRoutines(routinesList);
    } catch (error) {
      console.error("Error loading routines:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRoutines();
    }, [fetchRoutines])
  );

  const renderRoutineItem = ({ item }: { item: Routine }) => (
    <TouchableOpacity
      style={styles.routineButton}
      onPress={() =>
        router.push({
          pathname: "/ViewDay",
          params: { routineID: item.id, routineName: item.name },
        })
      }
    >
      <Text style={styles.routineButtonText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MIS RUTINAS</Text>
      <View style={{ display: "flex" }}>
        <FlatList
          data={routines}
          renderItem={renderRoutineItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
        {routines.length < 5 && (
          <AddButtonBig
            onPress={() => router.push("/CreateRoutine")}
            text={"create new routine"}
          />
        )}
      </View>

<BackDelateButton onPressBack={() => router.back()}
      onPressDelate={() => router.push("/DelateRoutine")}
      delate={true}
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
    paddingBottom: 20,
  },
  routineButton: {
    backgroundColor: "#28282A",
    marginVertical: 10,
    width: "80%",
    maxWidth: 300,
    borderRadius: 10,
    alignSelf: "center",
    padding: 15,
  },
  routineButtonText: {
    color: "white",
    fontSize: 17,
    fontFamily: "Cochin",
    textAlign: "center",
    fontWeight: "300",
  },
});

export default RoutineScreen;
