import React, { useEffect, useState } from "react";
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

const uuidList = [
  '86dc1969-5c7d-4753-b1c6-70bd80dd3d71', // 0 - pecho
  '6b87b3aa-59a5-41bc-b8bc-1c0f021aa97b', // 1 - espalda
  '7a263ea0-4297-4e05-96ec-ea6956756096', // 2 - hombros
  'ceee26af-1e13-4497-936c-9e661d9a7699', // 3 - bíceps
  '65af18e0-3287-4abd-ab7e-ae3fa979af72', // 4 - tríceps
  'a9be2bfa-b424-48b6-a95a-db9a460fb4b2', // 5 - abdominales
  'fe328f8b-c915-46c0-b09e-5826411da488', // 6 - piernas
  '69c95b4e-78a7-482e-b9e8-44b2feff4376', // 7 - gemelos
];

const RoutineScreen = () => {
  
  const toArray = (input: string | string[]): number[] => {
    const values = typeof input === 'string'
      ? input.split(',').map(s => s.trim())
      : input;

    return values
      .map(val => {
        const index = Object.values(groupsDic).indexOf(val);
        return index !== -1 ? index : null;
      })
      .filter((i): i is number => i !== null); // filtramos los que no matchean
  };

  const getUUIDsFromMuscleGroup = (input: string | string[]): string[] => {
    const values = typeof input === 'string'
      ? input.split(',').map(s => s.trim())
      : input;
  
    return values
      .map(val => Object.values(groupsDic).indexOf(val))
      .filter((i): i is number => i !== -1)
      .map(i => uuidList[i]);
  };

  
  const router = useRouter();
  const { dayID, dayName, routineID, routineName,exercises } = useLocalSearchParams();
  

  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [serchArr, setSerchArr] = useState<number[]>([]);
  
  // ✅ Apenas exercises esté disponible o cambie, seteamos los estados
  useEffect(() => {
    console.log("Ejecutando useEffect con exercises: ", exercises);
    if (exercises) {
      setSelectedExercises(getUUIDsFromMuscleGroup(exercises));
      setSerchArr(toArray(exercises));
    }
  }, [exercises]);
 
  const getImageSource = (imageKey: keyof typeof images_obj) => {
    const image = images_obj[imageKey];
  
    if (Platform.OS === "web") {
      
      if (typeof image === 'object' && image !== null && 'default' in image) {
        return { uri: image.default };
      }
  
      if (typeof image === 'string') {
        return { uri: image };
      }
  
      return undefined; 
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

  const backButton = () =>{
     
    router.push({
        pathname: "/ChooseCreateCreated",
        params: {
          dayID,
          dayName,
          routineID,
          routineName,
          shouldRefresh: "true",
          exercises
        },
      })
    
  }

  const goCreateExeButton = (exe:any) =>{
     
    router.push({
        pathname: "/CreateExercises",
        params: {dayID, dayName, routineID, routineName,titleExe:exe.es.title,imgExe:exe.imgPath,idExeList:exe.id },
      })
    
  }
  
   

 console.log('asdsasadds: ',serchArr);
 

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.title, textTransform: "uppercase" }}>
        Lista de Ejercisios
      </Text>
      <ScrollView
        style={{ marginBottom: -20 }}
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
                    onPress={() => goCreateExeButton(exe)}
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
                    onPress={() => goCreateExeButton(exe)}
                    source={getImageSource(
                      exe.imgPath as keyof typeof images_obj
                    )}
                    text={exe.es.title}
                  />
                ))}
        </View>
      </ScrollView>

      <BackDelateButton
        onPressBack={backButton}
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
