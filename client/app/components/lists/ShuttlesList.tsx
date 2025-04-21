import { NavigationProp, useNavigation } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
    shuttles: {
        _id: string;
        number: number;
    }[];
};
const ShuttlesList = ({ shuttles }: Props) => {
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();

    const onPress = (shuttleId: string) => {
        // navigation.navigate("Shuttle", {
        //     shuttleId,
        // });
        console.log("Shuttle", shuttleId);
    };

    return (
        <Card style={styles.container}>
            {shuttles.map((shuttle) => (
                <LightCard
                    key={shuttle._id}
                    onPressHandler={() => {
                        onPress(shuttle._id);
                    }}
                >
                    <Text style={styles.text}>
                        ISU - {shuttle.number.toString().padStart(2, "0")}
                    </Text>
                </LightCard>
            ))}
        </Card>
    );
};

export default ShuttlesList;

const styles = StyleSheet.create({
    container: { gap: 15 },
    text: {
        fontSize: 24,
    },
});
