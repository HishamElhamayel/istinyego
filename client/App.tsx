import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPassword from "@views/forgotPassword";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Login from "./app/views/Login";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <>
            <StatusBar style="auto" />
            <SafeAreaProvider style={styles.container}>
                <ForgotPassword />
                {/* <Login /> */}
            </SafeAreaProvider>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        // justifyContent: "center",
    },
});
