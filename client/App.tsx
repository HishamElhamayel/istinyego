import Navigator from "app/navigator";
import store from "app/store";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

export default function App() {
    useEffect(() => {
        async function askForLocationPermission() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                showMessage({
                    message:
                        "For better experience, please allow location permission",
                    type: "warning",
                });
                return;
            }

            //   let location = await Location.getCurrentPositionAsync({});
        }

        askForLocationPermission();
    }, []);
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
