import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import { FC } from "react";
import { StyleSheet } from "react-native";
import AuthNavigator from "./AuthNavigator";

const myTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "white",
    },
};

interface Props {}

const Navigator: FC<Props> = () => {
    return (
        <NavigationContainer theme={myTheme}>
            <AuthNavigator />
        </NavigationContainer>
    );
};

export default Navigator;

const styles = StyleSheet.create({});
