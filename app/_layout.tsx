import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';
import AsyncStorage from "@react-native-async-storage/async-storage";
import db from "../db.json"; // asegurate de que el path esté correcto

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, error] = useFonts({
    'Satisfy-Regular': require('../assets/fonts/Satisfy-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // 👇 Hook que carga rutinas solo la primera vez (debe ir antes del return)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const isFirstLaunch = await AsyncStorage.getItem("isFirstLaunch");

        if (isFirstLaunch === null) {
          if (db && db.length > 0) {
            await AsyncStorage.setItem("routines", JSON.stringify(db));
            console.log("✅ RUTINAS DE EJEMPLO GUARDADAS");
          }
          await AsyncStorage.setItem("isFirstLaunch", "false");
        }
      } catch (error) {
        console.error("❌ Error en la carga inicial:", error);
      }
    };

    loadInitialData();
  }, []);

  // 👇 Hook para ocultar la splash screen una vez que las fuentes cargan
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // 👇 Esto debe ir DESPUÉS de todos los hooks
  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </>
  );
}
