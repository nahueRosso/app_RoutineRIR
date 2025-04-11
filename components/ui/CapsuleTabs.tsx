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
      style={[{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#28282A',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20,
        marginVertical:3,
        marginHorizontal: 5,
    },
        disabled && {
          opacity: 0.5
        }
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
      <Text style={[{
        color: '#aaa',
        fontFamily: 'Cochin',
        fontWeight: '300',
    },
        disabled && {
          color: '#666'
      },
        checked && {
          color: '#BCFD0E'
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  export const CustomCheckboxSmall = ({ 
    label, 
    checked, 
    onPress, 
    disabled = false 
  }: CustomCheckboxProps) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={[{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#28282A',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 20,
        marginVertical:3,
        marginHorizontal: 5,
    },
        disabled && {
          opacity: 0.5
        }
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
      <Text style={[{
        color: '#aaa',
        fontFamily: 'Cochin',
        textTransform:'capitalize',
        fontWeight: '300',
    },
        disabled && {
          color: '#666'
      },
        checked && {
          color: '#BCFD0E'
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  const styles = StyleSheet.create({
    
    // checkbox: {
    //   width: 20,
    //   height: 20,
    //   borderWidth: 1,
    //   borderColor: '#aaa',
    //   borderRadius: 4,
    //   marginRight: 10,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // },
    // checkedBox: {
    //   borderColor: '#BCFD0E'
    // },
    // label: {
    //     color: '#aaa',
    //     fontFamily: 'Cochin',
    //     fontWeight: '300',
    // },
    // disabledLabel: {
    //     color: '#666'
    // },
    // checkedText: {
    //   color: '#BCFD0E'
    // },
  });