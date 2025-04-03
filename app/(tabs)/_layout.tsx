import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: { display: "none" },
      }}>
      {/* <Tabs.Screen name='ViewOneExercise'  options={{ title: 'ViewOneExercise' }}/>
      <Tabs.Screen name='ViewExercises' options={{ title: 'ViewExercises' }}/>
      <Tabs.Screen name='ViewDay' options={{ title: 'ViewDay' }}/>
      <Tabs.Screen name='View' options={{ title: 'View' }}/> */}
      <Tabs.Screen name='index' options={{ title: 'home' }}/>
      {/* <Tabs.Screen name='DelateRoutineExercises' options={{ title: 'DelateRoutineExercises' }}/>
      <Tabs.Screen name='DelateRoutine' options={{ title: 'DelateRoutine' }}/>
      <Tabs.Screen name='DelateRoutineDay' options={{ title: 'DelateRoutineDay' }}/>
      <Tabs.Screen name='CreateRoutine' options={{ title: 'CreateRoutine' }}/>
      <Tabs.Screen name='CreateExercises' options={{ title: 'CreateExercises' }}/>
      <Tabs.Screen name='CreateDaysRoutines' options={{ title: 'CreateDaysRoutines' }}/> */}
    </Tabs>
  );

  
}
