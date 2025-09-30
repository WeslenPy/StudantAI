import React, { useRef, useState } from "react";
import { Text, TextInput, View,KeyboardAvoidingView,Platform,TouchableOpacity,FlatList  } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {  Paperclip, Send } from "lucide-react-native";

import StatusMarging from "../components/statusBar";
import { PreviewDocument } from "../components/previewDoc";
import * as DocumentPicker from 'expo-document-picker';
import GeminiClient from "ia/gemini/api";
import BrainLoading from "../components/brain";
import { router } from 'expo-router';

export default function Home(){

    const [files,setFiles] = useState<Array<DocumentPicker.DocumentPickerAsset>>([])
    const [prompt,setPrompt] = useState<string>("")
    const [loading,setLoading] = useState<boolean>(false)
    const controllerRef = useRef<AbortController | null>(null);
    
    const api = new GeminiClient()

    async function onGenerate(){
        try{
            setLoading(true)

            if(!(files || files.length<=0 || !prompt)){
                return 
            }

            controllerRef.current = new AbortController();

            let response = await api.sendDocumentWithText(files,prompt,{
                signal: controllerRef.current.signal, 
              })
            const data = JSON.parse(response.text.replace(/^```json\n/, "").replace(/```$/, ""))
            
            return router.push({
                pathname:"/quiz",
                params:{
                    data:JSON.stringify(data)
                }
            })


        }
        catch (err: any) {
            if (err.name === "AbortError") {
              console.log("🚫 Requisição cancelada pelo usuário");
            } else {
              console.error("Erro:", err);
            }
        } 
        finally{
            setLoading(false)
    
          
        }

    }

    const removeItem = (file: DocumentPicker.DocumentPickerAsset) => {
        setFiles((prevItems) => prevItems.filter((item) => item.uri !== file.uri));
      };

    
    async function onPickDocument(){

        const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });

        result.assets.forEach((file)=>{
            if (!file) return;
            setFiles(prevFiles => Array.isArray(file) ? [...prevFiles, ...file] : [...prevFiles, file]);
        })
       
    }

    if (loading){
        return (
            <BrainLoading onClose={()=>controllerRef.current?.abort()}></BrainLoading>
        )
    }

    return (
        <KeyboardAvoidingView
            style={{flex:1,paddingBottom:0,marginBottom:0}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >  
            <StatusMarging>
                <View className="flex-1 overflow-hidden bg-dark">
                    <Text className="text-black text-base font-medium px-4 mt-3">
                    StudantAI
                    </Text>

                    <View className="flex-1 items-center justify-center">
                    <Text className="text-center text-black">
                        Gere questões e teste seus conhecimentos!
                    </Text>
                    </View>

                    <LinearGradient
                        colors={["transparent", "#003366"]}
                        className="w-full p-4"
                        >
                        <View className="flex-row items-center bg-white/20 rounded-lg px-3">
                            <View className="flex-col flex-1">
                                <View className="flex">
                                    <FlatList ListEmptyComponent={!files&&<></>} onEndReachedThreshold={0.1} 
                                    keyExtractor={(item,key)=>{return key.toString()}} 
                                    data={files} scrollEventThrottle={16} horizontal={true} style={{gap:16}}
                                    renderItem={({item})=>(<PreviewDocument file={item} popItem={removeItem}></PreviewDocument>)}/>
                                </View>
                                <View className="flex-row items-center">
                                    <TouchableOpacity onPress={onPickDocument}>
                                        <Paperclip size={20} color="white" />
                                    </TouchableOpacity>
                                    <TextInput
                                        placeholder="Digite aqui..."
                                        placeholderTextColor="#ccc"
                                        className="flex-1 px-2 text-white"
                                        onChangeText={setPrompt}
                                        // autoFocus={true}
                                        value={prompt}
                                        />
                                    <TouchableOpacity onPress={onGenerate}>
                                        <Send size={20} color="white" />
                                    </TouchableOpacity> 
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            </StatusMarging>
        </KeyboardAvoidingView>
        
    )
}