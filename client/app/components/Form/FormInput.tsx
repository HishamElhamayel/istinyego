import React, { FC } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface props extends TextInputProps {
  label: string;
  onChangeHandler: (value: string) => void;
}
const FormInput: FC<props> = (props) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        onChangeText={(value) => props.onChangeHandler(value)}
        style={[
          styles.input,
          isFocused ? styles.borderActive : styles.borderDeActive,
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  label: {
    color: "white",
    marginBottom: 5,
  },
  input: {
    color: "white",
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
  },
  borderActive: {
    borderColor: "#FFFFFF",
    borderWidth: 1,
  },
  borderDeActive: {
    borderColor: "#CCCCCC",
    borderWidth: 1,
  },
});
