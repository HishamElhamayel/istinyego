import TransactionList from "@components/TransactionList";
import BlueButton from "@UI/buttons/BlueButton";
import DarkCard from "@UI/cards/DarkCard";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import Header from "app/UI/Header";
import { FC, useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Interfaces for API response types
interface GetWalletRes {
    balance: number; // Wallet balance
}
interface GetTransactionsRes {
    transactions: {
        _id: string; // Transaction ID
        amount: number; // Transaction amount
        type: "add" | "deduct" | "refund"; // Transaction type
        createdAt: string; // Transaction creation date
        route: {
            startLocation: string; // Start location of the route
            endLocation: string; // End location of the route
        };
    }[];
}

interface Props {}
const Wallet: FC<Props> = () => {
    const { authClient } = useClient(); // Custom hook to get authenticated client
    const [pending, setPending] = useState(true); // State to track loading status
    const [balance, setBalance] = useState<number>(); // State to store wallet balance
    const [transactions, setTransactions] = useState<
        GetTransactionsRes["transactions"]
    >([]); // State to store transactions
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

    // Function to fetch wallet balance and transactions
    const fetchData = async () => {
        const walletRes = await runAxiosAsync<GetWalletRes>(
            authClient.get("/wallet/get-balance") // API call to get wallet balance
        );
        if (walletRes?.balance) {
            setBalance(walletRes.balance); // Update balance state
        }

        const TransactionRes = await runAxiosAsync<GetTransactionsRes>(
            authClient.get("/transaction/get-transactions") // API call to get transactions
        );
        if (TransactionRes) {
            setTransactions(TransactionRes.transactions); // Update transactions state
        }

        setPending(false); // Stop loading indicator
        setRefreshing(false); // Stop pull-to-refresh indicator
    };

    // Function to handle pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true); // Start pull-to-refresh indicator
        fetchData(); // Fetch data
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Placeholder function for "Add Balance" button
    const onPress = () => {
        console.log("onPress");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={{ overflow: "visible" }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing} // Show refresh indicator while loading
                        onRefresh={onRefresh} // Trigger refresh on pull
                    />
                }
            >
                <Header>Wallet</Header>
                {pending ? (
                    // Show loading indicator while data is being fetched
                    <ActivityIndicator
                        size="large"
                        color={colors.primary100}
                        style={styles.loading}
                    />
                ) : (
                    <View style={styles.balanceContainer}>
                        {/* Display wallet balance */}
                        <DarkCard>
                            <Text style={styles.walletText}>
                                Balance: {balance?.toFixed(2)}₺
                            </Text>
                        </DarkCard>
                        {/* Button to add balance */}
                        <BlueButton onPress={onPress}>Add Balance</BlueButton>
                        {/* List of transactions */}
                        <TransactionList transactions={transactions} />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Wallet;

// Styles for the Wallet component
const styles = StyleSheet.create({
    container: { flex: 1, margin: 10 }, // Main container style
    walletText: {
        fontSize: 38, // Font size for wallet balance text
        color: "white", // Text color
    },
    balanceContainer: {
        gap: 15, // Space between elements in the balance container
    },
    loading: {
        marginTop: 200, // Margin for loading indicator
    },
});
