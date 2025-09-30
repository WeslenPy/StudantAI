import { Stack } from 'expo-router/stack';
import "../global.css";

export default function Layout() {

  const config ={
    headerShown: false,
    statusBarTranslucent:true 
  }

 
  return ( 
    <Stack>
      <Stack.Screen name="home" options={config} />
      <Stack.Screen name="quiz" options={config} />
      <Stack.Screen name="finish" options={config} />
    </Stack>


  );
}