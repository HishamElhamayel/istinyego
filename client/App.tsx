import Navigator from "app/navigator";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
    return (
        <>
            <StatusBar style="auto" />
            <SafeAreaProvider style={styles.container}>
                <Navigator />
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
