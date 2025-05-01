import TripInfo from "@components/TripInfo";
import {
    NavigationProp,
    RouteProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import RedButton from "@UI/buttons/RedButton";
import Card from "@UI/cards/Card";
import RouteLocations from "@UI/ui/RouteLocations";
import colors from "@utils/colors";
import { GetTripRes } from "@views/User/Trip";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import { DateTime } from "luxon";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";

const Trip: FC = () => {
    // Route parameters and authentication client
    const { params } = useRoute<RouteProp<AdminStackParamList, "Trip">>();
    const { authClient } = useClient();
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();

    // State management
    const [refreshing, setRefreshing] = useState(false);
    const [pending, setPending] = useState(true);
    const [trip, setTrip] = useState<GetTripRes["trip"]>();
    const [showModal, setShowModal] = useState(false);

    // Redux state and dispatch
    const { tripId } = params;

    /**
     * Fetches trip data from the API
     */
    const fetchData = async () => {
        if (!tripId) {
            return;
        }
        const res = await runAxiosAsync<GetTripRes>(
            authClient.get(`/trip/${tripId}`)
        );

        if (res?.trip) {
            setTrip(res.trip);
        }

        setPending(false);
        setRefreshing(false);
    };

    /**
     * Callback for pull-to-refresh functionality
     */
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    const handleDeleteTrip = async () => {
        try {
            const res = await runAxiosAsync(
                authClient.delete(`/trip/${tripId}`)
            );

            if (res.status === 204) {
                showMessage({
                    message: "Trip deleted successfully",
                    type: "success",
                });
                navigation.goBack();
            }
        } catch (error) {
            showMessage({
                message: "Failed to delete trip. Try again later.",
                type: "danger",
            });
        } finally {
            setShowModal(false);
        }
    };

    // Initial data fetch on component mount
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
            <ScrollView
                style={{ overflow: "visible" }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {pending && (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary100}
                        style={styles.loading}
                    />
                )}
                {!pending && !trip && (
                    <Text style={styles.centerText}>No trip found</Text>
                )}
                {trip && (
                    <>
                        <RouteLocations
                            from={trip.startLocation}
                            to={trip.endLocation}
                        />
                        <View style={{ marginTop: 20, gap: 10 }}>
                            <Text style={styles.centerText}>
                                {DateTime.fromISO(trip.date).toFormat(
                                    "ccc dd MMMM"
                                )}
                            </Text>
                            <Card>
                                <TripInfo trip={trip} />
                                <View style={styles.buttonsContainer}>
                                    <Button
                                        onPress={() => {
                                            navigation.navigate("Bookings", {
                                                tripId: trip._id,
                                                startLocation:
                                                    trip.startLocation,
                                                endLocation: trip.endLocation,
                                            });
                                        }}
                                    >
                                        View Bookings
                                    </Button>
                                    {trip.state === "scheduled" && (
                                        <RedButton
                                            onPress={() => {
                                                setShowModal(true);
                                            }}
                                        >
                                            Delete Trip
                                        </RedButton>
                                    )}
                                </View>
                            </Card>
                        </View>
                    </>
                )}
            </ScrollView>
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modal}>
                    <Card>
                        <Text style={styles.modalText}>
                            Are you sure you want to delete this trip?
                        </Text>
                        <View style={styles.buttonsContainer}>
                            <RedButton onPress={handleDeleteTrip}>
                                Confirm
                            </RedButton>
                            <Button onPress={() => setShowModal(false)}>
                                Cancel
                            </Button>
                        </View>
                    </Card>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Trip;

// Styles definition
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    loading: {
        marginTop: 200,
    },
    centerText: {
        textAlign: "center",
        fontSize: 24,
    },
    buttonsContainer: {
        marginTop: 25,
        gap: 15,
    },
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        padding: 10,
    },
    modalText: {
        textAlign: "center",
        fontSize: 24,
        color: "white",
    },
});
