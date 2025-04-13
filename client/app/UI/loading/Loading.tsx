import colors from "@utils/colors";
import React, { FC } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

type Props = { visible: boolean };

const Loading: FC<Props> = ({ visible }) => {
    if (!visible) return null;

    return (
        <ActivityIndicator
            size="large"
            color={colors.primary100}
            style={styles.loading}
        />
    );
};

const styles = StyleSheet.create({
    loading: {
        marginTop: 200,
    },
});

export default Loading;
