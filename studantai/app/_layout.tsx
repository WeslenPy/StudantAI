import { Stack } from 'expo-router/stack';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import "../global.css";

export default function Layout() {

  const config ={
    headerShown: false,
  }

 
  return ( 
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={config} />
        <Stack.Screen name="quiz" options={config} />
        <Stack.Screen name="finish" options={config} />
      </Stack>
    </SafeAreaProvider>
  );
}