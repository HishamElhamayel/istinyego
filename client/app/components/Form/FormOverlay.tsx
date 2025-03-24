import colors from "@utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

interface props {
    children?: any;
}

const FormOverlay: FC<props> = ({ children }) => {
    return (
        <LinearGradient
            colors={[colors.primary100, colors.primary50]}
            style={styles.formContainer}
        >
            {children}
        </LinearGradient>
    );
};

export default FormOverlay;

const styles = StyleSheet.create({
    formContainer: {
        flex: 4,
        height: "100%",
        borderTopRightRadius: 60,
        borderTopLeftRadius: 60,
        // alignItems: "center",
        paddingTop: 45,
        paddingHorizontal: 25,
        width: "100%",
    },
});
