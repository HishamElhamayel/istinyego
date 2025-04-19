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
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.content}>{children}</Text>
        </View>
    );
};

export default info;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        color: "white",
        marginVertical: 2,
    },
    content: {
        fontSize: 16,
        color: "white",
        marginVertical: 2,
    },
});
