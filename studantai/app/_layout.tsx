import { Stack } from 'expo-router/stack';
import {useEffect} from "react";
// import "../global.css";

export default function Layout() {

  const config ={
    headerShown: false,
    statusBarTranslucent:true 
  }

 
  return ( 

      <Stack>
          <Stack.Screen name="home/index" options={config} />
      </Stack>
      

  );
}