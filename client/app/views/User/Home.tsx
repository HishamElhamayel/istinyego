import Card from "@components/UI/Card";
import Header from "@components/UI/Header";
import LightCard from "@components/UI/LightCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import useAuth from "app/hooks/useAuth";
import { FC } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {}
const Home: FC<Props> = () => {
    const { authState } = useAuth();

    const firstName = authState.profile?.firstName;
    const onPress = () => {
        console.log("onPress");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ overflow: "visible" }}>
                <Header>
                    Welcome{" "}
                    {firstName
                        ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
                        : ""}
                    !
                </Header>
                <Card title="Bookings" style={styles.bookings}>
                    <LightCard onPressHandler={onPress}>
                        <View style={styles.locationsContainer}>
                            <Text style={styles.locationText}>ISU ANK</Text>
                            <Ionicons
                                name="arrow-forward-sharp"
                                color={"Black"}
                                size={24}
                            />
                            <Text style={styles.locationText}>Seyrantepe</Text>
                        </View>
                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                    <LightCard>
                        <View style={styles.locationsContainer}>
                            <Text style={styles.locationText}>ISU ANK</Text>
                            <Ionicons
                                name="arrow-forward-sharp"
                                color={"Black"}
                                size={24}
                            />
                            <Text style={styles.locationText}>Seyrantepe</Text>
                        </View>
                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                </Card>
                <Card title="Favorite Routes" style={styles.bookings}>
                    <LightCard onPressHandler={onPress}>
                        <View style={styles.locationsContainer}>
                            <Text style={styles.locationText}>ISU ANK</Text>
                            <Ionicons
                                name="arrow-forward-sharp"
                                color={"Black"}
                                size={24}
                            />
                            <Text style={styles.locationText}>Seyrantepe</Text>
                        </View>
                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                    <LightCard>
                        <View style={styles.locationsContainer}>
                            <Text style={styles.locationText}>ISU ANK</Text>
                            <Ionicons
                                name="arrow-forward-sharp"
                                color={"Black"}
                                size={24}
                            />
                            <Text style={styles.locationText}>Seyrantepe</Text>
                        </View>
                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                    <LightCard>
                        <View style={styles.locationsContainer}>
                            <Text style={styles.locationText}>ISU ANK</Text>
                            <Ionicons
                                name="arrow-forward-sharp"
                                color={"Black"}
                                size={24}
                            />
                            <Text style={styles.locationText}>Seyrantepe</Text>
                        </View>
                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                    <LightCard>
                        <View style={styles.locationsContainer}>
                            <Text style={styles.locationText}>ISU ANK</Text>
                            <Ionicons
                                name="arrow-forward-sharp"
                                color={"Black"}
                                size={24}
                            />
                            <Text style={styles.locationText}>Seyrantepe</Text>
                        </View>
                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                    <LightCard>
                        <View style={styles.locationsContainer}>
                            <Text style={styles.locationText}>ISU ANK</Text>
                            <Ionicons
                                name="arrow-forward-sharp"
                                color={"Black"}
                                size={24}
                            />
                            <Text style={styles.locationText}>Seyrantepe</Text>
                        </View>
                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 8 },
    bookings: { gap: 15 },
    locationsContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    locationText: {
        fontSize: 24,
    },
    dateText: {
        fontSize: 22,
    },
});
