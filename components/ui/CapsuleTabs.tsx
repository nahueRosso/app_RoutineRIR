import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
  } from "react-native";
  import Icon from "react-native-vector-icons/MaterialIcons";
  
  interface CustomCheckboxProps {
    label: string;
    checked: boolean;
    onPress: () => void;
    disabled?: boolean;
  }
  
  export const CustomCheckbox = ({ 
    label, 
    checked, 
    onPress, 
    disabled = false 
  }: CustomCheckboxProps) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.container,
        disabled && styles.disabledContainer
      ]}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {/* <View style={[
        styles.checkbox,
        checked && styles.checkedBox
      ]}>
        {checked && <Icon name="check" size={15} color="#BCFD0E" />}
      </View> */}
      <Text style={[
        styles.label,
        disabled && styles.disabledLabel,
        checked && styles.checkedText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#28282A',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20,
        // minWidth: 100,         // Cambiado de width fijo a minWidth
        // margin:4,
        marginVertical:3,
        marginHorizontal: 5,
    },
    disabledContainer: {
      opacity: 0.5
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: '#aaa',
      borderRadius: 4,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkedBox: {
      borderColor: '#BCFD0E'
    },
    label: {
        color: '#aaa',
        fontFamily: 'Cochin',
        fontWeight: '300',
    },
    disabledLabel: {
        color: '#666'
    },
    checkedText: {
      color: '#BCFD0E'
    },
  });