import { NavigationProp, useNavigation } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import DateInput from "@UI/form/DateInput";
import colors from "@utils/colors";
import { WalletStackParamList } from "@views/User/Wallet";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FormInput from "../UI/form/FormInput";

const AddBalance: FC = () => {
    const navigation = useNavigation<NavigationProp<WalletStackParamList>>();

    const [busy, setBusy] = useState(false);
    const [userInfo, setUserInfo] = React.useState({
        cardNumber: "87164813120376",
        amount: "1000",
        cvv: "123",
    });
    const [expiryDate, setExpiryDate] = useState<Date>(new Date());

    const { cardNumber, amount, cvv } = userInfo;

    const handleChange = (key: string) => (text: string) => {
        setUserInfo({ ...userInfo, [key]: text });
    };

    console.log(cardNumber, amount, cvv, expiryDate);

    return (
        <LinearGradient
            colors={[colors.primary100, colors.primary50]}
            style={[styles.container]}
        >
            <View style={{ gap: 15 }}>
                <Text style={styles.header}>Add Balance</Text>
                <FormInput
                    label="Amount"
                    onChangeText={handleChange("amount")}
                    value={amount}
                    keyboardType="numeric"
                    maxLength={4}
                    collapsable
                />
                <FormInput
                    label="Card Number"
                    onChangeText={handleChange("cardNumber")}
                    value={cardNumber}
                    keyboardType="numeric"
                    maxLength={16}
                    collapsable
                />

                <View style={{ flexDirection: "row", gap: 15 }}>
                    <DateInput
                        label="Expiry date"
                        setParentDate={setExpiryDate}
                    />
                    <FormInput
                        label="CVV"
                        keyboardType="numeric"
                        value={cvv}
                        onChangeText={handleChange("cvv")}
                        maxLength={4}
                        collapsable
                    />
                </View>

                <View style={styles.bottomContainer}>
                    <Button
                        size="medium"
                        active={!busy}
                        onPress={() => {
                            console.log("hi");
                        }}
                    >
                        Confirm
                    </Button>
                    <Button size="medium" onPress={() => navigation.goBack()}>
                        Cancel
                    </Button>
                </View>
            </View>
        </LinearGradient>
    );
};

export default AddBalance;

const styles = StyleSheet.create({
    container: {
        // borderRadius: 15,
        paddingVertical: 25,
        paddingHorizontal: 15,
        flex: 1,
    },
    header: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
        marginBottom: 15,
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "stretch", // Ensure buttons stretch
        gap: 5, // Optional: Add spacing between buttons
        justifyContent: "space-between", // Add spacing between buttons
        width: "100%", // Ensure full width
        marginBottom: 50,
    },
});
