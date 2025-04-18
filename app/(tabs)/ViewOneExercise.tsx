import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView as ScrView,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import { BackDelateButton } from "@/components/ui/Buttons";
import { Image } from "expo-image";
import { images_obj } from "@/constants/Exercise";
import dataExecises from "../../dataExecises.json";
import { Animated, Easing } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface Exercise {
  id: string;
  name: string;
  idExeList: string;
  arrSetWeight: number[];
  arrSetRepetition: number[];
  arrSetRIR: number[];
  lead:any;
  firstPosition:any;
}

interface RoutineDay {
  id: string;
  name: string;
  exercises: Exercise[];
  priorityExercises: string[];
}

interface Routine {
  id: string;
  name: string;
  days: {
    [key: string]: RoutineDay;
  };
}
interface ApiData {
  exercises: Exercise[];
}

const RoutineOneExerciseScreen = () => {
  const router = useRouter();
  const {
    routineID,
    routineName,
    execerID,
    execerName,
    dayID,
    execerNameFirst,
  } = useLocalSearchParams();
  const [dayName, setDayName] = useState<string>("");
  const [api, setApi] = useState<ApiData | any>();
  const [main, setMain] = useState<Exercise | undefined>();
  const [weights, setWeights] = useState<any>(main?.arrSetWeight || []);
  const [repetitions, setRepetitions] = useState<any>(
    main?.arrSetRepetition || []
  );
  const [rirs, setRirs] = useState<any>(main?.arrSetRIR || []);
  const [idExeList, setIdExeList] = useState(main?.idExeList || []);
  const [exeObjet, setExeObjet] = useState<any>();
  const [showInfo, setShowInfo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const slideAnim = useRef(new Animated.Value(1000)).current; // valor alto, fuera de pantalla

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (idExeList) {
      const exercise = findExerciseById(dataExecises, idExeList);
      setExeObjet(exercise);
    }
  }, [idExeList, rirs]);
  

  const getImageSource = (imageKey: keyof typeof images_obj) => {
    const image = images_obj[imageKey];

    if (Platform.OS === "web") {
      if (typeof image === "object" && image !== null && "default" in image) {
        return { uri: image.default };
      }

      if (typeof image === "string") {
        return { uri: image };
      }

      return undefined;
    }

    return typeof image === "number" ? image : { uri: image };
  };

  const handleToggleInfo = () => {
    if (!showInfo) {
      setShowInfo(true); // mostramos el componente
      Animated.timing(slideAnim, {
        toValue: 0, // lo traemos arriba
        duration: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1000, // lo mandamos abajo
        duration: 300,
        easing: Easing.in(Easing.exp),
        useNativeDriver: true,
      }).start(() => {
        setShowInfo(false); // ocultamos después de la animación
      });
    }
  };

  function findExerciseById(dataExercises: any, exerciseId: any) {
    let result: any = null;
    dataExercises.forEach((category: any) => {
      if (category.exercises && !result) {
        const exercise = category.exercises.find(
          (ex: any) => ex.id === exerciseId
        );
        if (exercise) result = exercise;
      }
    });
    return result;
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Teclado visible
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Teclado oculto
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const storedData = await AsyncStorage.getItem("routines");
          if (!storedData) return;

          const routinesList = JSON.parse(storedData);
          const routine = routinesList.find(
            (r: any) => r.name === execerNameFirst
          );
          if (!routine) return;

          const day: any = Object.values(routine.days).find(
            (d: any) => d.id === dayID
          );
          if (!day) return;
          setDayName(`${day.name}`);

          setApi(day);
          const currentExercise = day.exercises?.find(
            (e: any) => e.id === execerID
          );
          setMain(currentExercise);

          if (currentExercise) {
            setWeights(currentExercise.arrSetWeight || []);
            setRepetitions(currentExercise.arrSetRepetition || []);
            setRirs(currentExercise.arrSetRIR || []);
            setIdExeList(currentExercise.idExeList || []);
          }
        } catch (error) {
          console.error("Error loading data", error);
        }
      };

      loadData();
    }, [execerNameFirst, dayID, execerID]) // ✅ Dependencias correctas
  );

  const saveChanges = async () => {
    if (!main) return;

    setIsSaving(true);
    try {
      const storedData = await AsyncStorage.getItem("routines");
      if (!storedData) throw new Error("No routines found");

      const routinesList = JSON.parse(storedData);
      const routineIndex = routinesList.findIndex(
        (r: any) => r.name === execerNameFirst
      );
      if (routineIndex === -1) throw new Error("Routine not found");

      const dayKey = Object.keys(routinesList[routineIndex].days).find(
        (key) => routinesList[routineIndex].days[key].id === dayID
      );

      if (!dayKey) throw new Error("Day not found");

      const exerciseIndex = routinesList[routineIndex].days[
        dayKey
      ].exercises.findIndex((e: any) => e.id === main.id);

      if (exerciseIndex === -1) throw new Error("Exercise not found");

      const updatedRoutines = JSON.parse(JSON.stringify(routinesList));
      updatedRoutines[routineIndex].days[dayKey].exercises[
        exerciseIndex
      ].arrSetWeight = [...weights];
      updatedRoutines[routineIndex].days[dayKey].exercises[
        exerciseIndex
      ].arrSetRepetition = [...repetitions]; // Añade esta línea
      updatedRoutines[routineIndex].days[dayKey].exercises[
        exerciseIndex
      ].arrSetRIR = [...rirs];

      await AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines));
      setApi(updatedRoutines[routineIndex].days[dayKey]);
    } catch (error: any) {
      // Alert.alert("Error", error.message);
    } finally {
      setIsSaving(false);
    }
  };


  const handleWeightChange = (index: number, value: string) => {
    const newWeights = [...weights];
    newWeights[index] = parseFloat(value) || 0;
    setWeights(newWeights);
  };
  const handleRepetitionChange = (index: number, value: string) => {
    const newRepetitions = [...repetitions];
    newRepetitions[index] = parseFloat(value) || 0;
    setRepetitions(newRepetitions);
  };

  const handlerirChange = (index: number, value: string) => {
    const newRir = [...rirs];
    newRir[index] = parseFloat(value) || 0;
    setRirs(newRir);
  };

  const addSeries = () => {
    setRirs((prev: []) => {
      if (prev.length >= 5) return prev;
      return [...prev, prev[prev.length - 1]];
    });

    setRepetitions((prev: []) => {
      if (prev.length >= 5) return prev;
      return [...prev, prev[prev.length - 1]];
    });

    setWeights((prev: []) => {
      if (prev.length >= 5) return prev;
      return [...prev, prev[prev.length - 1]];
    });
  };

  const outSeries = () => {
    setRirs((prev: []) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });

    setRepetitions((prev: []) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });

    setWeights((prev: []) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  };

  const handleExerciseChange = async (direction: "next" | "prev") => {
    if (!api?.exercises) return;
    await saveChanges();
  
    const currentIndex = api.exercises.findIndex((e: any) => e.id === main?.id);
    if (currentIndex === -1) return;
  
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % api.exercises.length
        : (currentIndex - 1 + api.exercises.length) % api.exercises.length;
  
    const newExercise = api.exercises[newIndex];
  
    // Actualizar todo el estado de una vez
    setMain(newExercise);
    setWeights(newExercise.arrSetWeight || []);
    setRepetitions(newExercise.arrSetRepetition || []);
    setRirs(newExercise.arrSetRIR || []);
    setIdExeList(newExercise.idExeList || []);
    
    // Buscar y actualizar exeObjet inmediatamente
    const newExeObjet = findExerciseById(dataExecises, newExercise.idExeList);
    setExeObjet(newExeObjet || null);
  };

  const handleGoBack = async () => {
    try {
      await saveChanges();
      router.push({
        pathname: "/ViewExercises",
        params: {
          dayID: dayID || "",
          dayName: dayName || "",
          routineID: routineID || "",
          routineName: routineName || "",
        },
      });
      handleToggleInfo();
    } catch (error) {
      console.error("Error al guardar o navegar:", error);
      // Alert.alert("Error", "No se pudo guardar los cambios");
    }
  };

  if (!main) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }
  
  (exeObjet?.es?.lead || main?.lead) ? '' : handleToggleInfo();


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { flex: 1 }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
    >
      {/* <Text style={styles.title}>{main.name.toUpperCase()}</Text> */}
      <Text style={styles.title}> </Text>
      <Text
        style={{
          ...styles.title,
          ...{ position: "absolute", width: "110%", marginTop: 40 },
        }}
      >
        {main.name.toUpperCase()}
      </Text>

      <View style={styles.contentContainer}>
        <View style={styles.exerciseCounter}>
          <Text style={styles.counterText}>
            {api.exercises.findIndex((e: any) => e.id === main?.id) + 1} /{" "}
            {api.exercises.length}
          </Text>
        </View>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            onPress={() => handleExerciseChange("prev")}
            style={
              api.exercises.length === 1
                ? { ...styles.navButton, display: "none" }
                : { ...styles.navButton, display: "flex" }
            }
            disabled={isSaving}
          >
            <Icon name="chevron-left" size={24} color="#A1D70F" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.imagePlaceholder,
              api.exercises.length === 1 && { marginHorizontal: "18%" },
            ]}
          >
            {exeObjet !== null ? (
              <Image
                source={getImageSource(
                  exeObjet?.imgPath as keyof typeof images_obj
                )}
                contentFit="cover"
                style={{
                  width: 200,
                  height: 200,
                  top: -10,
                  marginHorizontal: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            ) : (
              <>
                <Icon name="add-a-photo" size={24} color="#aaaaaa" />

                <Text style={{ color: "#aaa", marginTop: 10 }}>
                  agregar imagen
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleExerciseChange("next")}
            style={
              api.exercises.length === 1
                ? { ...styles.navButton, display: "none" }
                : { ...styles.navButton, display: "flex" }
            }
            disabled={isSaving}
          >
            <Icon name="chevron-right" size={24} color="#A1D70F" />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Pesos</Text>
          <View style={styles.inputContainer}>
            {weights.map((weight: any, idx: any) => (
              <View key={idx} style={styles.inputWrapper}>
                <TextInput
                  value={weight.toString()}
                  onChangeText={(text) => handleWeightChange(idx, text)}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Repes</Text>
          <View style={styles.inputContainer}>
            {repetitions.map((weight: any, idx: any) => (
              <View key={idx} style={styles.inputWrapper}>
                <TextInput
                  value={weight.toString()}
                  onChangeText={(text) => handleRepetitionChange(idx, text)}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
            ))}
          </View>

          <Text style={{ ...styles.sectionTitle }}>RIR</Text>
          <View style={styles.inputContainer}>
            {rirs.map((rir: any, idx: any) => (
              <View key={idx} style={styles.inputWrapper}>
                <TextInput
                  value={rir.toString()}
                  onChangeText={(text) => handlerirChange(idx, text)}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
            ))}
          </View>

          <View
            style={{
              backgroundColor: "#161618",
              borderStyle: "solid",
              // borderWidth: 0.5,
              borderColor: "#26262833",
              width: 40,
              height: 150,
              borderRadius: 30,
              borderWidth: 2,
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              position: "absolute",
              // left: -40, // o lo que necesites para que no se solape
              top: "50%",
              transform: [{ translateY: -50 }], // la mitad de 130 (height)
            }}
          >
            <TouchableOpacity
              style={
                rirs.length !== 5
                  ? {
                      backgroundColor: "#262628",
                      width: 40,
                      height: 40,
                      borderRadius: 30,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      opacity: 0.2,
                      backgroundColor: "#262628",
                      width: 40,
                      height: 40,
                      borderRadius: 30,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
              onPress={addSeries}
            >
              <Text>
                <Icon name="add" size={25} color="#aaa" />:
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: "#aaa",
                fontSize: 10,
                fontFamily: "Cochin",
                textAlign: "center",
                lineHeight: 10,
              }}
            >
              {"SERIES".split("").join("\n")}
            </Text>
            <TouchableOpacity
              style={
                rirs.length !== 1
                  ? {
                      backgroundColor: "#262628",
                      width: 40,
                      height: 40,
                      borderRadius: 30,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      opacity: 0.2,
                      backgroundColor: "#262628",
                      width: 40,
                      height: 40,
                      borderRadius: 30,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
              onPress={outSeries}
            >
              <Text>
                <Icon name="horizontal-rule" size={25} color="#aaa" />:
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* {(exeObjet !== null) && showInfo && ( */}
      {showInfo && (
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            backgroundColor: "#262628",
            padding: 20,
            width: "110%",
            height: "62%",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: "absolute",
            bottom: 0,
          }}
        >
          <ScrView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                ...styles.sectionTitle,
                fontSize: 15,
                textAlign: "justify",
                textTransform: "uppercase",
                fontWeight: "bold",
                marginBottom: -10,
              }}
            >
              {(exeObjet?.es?.lead || main?.lead)? "Músculos en trabajo" : ""}
            </Text>
            <Text
              style={{
                ...styles.sectionTitle,
                fontSize: 15,
                textAlign: "justify",
                lineHeight: 22,
              }}
            >
              {exeObjet?.es?.lead}{main?.lead}
            </Text>
            <Text
              style={{
                ...styles.sectionTitle,
                fontSize: 15,
                textAlign: "justify",
                textTransform: "uppercase",
                fontWeight: "bold",
                marginBottom: -10,
                marginTop: 25,
              }}
            >
              {(exeObjet?.es?.firstPosition[0] || main?.firstPosition) ? "Paso a Paso" : ""}
            </Text>
            <Text
              style={{
                ...styles.sectionTitle,
                fontSize: 15,
                textAlign: "justify",
                lineHeight: 22,
              }}
            > 
              {main?.firstPosition}
              {exeObjet?.es?.firstPosition[0]}
              {"\n"}
              {exeObjet?.es?.firstPosition[1]}
            </Text>
          </ScrView>
        </Animated.View>
      )}

      <BackDelateButton
        onPressBack={handleGoBack}
        styleContainer={
          isKeyboardVisible
            ? { display: "none", backgroundColor: "transparent" }
            : { display: "flex", backgroundColor: "transparent" }
        }
        buttonInfo={(exeObjet?.es?.lead || main?.lead) ? true : false}
        onPressButtonInfo={handleToggleInfo}
        buttonInfoUpDownArrow={showInfo}
      />
    </KeyboardAvoidingView>
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
  contentContainer: {
    flex: 1,
  },
  exerciseCounter: {
    alignSelf: "flex-end",
    backgroundColor: "#28282A",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  counterText: {
    color: "#aaa",
    fontSize: 14,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  navButton: {
    backgroundColor: "#28282A",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: {
    flex: 2,
    height: 200,
    backgroundColor: "#161618",
    borderStyle: "dashed",
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#28282A",
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#aaaaaa",
    marginTop: 10,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 15,
    marginBottom: 0,
    marginTop: 13,
    textAlign: "center",
    fontFamily: "Cochin",
    fontWeight: "300",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 10,
  },
  inputWrapper: {
    backgroundColor: "#161618",
    width: 50,
    margin: 4,
    marginHorizontal: 3,
    height: 35,
    borderColor: "#28282A",
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    color: "#aaa",
    textAlign: "center",
    width: "100%",
    padding: 5,
  },
});

export default RoutineOneExerciseScreen;
