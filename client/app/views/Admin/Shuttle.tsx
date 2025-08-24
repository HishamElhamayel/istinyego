import UpcomingTripsList from "@components/lists/UpcomingTripsList";
import {
    NavigationProp,
    RouteProp,
    useFocusEffect,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import RedButton from "@UI/buttons/RedButton";
import Card from "@UI/cards/Card";
import DatePicker from "@UI/form/DatePicker";
import LoadingAnimation from "@UI/loading/LoadingAnimation";
import Header from "@UI/ui/Header";
import Info from "@UI/ui/Info";
import { GetTripsRes } from "@views/Driver/Home";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import { DateTime } from "luxon";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";

export interface GetShuttleRes {
    shuttle: {
        _id: string;
        number: number;
        coordinates: {
            type: string;
            coordinates: number[];
        };
        capacity: number;
        driver: {
            _id: string;
            firstName: string;
            lastName: string;
            studentId: number;
        };
    };
}
const User: FC = () => {
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();
    const route = useRoute<RouteProp<AdminStackParamList, "Shuttle">>();
    const { shuttleId } = route.params;
    const { authClient } = useClient();
    const [pending, setPending] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [shuttle, setShuttle] = useState<GetShuttleRes["shuttle"]>();
    const [date, setDate] = useState<Date>(new Date());
    const [trips, setTrips] = useState<GetTripsRes["trips"]>([]);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        // Fetch user bookings
        setPending(true); // Start loading indicator
        const res = await runAxiosAsync<GetShuttleRes>(
            authClient.get(`/shuttle/${shuttleId}`)
        );
        if (res?.shuttle) {
            setShuttle(res.shuttle);
        }
        setPending(false); // Stop loading indicator
        setRefreshing(false); // Stop pull-to-refresh indicator
    };

    const fetchTrips = async () => {
        const res = await runAxiosAsync<GetTripsRes>(
            authClient.get("/trip/trips-by-shuttle", {
                params: {
                    shuttleId: shuttleId,
                    date: DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"),
                },
            })
        );

        setTrips(res?.trips || []);
    };

    const navigateToEditShuttle = () => {
        navigation.navigate("CreateShuttle", {
            shuttle: shuttle,
        });
    };
    const navigateToTrackShuttle = () => {
        if (!shuttle)
            return showMessage({
                message: "Error trying to access shuttle data, try again later",
                type: "danger",
            });

        navigation.navigate("TrackShuttle", {
            shuttleId: shuttle?._id,
        });
    };

    const navigateToCreateTrip = () => {
        if (!shuttle)
            return showMessage({
                message: "Error trying to access shuttle data, try again later",
                type: "danger",
            });

        navigation.navigate("CreateTrip", {
            shuttleId: shuttleId,
            date: DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"),
            availableSeats: shuttle.capacity,
        });
    };

    const handleDeleteShuttle = async () => {
        try {
            const res = await runAxiosAsync(
                authClient.delete(`/shuttle/${shuttleId}`)
            );

            if (res.status === 204) {
                showMessage({
                    message: "Shuttle deleted successfully",
                    type: "success",
                });
                navigation.goBack();
            }
        } catch (error) {
            showMessage({
                message: "Failed to delete shuttle. Try again later.",
                type: "danger",
            });
        } finally {
            setShowModal(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTrips();
        }, [date])
    );

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true); // Start pull-to-refresh indicator
        fetchData(); // Fetch data
        fetchTrips();
    }, [date]);

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
                <Header>
                    {shuttle
                        ? `ISU - ${shuttle.number.toString().padStart(2, "0")}`
                        : "Shuttle"}
                </Header>

                <LoadingAnimation visible={pending} />

                {!pending && !shuttle && (
                    <Text style={styles.centerText}>No shuttle found</Text>
                )}

                {!pending && shuttle && (
                    <>
                        <Card>
                            <View style={styles.shuttleInfo}>
                                <Info title="Driver Name" style={styles.info}>
                                    {shuttle?.driver.firstName
                                        .charAt(0)
                                        .toUpperCase() +
                                        shuttle?.driver.firstName.slice(1)}{" "}
                                    {shuttle?.driver.lastName
                                        .charAt(0)
                                        .toUpperCase() +
                                        shuttle?.driver.lastName.slice(1)}
                                </Info>

                                <Info title="Capacity" style={styles.info}>
                                    {shuttle?.capacity}
                                </Info>
                            </View>
                            <View style={styles.buttonsContainer}>
                                <Button onPress={navigateToEditShuttle}>
                                    Edit Shuttle
                                </Button>
                                <Button onPress={navigateToTrackShuttle}>
                                    Track Shuttle
                                </Button>
                                <RedButton
                                    onPress={() => {
                                        setShowModal(true);
                                    }}
                                >
                                    Delete Shuttle
                                </RedButton>
                            </View>
                        </Card>
                        <DatePicker date={date} setParentDate={setDate} />
                    </>
                )}
                {!pending && (
                    <UpcomingTripsList
                        trips={trips}
                        title="Upcoming Trips"
                        onCreateNew={navigateToCreateTrip}
                    />
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
                            Are you sure you want to delete this shuttle?
                        </Text>
                        <View style={styles.buttonsContainer}>
                            <RedButton onPress={handleDeleteShuttle}>
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

export default User;

// Styles definition
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    shuttleInfo: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    info: { justifyContent: "flex-start", flex: 1 },
    centerText: {
        textAlign: "center",
        fontSize: 24,
    },
    buttonsContainer: {
        marginTop: 20,
        gap: 10,
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
