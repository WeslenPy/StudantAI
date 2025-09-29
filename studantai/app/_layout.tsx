import { Stack } from 'expo-router/stack';
import {useEffect} from "react";
import "../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {

  const config ={
    headerShown: false,
    statusBarTranslucent:true 
  }

 
  return ( 
  
    <SafeAreaView>
        <Stack>
            <Stack.Screen name="home" options={config} />
        </Stack>
    </SafeAreaView>
        

  );
}