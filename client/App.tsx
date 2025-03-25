import Navigator from "app/navigator";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import FlashMessage from "react-native-flash-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
    return (
        <>
            <StatusBar style="auto" />
            <SafeAreaProvider style={styles.container}>
                <Navigator />
            </SafeAreaProvider>
            <FlashMessage
                position="top"
                statusBarHeight={Constants.statusBarHeight}
            />
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
