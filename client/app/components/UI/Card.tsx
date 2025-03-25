import colors from "@utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";

interface props {
    children?: React.ReactNode;
    style?: object;
}

const Card: FC<props> = ({ children, style }) => {
    return (
        <View style={styles.root}>
            <LinearGradient
                colors={[colors.primary100, colors.primary50]}
                style={[styles.container, style]}
            >
                {children}
            </LinearGradient>
        </View>
    );
};

export default Card;

const styles = StyleSheet.create({
    root: {
        elevation: 65,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        borderRadius: 15,
        margin: 0,
    },
    container: {
        borderRadius: 15,
        margin: 15,
        paddingVertical: 25,
        paddingHorizontal: 25,
    },
});
