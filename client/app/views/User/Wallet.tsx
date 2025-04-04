import AddBalance from "@components/AddBalance";
import TransactionList from "@components/TransactionList";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

// Define the type for the navigation stack
export type WalletStackParamList = {
    Wallet: undefined;
    AddBalance: undefined;
};

// Interfaces for API response types
interface GetWalletRes {
    balance: number; // Wallet balance
}

const WalletPage: FC = () => {
    const { authClient } = useClient(); // Custom hook to get authenticated client
    const [pending, setPending] = useState(true); // State to track loading status
    const [balance, setBalance] = useState<number>(); // State to store wallet balance
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
    const navigation = useNavigation<NavigationProp<WalletStackParamList>>();

    // Function to fetch wallet balance and transactions
    const fetchData = async () => {
        const walletRes = await runAxiosAsync<GetWalletRes>(
            authClient.get("/wallet/get-balance") // API call to get wallet balance
        );
        if (walletRes?.balance) {
            setBalance(walletRes.balance); // Update balance state
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
        navigation.navigate("AddBalance"); // Navigate to AddBalance screen
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
                        <TransactionList />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const Wallet: FC = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Wallet" component={WalletPage} />
            <Stack.Screen
                name="AddBalance"
                component={AddBalance}
                options={{
                    presentation: "formSheet",
                    sheetAllowedDetents: "fitToContents",
                    sheetCornerRadius: 60,
                    sheetGrabberVisible: true,
                }}
            />
        </Stack.Navigator>
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
