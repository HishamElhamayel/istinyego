import RoutesList from "@components/lists/RoutesList";
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
import useAuth from "app/hooks/useAuth";
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

interface GetRoutesRes {
    routes: {
        _id: string;
        startLocation: string;
        endLocation: string;
    }[];
}

const Routes: FC = () => {
    const { authClient } = useClient(); // Access authenticated Axios client
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
    const [pending, setPending] = useState(true); // State to track loading
    const [routes, setRoutes] = useState<GetRoutesRes["routes"]>([]); // State for favorite routes
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();
    const { authState } = useAuth();
    // Function to fetch data for bookings and favorite routes
    const fetchData = async () => {
        // Fetch user bookings
        const res = await runAxiosAsync<GetRoutesRes>(authClient.get("/route"));

        if (res?.routes) {
            setRoutes(res.routes);
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
                <Header>Routes</Header>

                {authState.profile?.role === "admin" && (
                    <Card>
                        <Button
                            onPress={() =>
                                navigation.navigate("Route", {
                                    _id: undefined,
                                })
                            }
                        >
                            Add Route
                        </Button>
                    </Card>
                )}
                {/* Show loading indicator while data is being fetched */}
                {pending && (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary100}
                        style={styles.loading}
                    />
                )}

                {/* Show favorite routes if available */}
                {!pending && routes.length > 0 && (
                    <RoutesList routes={routes} />
                )}
                {routes.length === 0 && (
                    <Text style={styles.noRoutes}>No routes found</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Routes;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    loading: {
        marginTop: 200,
    },
    noRoutes: {
        textAlign: "center",
        fontSize: 20,
        color: colors.grey,
        marginTop: 20,
    },
});
