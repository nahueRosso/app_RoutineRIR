import React, { useState, useCallback } from "react";
import { View, Text, FlatList, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  BackDelateButton,
  AddButtonBig,
  ButtonCustom,
  ButtonExample,
} from "@/components/ui/Buttons";
import { daysOptions } from "@/constants/Days";

interface DaysScreenProps {
  navigation: any;
  route: any;
}

interface Routine {
  id: number;
  name: string;
  days: any;
}

const RoutineScreen = () => {
  const router = useRouter();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const { routineID, routineName, shouldRefresh } = useLocalSearchParams();

  const [refreshKey, setRefreshKey] = useState(0);

  const fetchRoutines = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("routines");
      const routinesList: Routine[] = storedData ? JSON.parse(storedData) : [];
      setRoutines(routinesList);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRoutines();

      if (shouldRefresh === "true") {
        setRefreshKey((prev) => prev + 1);
      }
    }, [fetchRoutines, shouldRefresh])
  );

  const daysObject =
    routines.find((item: any) => item.id === routineID)?.days || {};
  const daysArray = Object.values(daysObject);
  // console.log("daysArray: ", daysArray.length);

  const goAddDays = () => {
    router.push({
      pathname: "/CreateDaysRoutines",
      params: { routineName: routineName, routineID: routineID },
    });
  };

  const navigateToExercises = (day: any) => {
    router.push({
      pathname: "/ViewExercises",
      params: {
        dayID: day.id,
        dayName: day.name,
        routineID: routineID,
        routineName: routineName,
      },
    });
  };

  const deleteRoutineDay = () => {
    router.push({
      pathname: "/DelateRoutineDay",
      params: {
        routineID: routineID,
        routineName: routineName,
      },
    });
  };

  const renderDayItem = ({ item: day }: { item: any }) => (

    <ButtonCustom
      onPress={() => navigateToExercises(day)}
      textFirst={day.priorityExercises[1]?`${day.priorityExercises[0]?.slice(0,7)} - ${day.priorityExercises[1]?.slice(0,7)}`:`${day.priorityExercises[0]?.slice(0,7)}`}
      textSecond={day.name}    />
  );

// console.log([...daysArray]);
// console.log('asddasds','eterno'.slice(0,7));

  return (
    <View style={styles.container} key={refreshKey}>
      <Text style={{...styles.title,textTransform:'uppercase'}}>{routineName}</Text>
      <View style={{ display: "flex" }}>
        {daysArray.length! ? (
          <FlatList
            data={[...daysArray].sort((a:any, b:any) => a.key - b.key)}
            renderItem={renderDayItem}
            keyExtractor={(item: any) => item.id}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={
              daysArray.length < 5 ? (
                <AddButtonBig
                  onPress={goAddDays}
                  text={"agregar un nuevo día"}
                  // text={"add new days"}
                  styleContainer={{ marginTop: 20 }}
                  />
                ) : null
              }
              />
            ) : (
              <>
            <ButtonExample textFirst="dia de ejemplo" />
            <AddButtonBig
              onPress={goAddDays}
              text={"agregar un nuevo día"}
              // text={"add new days"}
              styleContainer={{ marginTop: 0 }}
            />
            </>
        )}
      </View>

      {daysArray.length < 7 && daysArray.length > 4 ? (
        <BackDelateButton
          onPressBack={() => router.push({ pathname: "/View" })}
          onPressDelate={deleteRoutineDay}
          delate={daysArray.length===0?false:true}
          onPressAdd={goAddDays}
          addSmall={true}
        />
      ) : (
        <BackDelateButton
          onPressBack={() => router.push({ pathname: "/View" })}
          onPressDelate={deleteRoutineDay}
          delate={daysArray.length===0?false:true}
        />
      )}
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
  listContent: {
    paddingBottom: 20,
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
  dayTag: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  dayTagText: {
    color: "black",
    fontSize: 15,
    fontFamily: "Cochin",
    textAlign: "left",
    fontWeight: "300",
    marginLeft: -55,
    // marginTop:15,
    zIndex: 10000,
  },
  dayDecoration: {
    position: "absolute",
    width: 100,
    height: 100,
    left: -60,
    bottom: -20,
    borderRadius: 10,
    zIndex: 0,
    backgroundColor: "#BCFD0E",
    transform: [{ rotate: "-35deg" }],
  },
  navigationButtons: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
});

export default RoutineScreen;
