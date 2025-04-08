import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    title: string;
    children: React.ReactNode;
    style?: object;
};

const info = ({ title, children, style }: Props) => {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.text}>{children}</Text>
        </View>
    );
};

export default info;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        color: "white",
        marginVertical: 2,
    },
});
