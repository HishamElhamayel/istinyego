import TransactionList from "@components/TransactionList";
import BlueButton from "@UI/buttons/BlueButton";
import DarkCard from "@UI/cards/DarkCard";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import Header from "app/UI/Header";
import { FC, useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GetWalletRes {
    balance: number;
}
interface GetTransactionsRes {
    transactions: {
        _id: string;
        amount: number;
        type: "add" | "deduct" | "refund";
        createdAt: string;
        route: {
            startLocation: string;
            endLocation: string;
        };
    }[];
}

interface Props {}
const Wallet: FC<Props> = () => {
    const { authClient } = useClient();

    const [pending, setPending] = useState(true);
    const [balance, setBalance] = useState<number>();
    const [transactions, setTransactions] = useState<
        GetTransactionsRes["transactions"]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            const walletRes = await runAxiosAsync<GetWalletRes>(
                authClient.get("/wallet/get-balance")
            );
            if (walletRes?.balance) {
                setBalance(walletRes.balance);
            }

            const TransactionRes = await runAxiosAsync<GetTransactionsRes>(
                authClient.get("/transaction/get-transactions")
            );
            if (TransactionRes) {
                setTransactions(TransactionRes.transactions);
            }

            setPending(false);
        };
        fetchData();
    }, []);

    const onPress = () => {
        console.log("onPress");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ overflow: "visible" }}>
                <Header>Wallet</Header>
                {pending ? (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary100}
                        style={styles.loading}
                    />
                ) : (
                    <View style={styles.balanceContainer}>
                        <DarkCard>
                            <Text style={styles.walletText}>
                                Balance: {balance?.toFixed(2)}₺
                            </Text>
                        </DarkCard>
                        <BlueButton onPress={onPress}>Add Balance</BlueButton>
                        <TransactionList transactions={transactions} />
                    </View>
                )}
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
    loading: {
        marginTop: 200,
    },
});
