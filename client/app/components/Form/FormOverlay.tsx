import colors from "@utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { StyleSheet } from "react-native";

interface props {
    children?: React.ReactNode;
    style?: object;
}

const FormOverlay: FC<props> = ({ children, style }) => {
    return (
        <LinearGradient
            colors={[colors.primary100, colors.primary50]}
            style={[styles.formContainer, style]}
        >
            {children}
        </LinearGradient>
    );
};

export default FormOverlay;

const styles = StyleSheet.create({
    formContainer: {
        borderTopRightRadius: 60,
        borderTopLeftRadius: 60,
        // alignItems: "center",
        paddingTop: 45,
        paddingHorizontal: 25,
        width: "100%",
    },
});
