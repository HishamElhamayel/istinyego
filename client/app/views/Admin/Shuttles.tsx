import ShuttlesList from "@components/lists/ShuttlesList";
import {
    NavigationProp,
    useFocusEffect,
    useNavigation,
} from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import Card from "@UI/cards/Card";
import Header from "@UI/ui/Header";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import { FC, useCallback, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GetShuttlesRes {
    shuttles: {
        _id: string;
        number: number;
    }[];
}

interface Props {}
const Drivers: FC<Props> = () => {
    const { authClient } = useClient();
    const [refreshing, setRefreshing] = useState(false);
    const [pending, setPending] = useState(true);
    const [shuttles, setShuttles] = useState<GetShuttlesRes["shuttles"]>([]);
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();

    const fetchData = async () => {
        // Fetch user bookings
        const res = await runAxiosAsync<GetShuttlesRes>(
            authClient.get("/shuttle")
        );

        if (res?.shuttles) {
            setShuttles(res.shuttles);
        }

        setPending(false); // Stop loading indicator
        setRefreshing(false); // Stop pull-to-refresh indicator
    };

    // Function to handle pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true); // Start pull-to-refresh indicator
        fetchData(); // Fetch data
    }, []);

    // Fetch data when the component mounts
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
            <ScrollView
                style={{ overflow: "visible" }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing} // Show refresh indicator while loading
                        onRefresh={onRefresh} // Trigger refresh on pull
                    />
                }
            >
                {/* Header with a welcome message */}
                <Header>Shuttles</Header>

                <Card>
                    <Button
                        onPress={() => navigation.navigate("CreateShuttle", {})}
                    >
                        Create Shuttle
                    </Button>
                </Card>

                {/* Show loading indicator while data is being fetched */}
                {pending && (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary100}
                        style={styles.loading}
                    />
                )}

                {shuttles.length === 0 && (
                    <Text style={styles.noShuttles}>No Shuttles found</Text>
                )}

                {/* Show favorite routes if available */}
                {!pending && shuttles.length > 0 && (
                    <>
                        <ShuttlesList shuttles={shuttles} />
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Drivers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    loading: {
        marginTop: 200,
    },
    noShuttles: {
        textAlign: "center",
        fontSize: 20,
        color: colors.grey,
    },
});
