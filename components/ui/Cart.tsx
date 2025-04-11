import { TouchableOpacity, View, Text } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { daysOptions } from "@/constants/Days";
import { Image } from 'expo-image';

export const CartExe = ({ id,onPress,source,text,style }: { id?:any,onPress: any,source:any,text:String,style?:object }) => {
  return (
    <TouchableOpacity style={{
        width:140,
        height:130,
        backgroundColor: "#28282A",
        // borderStyle: "dashed",
        borderRadius: 25,
        borderWidth: 3,
        borderColor: "#28282A",
        
        overflow: "hidden",
        ...style
    }}
    id={id} 
    onPress={onPress}
    >
        <Image 
  source={source}
  contentFit="cover"
  style={{
      position:'absolute',
      top:-10,
    //   backgroundColor:'red',
      marginHorizontal:5,
      width: 120,
      height: 120,
    }}
/>
    <Text style={{
        width:130,
        position:'absolute',
        bottom:0,
        textAlign:'center',
        textTransform:'capitalize',
        fontFamily:'Cochin',
        color:'#fff',
        marginHorizontal:3,
        marginBottom:2,
        zIndex:10000
    }}>{text.length>15?text.slice(0,15)+'...':text}</Text>
    </TouchableOpacity>
  );
};


