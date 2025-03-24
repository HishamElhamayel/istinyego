import Button from "@components/UI/Button";
import FormInput from "@components/UI/FormInput";
import FormOverlay from "@components/UI/FormOverlay";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const [emailInput, setEmailInput] = React.useState("");
  const [passwordInput, setPasswordInput] = React.useState("");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/icon.png")}
          resizeMode="contain"
          resizeMethod="resize"
        />
      </View>
      <FormOverlay>
        <Text style={styles.header}>Login</Text>
        <FormInput
          label="Email"
          onChangeHandler={(value) => setEmailInput(value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormInput
          label="Password"
          onChangeHandler={(value) => setPasswordInput(value)}
          secureTextEntry
        />
        <Button onPress={() => console.log(emailInput)}>Login</Button>
      </FormOverlay>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {},
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  header: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
  },
});
