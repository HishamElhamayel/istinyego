import { FC } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Wallet: FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Wallet Page</Text>
        </SafeAreaView>
    );
};

export default Wallet;

const styles = StyleSheet.create({
    container: { flex: 1 },
    logoContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 180,
        height: 180,
        elevation: 2,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
    },
    formContainer: {
        flex: 3,
    },
});
