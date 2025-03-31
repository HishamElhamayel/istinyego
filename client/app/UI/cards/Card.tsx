import colors from "@utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    children?: React.ReactNode;
    style?: object;
    title?: string;
}

const Card: FC<Props> = ({ children, style, title }) => {
    return (
        <View style={styles.root}>
            {title && <Text style={styles.title}>{title}</Text>}
            <View style={styles.container}>
                <LinearGradient
                    colors={[colors.primary100, colors.primary50]}
                    style={[styles.innerContainer, style]}
                >
                    {children}
                </LinearGradient>
            </View>
        </View>
    );
};

export default Card;

const styles = StyleSheet.create({
    root: {
        gap: 10,
        marginVertical: 10,
    },
    title: {
        fontSize: 24,
    },
    container: {
        elevation: 15,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        borderRadius: 15,
    },
    innerContainer: {
        borderRadius: 15,
        paddingVertical: 25,
        paddingHorizontal: 15,
    },
});
