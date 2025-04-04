import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "@utils/colors";
import { DateTime } from "luxon";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    children?: React.ReactNode;
    type: "add" | "deduct" | "refund";
    date: string;
    amount: number;
}

const TransactionCard: FC<Props> = ({ type, date, amount, children }) => {
    return (
        <View style={styles.root}>
            <View style={styles.topContainer}>
                <View style={styles.amount}>
                    {type === "deduct" ? (
                        <Ionicons name="remove-sharp" size={22} />
                    ) : (
                        <Ionicons name="add-sharp" size={22} />
                    )}
                    <Text style={styles.text}>{amount}₺</Text>
                </View>
                <Text style={styles.dateText}>
                    {DateTime.fromISO(date).toFormat("cccc t")}
                </Text>
            </View>
            {children && children}
            {type === "refund" && (
                <Text style={styles.text}>Refund due to canceled trip</Text>
            )}
        </View>
    );
};

export default TransactionCard;

const styles = StyleSheet.create({
    root: {
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: "white",
    },
    topContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    amount: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    text: {
        fontSize: 22,
    },
    dateText: {
        fontSize: 16,
        color: colors.grey,
    },
});
