
import { X } from "lucide-react-native";
import { TouchableOpacity, View,Image,Text } from "react-native";
import * as DocumentPicker from 'expo-document-picker';

export function PreviewDocument({file,popItem}:{file:DocumentPicker.DocumentPickerAsset,
                                                popItem:(item:DocumentPicker.DocumentPickerAsset)=>void}){


    return (
            
    <View key={file.uri.toString()} className="relative max-w-32 min-h-32 mb-4 mx-1">
        <TouchableOpacity className="absolute top-0 z-10 right-0 bg-gray-400/80 rounded-full m-1" onPress={()=>popItem(file)}>
            <X color={"white"} size={17} ></X>
        </TouchableOpacity>
        {file.mimeType.includes("image") ? (
            <Image source={{ uri: file.uri }} className="min-w-32 h-32 rounded-lg" />
        ) : (
            <View className="items-end justify-end min-w-32 h-32  bg-black rounded-lg p-2">
                <Text className="   text-white " >{file.name}</Text>
            </View>
        )}
    </View>
)

}