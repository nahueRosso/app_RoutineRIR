import { TouchableOpacity, View, Text } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

export const BackDelateButton = ({
  onPressBack,
  onPressDelate = "undefined",
  delate = false,
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
        paddingHorizontal: 40,
      }}
    >
      <TouchableOpacity
        onPress={onPressBack}
        style={{
          backgroundColor: "#BCFD0E",
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon name="arrow-back" size={20} color="#161618" />
      </TouchableOpacity>

      {delate ? (
        <TouchableOpacity
          onPress={onPressDelate}
          style={{
            backgroundColor: "#C70000",
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="delete" size={20} color="#161618" />
        </TouchableOpacity>
      ) : (
        <>''</>
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
}: {
  onPress: any;
  text: string;
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
