import { View } from "react-native";
import { StatusBar } from "react-native";


const status_bar = StatusBar.currentHeight

export default function StatusMarging({children}:{children:React.ReactNode}){

    return (
        <View style={{flex:1,paddingTop:status_bar+10}} >
            {children}
            <StatusBar barStyle="dark-content" translucent={true} />
        </View>
    )
}