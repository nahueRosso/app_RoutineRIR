import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import {
  BackDelateButton,
  AddButtonBig,
  AddButtonSmall,
  ButtonCustom,
  ButtonExample
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
    <ButtonCustom
      onPress={() =>
        router.push({
          pathname: "/ViewDay",
          params: { routineID: item.id, routineName: item.name },
        })
      }
      textFirst={item.name}
    />
  );

  console.log(routines.length);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MIS RUTINAS</Text>
      <View style={{
    flex: 1,  // Esto es crucial
    marginBottom: 80,  // Espacio para los botones inferiores
  }}>
      {routines.length ? (
        <FlatList
          data={routines}
          renderItem={renderRoutineItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={routines.length < 5 ? 
            (
            <AddButtonBig
              onPress={() => router.push("/CreateRoutine")}
              text={"create new routine"}
              styleContainer={{marginTop:20}}
            /> 
          ): null
        }
        />
      ) : (
      <>
        <ButtonExample textFirst="rutina de ejemplo" />
      <AddButtonBig
        onPress={() => router.push("/CreateRoutine")}
        text={"create new routine"}
        styleContainer={{marginTop:0}}
      />
      </> 
      )}

    </View>
        {(routines.length < 15 && routines.length > 4) ? (<BackDelateButton
        onPressBack={() => router.back()}
        onPressDelate={() => router.push("/DelateRoutine")}
        delate={true}
        onPressAdd={() => router.push("/CreateRoutine")}
        addSmall={true}
      />):(
      <BackDelateButton
        onPressBack={() => router.back()}
        onPressDelate={() => router.push("/DelateRoutine")}
        delate={true}
      />)}
      
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
