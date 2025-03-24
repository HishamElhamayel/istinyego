import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Login from "./app/views/Login";

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaProvider style={styles.container}>
        <Login />
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
  },
});
