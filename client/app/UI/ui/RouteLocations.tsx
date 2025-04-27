import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    from: string;
    to: string;
};

const RoutLocations = ({ from, to }: Props) => {
    return (
        <View style={styles.locationsContainer}>
            <Text style={styles.locationText}>{from}</Text>
            <Ionicons name="arrow-forward-sharp" color={"Black"} size={24} />
            <Text style={styles.locationText}>{to}</Text>
        </View>
    );
};

export default RoutLocations;

const styles = StyleSheet.create({
    locationsContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    locationText: {
        fontSize: 20,
    },
});
