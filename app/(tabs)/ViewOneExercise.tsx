import React, { useState, useEffect, useCallback } from "react";
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
  Platform  
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRouter,useFocusEffect,useLocalSearchParams } from 'expo-router'
import { BackDelateButton } from "@/components/ui/Buttons";

interface CreateDaysScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface Exercise {
  id: string;
  name: string;
  arrSetWeight: number[];
  arrSetRepetition:number[];
  arrSetRIR: number[];
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
  exercises: Exercise[] ;
  // Agrega otras propiedades que pueda tener tu objeto api
}


const RoutineOneExerciseScreen = () => {
  const router = useRouter();
  const { routineID, routineName,execerID ,execerName, dayID, execerNameFirst } = useLocalSearchParams();
  const [dayName,setDayName] = useState<string>('')
  // console.log('routineID: ',routineID, 'routineName: ',routineName,);
  const [api, setApi] = useState<ApiData | any>();
  // const [api, setApi] = useState<{exercises: Exercise[]}>({ exercises: [] });
  const [main, setMain] = useState<Exercise | undefined>();
  const [weights, setWeights] = useState<any>(main?.arrSetWeight || []);
  const [repetitions, setRepetitions] = useState<any>(main?.arrSetRepetition || []);
  const [rirs, setRirs] = useState<any>(main?.arrSetRIR || []);
  const [index, setIndex] = useState<any>(
    // api.exercises.findIndex((e: any) => e.id === routineID)
  );
  const [isSaving, setIsSaving] = useState(false);


  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener(
    'keyboardDidShow',
    () => {
      setKeyboardVisible(true); // Teclado visible
    }
  );
  
  const keyboardDidHideListener = Keyboard.addListener(
    'keyboardDidHide',
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
          const routine = routinesList.find((r: any) => r.name === execerNameFirst);
          if (!routine) return;
          
          const day: any = Object.values(routine.days).find((d: any) => d.id === dayID);
          if (!day) return;
          setDayName(`${day.name}`)
          
          setApi(day);
          const currentExercise = day.exercises?.find((e: any) => e.id === execerID);
          setMain(currentExercise);
          
          if (currentExercise) {
            setWeights(currentExercise.arrSetWeight || []);
            setRepetitions(currentExercise.arrSetRepetition || []);
            setRirs(currentExercise.arrSetRIR || []);
          }
        } catch (error) {
          console.error("Error loading data", error);
        }
      };
  
      loadData();
    }, [execerNameFirst, dayID, execerID]) // ✅ Dependencias correctas
  );


  // Guardar cambios en AsyncStorage
  const saveChanges = async () => {
    if (!main) return;
  
    setIsSaving(true);
    try {
      const storedData = await AsyncStorage.getItem("routines");
      if (!storedData) throw new Error("No routines found");
      
      const routinesList = JSON.parse(storedData);
      const routineIndex = routinesList.findIndex((r: any) => r.name === execerNameFirst);
      if (routineIndex === -1) throw new Error("Routine not found");
  
      const dayKey = Object.keys(routinesList[routineIndex].days).find(
        key => routinesList[routineIndex].days[key].id === dayID
      );
      
      if (!dayKey) throw new Error("Day not found");
      
      const exerciseIndex = routinesList[routineIndex].days[dayKey].exercises.findIndex(
        (e: any) => e.id === main.id
      );
      
      if (exerciseIndex === -1) throw new Error("Exercise not found");
  
      const updatedRoutines = JSON.parse(JSON.stringify(routinesList));
      updatedRoutines[routineIndex].days[dayKey].exercises[exerciseIndex].arrSetWeight = [...weights];
      updatedRoutines[routineIndex].days[dayKey].exercises[exerciseIndex].arrSetRepetition = [...repetitions]; // Añade esta línea
      updatedRoutines[routineIndex].days[dayKey].exercises[exerciseIndex].arrSetRIR = [...rirs];
      
      await AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines));
      setApi(updatedRoutines[routineIndex].days[dayKey]);
      
    } catch (error:any) {
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

  const handleExerciseChange = async (direction: 'next' | 'prev') => {
    if (!api?.exercises) return;
    
    await saveChanges();
    
    const currentIndex = api.exercises.findIndex((e: any) => e.id === main?.id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % api.exercises.length
      : (currentIndex - 1 + api.exercises.length) % api.exercises.length;
    
    const newExercise = api.exercises[newIndex];
    setMain(newExercise);
    setWeights(newExercise.arrSetWeight || []);
    setRepetitions(newExercise.arrSetRepetition || []);
    setRirs(newExercise.arrSetRIR || []);
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
    } catch (error) {
      console.error("Error al guardar o navegar:", error);
      // Alert.alert("Error", "No se pudo guardar los cambios");
    }
  };

  if (!main) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  return (
    <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={[styles.container, {flex: 1}]} 
  keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} 
>
      {/* <Text style={styles.title}>{main.name.toUpperCase()}</Text> */}
      <Text style={styles.title}>{' '}</Text>
      <Text style={{...styles.title,...{position:'absolute',width:'110%',marginTop:40}}}>{main.name.toUpperCase()}</Text>

      <View style={styles.contentContainer}>
        <View style={styles.exerciseCounter}>
          <Text style={styles.counterText}>
            {api.exercises.findIndex((e: any) => e.id === main?.id) + 1} /{" "}
            {api.exercises.length}
          </Text>
        </View>

        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            onPress={()=>handleExerciseChange('next')}
            style={
              api.exercises.length === 1 
                ? {...styles.navButton, display: 'none'} 
                : {...styles.navButton, display: 'flex'}
            }
            disabled={isSaving}
          >
            <Icon name="chevron-left" size={24} color="#A1D70F" />
          </TouchableOpacity>

          <TouchableOpacity style={api.exercises.length === 1 
                ? {...styles.imagePlaceholder, ...{marginHorizontal:'18%'}} 
                : {...styles.imagePlaceholder}
            }>
            <Icon name="add-a-photo" size={24} color="#aaaaaa" />
            <Text style={styles.imagePlaceholderText}>agregar imagen</Text>
            {/* <Text style={styles.imagePlaceholderText}>add image</Text> */}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleExerciseChange('prev')}
            style={
              api.exercises.length === 1 
                ? {...styles.navButton, display: 'none'} 
                : {...styles.navButton, display: 'flex'}
            }
            disabled={isSaving}
          >
            <Icon name="chevron-right" size={24} color="#A1D70F" />
          </TouchableOpacity>
        </View>

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

        <Text style={{...styles.sectionTitle}}>RIR</Text>
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

      </View>
      
     <BackDelateButton onPressBack={handleGoBack} styleContainer={isKeyboardVisible?{display:'none'}:{display:'flex'}}/>
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
    alignSelf: 'flex-end',
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
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: "#aaaaaa",
    marginTop: 10,
  },
  sectionTitle: {
    color: "white",
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
    backgroundColor: '#161618',
    width: 60,
    margin: 5,
    borderColor: '#28282A',
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: "#aaa",
    textAlign: "center",
    width: '100%',
    padding: 5,
  }
});

export default RoutineOneExerciseScreen;