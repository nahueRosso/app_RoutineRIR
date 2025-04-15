import { TouchableOpacity, View, Text } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { daysOptions } from "@/constants/Days";

export const BackDelateButton = ({
  onPressBack,
  onPressDelate = undefined,
  onPressAdd = undefined,
  addSmall = false,
  delate = false,
  styleContainer = Object,
  buttonInfo = false,
  onPressButtonInfo=undefined,
  buttonInfoUpDownArrow=false,
}: any) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: "16%",
        paddingBottom: 20,
        paddingTop: 20,
        backgroundColor: "#161618",
        ...styleContainer,
      }}
    >
      <TouchableOpacity
        onPress={onPressBack}
        style={{
          backgroundColor: "#BCFD0E",
          width: 50,
          height: 50,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          zIndex:10000000,
        }}
      >
        <Icon name="arrow-back" size={25} color="#161618" />
      </TouchableOpacity>

      {addSmall ? (
        <TouchableOpacity
          onPress={onPressAdd}
          style={{
            backgroundColor: "#BCFD0E",
            width: 50,
            height: 50,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="add" size={25} color="#28282A" />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      {delate ? (
        <TouchableOpacity
          onPress={onPressDelate}
          style={{
            backgroundColor: "#C70000",
            width: 50,
            height: 50,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="delete" size={25} color="#161618" />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      {buttonInfo ? (
        <TouchableOpacity
          onPress={onPressButtonInfo}
          style={{
            backgroundColor: "#262628",
            borderStyle: "solid",
            borderWidth: .5,
            borderColor: "#BCFD0E",
            width: 120,
            height: 50,
            borderRadius: 30,
            flexDirection:'row',
            justifyContent: "flex-start",
            alignItems: "center",
            zIndex:1000
          }}
        >
          <Text style={{width:75,color:"#fff",fontSize:16,fontFamily:'Cochin',textAlign:'center',textTransform:"uppercase"}}>Info</Text>
          <View style={{
            backgroundColor: "#BCFD0E",
            width: 50,
            height: 50,
            borderRadius: 30,
            position:'absolute',
            right:0,
            top:0,
            justifyContent: "center",
            alignItems: "center",
          }}>
            {buttonInfoUpDownArrow?
            <Icon name="arrow-downward" size={25} color="#161618" />:
            <Icon name="arrow-upward" size={25} color="#161618" />}
          
          </View>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

const splitText = (str: string) => {
  const words = str.toUpperCase().split(" ");

  if (words.length <= 1) {
    return { topPart: str, bottomPart: "" };
  }

  // Ajuste para que, si es impar, la parte superior tenga más palabras
  const middleIndex = Math.ceil(words.length / 2); // Usamos Math.ceil en lugar de Math.floor

  return {
    topPart: words.slice(0, middleIndex).join(" "),
    bottomPart: words.slice(middleIndex).join(" "),
  };
};

export const AddButtonBig = ({
  onPress,
  text,
  styleContainer,
}: {
  onPress: any;
  text: string;
  styleContainer?: object;
}) => {
  const text_div = splitText(text);
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#28282A",
        marginTop: 0,
        width: "80%",
        height: 100,
        maxWidth: 300,
        borderRadius: 10,
        alignSelf: "center",
        overflow: "hidden",
        position: "relative",
        ...styleContainer,
      }}
      onPress={onPress}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 100,
          width: "70%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontFamily: "Cochin",
            textAlign: "center",
            fontWeight: "300",
            lineHeight: 30,
          }}
        >
          {`${text_div.topPart}\n${text_div.bottomPart}`}
          {/* CREATE NEW{"\n"}ROUTINE */}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 100,
          height: "100%",
          width: "30%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon name="add" size={40} color="#28282A" />
      </View>
      <View
        style={{
          position: "absolute",
          width: 150,
          height: 120,
          right: -60,
          bottom: 0,
          borderRadius: 10,
          backgroundColor: "#BCFD0E",
          transform: [{ rotate: "30deg" }],
        }}
      />
    </TouchableOpacity>
  );
};

export const AddButtonSmall = ({ onPress }: { onPress: any }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#BCFD0E",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon name="add" size={20} color="#28282A" />
    </TouchableOpacity>
  );
};

export const ButtonCustom = ({
  onPress,
  textFirst,
  textSecond,
  styleContainer,
  styleText,
  styleBox,
  disabled,
  delate=false,
}: {
  onPress: any;
  textFirst: string;
  textSecond?: string | any;
  styleContainer?: Object;
  styleText?: Object;
  styleBox?: Object;
  disabled?: any;
  delate?: any;
}) => {

  return (
    <TouchableOpacity
      key={daysOptions.find((e: any) => e.label == textSecond)?.key}
      onPress={onPress}
      style={{
        backgroundColor: "#28282Aff",
        margin: 10,
        width: "80%",
        maxWidth: 300,
        borderRadius: 10,
        alignSelf: "center",
        overflow: "hidden",
        position: "relative",
        padding: 15,
        ...styleContainer,
      }}
      disabled={disabled}
    >
      <Text
        style={{
          color: "white",
          fontSize: 17,
          fontFamily: "Cochin",
          textAlign: "center",
          fontWeight: "300",
          textTransform: "capitalize",
          ...styleText,
        }}
      >
        {textFirst.length>19 ?`${textFirst.slice(0,19)}...`:textFirst.slice(0,19)}
      </Text>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: "30%",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        {typeof textSecond === 'string'?<Text
          style={{
            color: "black",
            fontSize: 18,
            right:-15,
            top:15,
            fontFamily:'Satisfy-Regular',
            textTransform:'capitalize',
            zIndex: 2000000000,
          }}
        >
          {` ${textSecond?.slice(0, 3)}`}
        </Text>:(typeof textSecond === 'undefined')?<></>:textSecond}
      </View>

      <View
        style={{
          position: "absolute",
          width: 100,
          height: 100,
          right: -60,
          bottom: -20,
          borderRadius: 10,
          backgroundColor: "#BCFD0Eff",
          transform: [{ rotate: "25deg" }],
          ...styleBox,
        }}
      />
    </TouchableOpacity>
  );
};


export const ButtonExample = ({ textFirst }: { textFirst: string }) => {
  return (
    <TouchableOpacity
      key={14}
      style={{
        backgroundColor: "#161618",
        borderStyle: "dashed",
        borderWidth: 3,
        borderColor: "#28282A",
        margin: 10,
        width: "80%",
        maxWidth: 300,
        borderRadius: 10,
        marginBottom: 20,
        alignSelf: "center",
        overflow: "hidden",
        position: "relative",
        padding: 15,
      }}
    >
      <Text
        style={{
          color: "#48484A",
          fontSize: 17,
          fontFamily: "Cochin",
          textAlign: "center",
          fontWeight: "300",
          textTransform: "capitalize",
        }}
      >
        {textFirst}
      </Text>
      <View
        style={{
          backgroundColor: "#28282A",
          borderStyle: "dashed",
          borderWidth: 3,
          borderColor: "#161618",
          position: "absolute",
          width: 100,
          height: 100,
          right: -60,
          bottom: -20,
          borderRadius: 10,
          transform: [{ rotate: "25deg" }],
        }}
      />
    </TouchableOpacity>
  );
};
