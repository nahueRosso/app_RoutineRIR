import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import { BackDelateButton } from "@/components/ui/Buttons";
import { CustomCheckboxSmall } from "@/components/ui/CapsuleTabs";
import { images_obj } from "@/constants/Exercise";
import dataExecises from "../../dataExecises.json";
import { CartExe } from "@/components/ui/Cart";

const groupsDic = {
  chest: "pecho",
  back: "espalda",
  shoulders: "hombros",
  biceps: "bíceps",
  triceps: "tríceps",
  abdominals: "abdominales",
  legs: "piernas",
  calves: "gemelos",
};

const RoutineScreen = () => {
  const router = useRouter();
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [serchArr, setSerchArr] = useState([]);
  const { dayID, dayName, routineID, routineName } = useLocalSearchParams();

  const getImageSource = (imageKey: keyof typeof images_obj) => {
    const image = images_obj[imageKey];

    if (Platform.OS === "web") {
      return { uri: image.default || image };
    }

    return typeof image === "number" ? image : { uri: image };
  };

  const toggleExerciseSelection = (exeValue: string, exeName: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exeValue)
        ? prev.filter((e) => e !== exeValue)
        : [...prev, exeValue]
    );

    const index = Object.keys(groupsDic).indexOf(exeName);

    setSerchArr(
      (prev: any) =>
        prev.includes(index)
          ? prev.filter((i: any) => i !== index) // lo saco si ya estaba
          : [...prev, index] // lo agrego si no estaba
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.title, textTransform: "uppercase" }}>
        Lista de Ejercisios
      </Text>
      <ScrollView
        style={{ marginBottom: 8 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "space-between",
            marginHorizontal: "10%",
            marginBottom: 20,
            marginTop: 10,
          }}
        >
          {dataExecises.map((exercise, index) => (
            <CustomCheckboxSmall
              key={exercise.id}
              label={groupsDic[exercise.nameExe as keyof typeof groupsDic]}
              //   checked={bool}
              //   onPress={() => setBool(true)}
              checked={selectedExercises.includes(exercise.id)}
              onPress={() =>
                toggleExerciseSelection(exercise.id, exercise.nameExe)
              }
            />
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 20,
            justifyContent: "space-between",
            marginHorizontal: "10%",
            marginBottom: 20,
            marginTop: 10,
          }}
        >
          {serchArr.length === 0
            ? dataExecises.map((group) =>
                group.exercises.map((exe, index) => (
                  <CartExe
                    key={index}
                    id={exe.id}
                    onPress={() => console.log(exe.nameExe)}
                    source={getImageSource(
                      exe.imgPath as keyof typeof images_obj
                    )}
                    text={exe.es.title}
                  />
                ))
              )
            : serchArr
                .flatMap((i) => dataExecises[i].exercises)
                .map((exe, index) => (
                  <CartExe
                    key={index}
                    id={exe.id}
                    onPress={() => console.log(exe.nameExe)}
                    source={getImageSource(
                      exe.imgPath as keyof typeof images_obj
                    )}
                    text={exe.es.title}
                  />
                ))}
        </View>
      </ScrollView>

      <BackDelateButton
        onPressBack={() =>
          router.push({
            pathname: "/ChooseCreateCreated",
            params: {
              dayID,
              dayName,
              routineID,
              routineName,
              shouldRefresh: "true",
            },
          })
        }
        styleContainer={{ backgroundColor: "transparent" }}
        delate={false}
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
