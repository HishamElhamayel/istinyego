import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    children?: React.ReactNode;
};

const Header = ({ children }: Props) => {
    return <Text style={styles.header}>{children}</Text>;
};

export default Header;

const styles = StyleSheet.create({
    header: {
        fontSize: 64,
        // fontWeight: "bold",
        color: "#000",
        marginBottom: 20,
    },
});
