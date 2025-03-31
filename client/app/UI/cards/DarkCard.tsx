import colors from "@utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    children?: React.ReactNode;
    style?: object;
    title?: string;
}

const DarkCard: FC<Props> = ({ children }) => {
    return (
        <View style={styles.root}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[colors.black, colors.grey]}
                style={[styles.innerContainer]}
            >
                {children}
            </LinearGradient>
        </View>
    );
};

export default DarkCard;

const styles = StyleSheet.create({
    root: {
        elevation: 15,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        gap: 10,
    },
    title: {
        fontSize: 24,
    },
    innerContainer: {
        borderRadius: 15,
        paddingVertical: 25,
        paddingHorizontal: 15,
    },
});
