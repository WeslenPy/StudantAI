import { View } from "react-native";
import { StatusBar } from "react-native";

import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
  } from 'react-native-safe-area-context';
  
const status_bar = StatusBar.currentHeight

export default function StatusMarging({children}:{children:React.ReactNode}){

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1,paddingTop:status_bar+10}} >
                {children}
                <StatusBar barStyle="dark-content" translucent={true} />
            </View>
        </SafeAreaView>
    )
}