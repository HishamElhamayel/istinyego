import Ionicons from "@expo/vector-icons/Ionicons";
import BlueButton from "@UI/buttons/BlueButton";
import DarkCard from "@UI/cards/DarkCard";
import TransactionCard from "@UI/cards/TransactionCard";
import RoutLocations from "@UI/RoutLocations";
import client from "app/API/client";
import runAxiosAsync from "app/API/runAxiosAsync";
import useAuth from "app/hooks/useAuth";
import Header from "app/UI/Header";
import { FC } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {}
const Wallet: FC<Props> = () => {
    const onPress = () => {
        console.log("onPress");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ overflow: "visible" }}>
                <Header>Wallet</Header>
                <View style={styles.balanceContainer}>
                    <DarkCard>
                        <Text style={styles.walletText}>
                            Balance: 800.00 TL
                        </Text>
                    </DarkCard>
                    <BlueButton onPress={onPress}>Add Balance</BlueButton>
                </View>
                <View style={styles.historyContainer}>
                    <Text style={{ fontSize: 20 }}>History</Text>
                    <TransactionCard
                        type="deduct"
                        date={new Date()}
                        amount={100}
                    >
                        <RoutLocations from="ISU ANK" to="Seyrantepe" />
                    </TransactionCard>
                    <TransactionCard
                        type="add"
                        date={new Date()}
                        amount={100}
                    ></TransactionCard>
                    <TransactionCard
                        type="add"
                        date={new Date()}
                        amount={100}
                    ></TransactionCard>
                    <TransactionCard
                        type="add"
                        date={new Date()}
                        amount={100}
                    ></TransactionCard>
                    <TransactionCard
                        type="add"
                        date={new Date()}
                        amount={100}
                    ></TransactionCard>
                    <TransactionCard
                        type="add"
                        date={new Date()}
                        amount={100}
                    ></TransactionCard>
                    <TransactionCard
                        type="refund"
                        date={new Date()}
                        amount={100}
                    ></TransactionCard>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Wallet;

const styles = StyleSheet.create({
    container: { flex: 1, margin: 10 },
    walletText: {
        fontSize: 38,
        color: "white",
    },
    balanceContainer: {
        gap: 15,
    },
    historyContainer: {
        gap: 10,
        marginTop: 20,
    },
});
