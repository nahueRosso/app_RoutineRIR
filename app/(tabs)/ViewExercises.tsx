import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  BackDelateButton,
  AddButtonBig,
  ButtonCustom,
  ButtonExample,
} from "@/components/ui/Buttons";

interface Routine {
  id: number;
  name: string;
  days: any;
}

const RoutineExercisesScreen = () => {
  const router = useRouter();
  const { dayID, dayName, routineID, routineName, shouldRefresh } =
    useLocalSearchParams();

  const [routines, setRoutines] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoutines = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
      const foundRoutine = routinesList.find(
        (item: any) => item.id === routineID
      );

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
      pathname: "/ChooseCreateCreated",
      params: { dayID, dayName, routineID, routineName },
    });
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  console.log("routines.exercises: ", routines.exercises.length);

  return (
    <View style={styles.container}>
      <Text style={{...styles.title,textTransform:'uppercase'}}>{dayName}</Text>
      <View style={{ display: "flex",marginBottom: 80, }}>
        {routines.exercises.length > 0 ? (
          <FlatList
            data={routines.exercises}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <ButtonCustom
                onPress={() =>
                  router.push({
                    pathname: "/ViewOneExercise",
                    params: {
                      routineID: routineID,
                      routineName: routineName,
                      execerID: item.id,
                      execerName: item.name,
                      dayID,
                      execerNameFirst: routineName,
                    },
                  })
                }
                textFirst={item.name}
              />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListFooterComponent={
              routines.exercises.length < 5 ? (
              <AddButtonBig
                onPress={goAddExe}
                text={"agregar ejercicio"}
                // text={"add new exercises"}
                styleContainer={{ marginTop: 20 }}
              />
              ) : null
            }
          />
        ) : (
          <>
          <ButtonExample textFirst="ejercicio de muestra" />
          <AddButtonBig
        onPress={goAddExe}
        text={"agregar ejercicio"}
        // text={"add new exercises"} 
        styleContainer={{ marginTop: 0 }}
      />
      </>
        )}
      </View>


      {routines.exercises.length < 7 && routines.exercises.length > 4 ? (
        <BackDelateButton
          onPressBack={() =>
            router.push({
              pathname: "/ViewDay",
              params: { routineID, routineName, shouldRefresh: "true" },
            })
          }
          onPressDelate={() =>
            router.push({
              pathname: "/DelateRoutineExercises",
              params: { dayID, dayName, routineID, routineName },
            })
          }
          delate={routines.exercises.length===0?false:true}
          onPressAdd={goAddExe}
          addSmall={true}
        />
      ) : (
        <BackDelateButton
          onPressBack={() =>
            router.push({
              pathname: "/ViewDay",
              params: { routineID, routineName, shouldRefresh: "true" },
            })
          }
          onPressDelate={() =>
            router.push({
              pathname: "/DelateRoutineExercises",
              params: { dayID, dayName, routineID, routineName },
            })
          }
          delate={routines.exercises.length===0?false:true}
        />
      )}

      {/* <BackDelateButton
        onPressBack={() =>
          router.push({
            pathname: "/ViewDay",
            params: { routineID, routineName,shouldRefresh:'true' },
          })
        }
        onPressDelate={() =>
          router.push({
            pathname: "/DelateRoutineExercises",
            params: { dayID, dayName, routineID, routineName },
          })
        }
        delate={true}
      /> */}

      {/* </View> */}
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
});

export default RoutineExercisesScreen;
