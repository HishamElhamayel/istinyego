import Navigator from "app/navigator";
import store from "app/store";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";
import FlashMessage from "react-native-flash-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

export default function App() {
    return (
        <>
            <StatusBar style="auto" />
            <Provider store={store}>
                <SafeAreaProvider style={styles.container}>
                    <Navigator />
                    <FlashMessage
                        position="top"
                        statusBarHeight={Constants.statusBarHeight}
                    />
                </SafeAreaProvider>
            </Provider>
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
