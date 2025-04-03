import React, { useEffect, useState,useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  useFocusEffect(useCallback(() => {
    fetchRoutines();
  }, [fetchRoutines]));

  const renderRoutineItem = ({ item }: { item: Routine }) => (
    <TouchableOpacity
      style={styles.routineButton}
      onPress={() => router.push({
        pathname: '/ViewDay',
        params: { routineID: item.id, routineName: item.name },
      })}
    >
      <Text style={styles.routineButtonText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MIS RUTINAS</Text>
      <View style={{ display: 'flex' }}>
        <FlatList
          data={routines}
          renderItem={renderRoutineItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
        {routines.length < 5 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/CreateRoutine')}
          >
            <View style={styles.addButtonTextContainer}>
              <Text style={styles.addButtonText}>CREATE NEW{"\n"}ROUTINE</Text>
            </View>
            <View style={styles.addButtonIconContainer}>
              <Icon name="add" size={40} color="#28282A" />
            </View>
            <View style={styles.addButtonDecoration} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={20} color="#161618" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => router.push('/DelateRoutine')}
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
  addButton: {
    backgroundColor: "#28282A",
    marginTop: 0,
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
  bottomButtons: {
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

export default RoutineScreen;