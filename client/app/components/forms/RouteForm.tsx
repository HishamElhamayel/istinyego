import {
    NavigationProp,
    RouteProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import FormInput from "@UI/form/FormInput";
import Info from "@UI/ui/info";
import validate, { CreateRouteSchema } from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";

interface Props {}

interface RouteRes {
    route: {
        _id: string;
        startLocation: {
            type: "Point";
            coordinates: number[];
            address: string;
            description: string;
        };
        endLocation: {
            type: "Point";
            coordinates: number[];
            address: string;
            description: string;
        };
        fare: number;
    };
}

const RouteForm: FC<Props> = () => {
    const { authClient } = useClient();
    const route = useRoute<RouteProp<AdminStackParamList, "Route">>();
    const [busy, setBusy] = useState(false);
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();

    const [id, setId] = useState<RouteRes["route"]["_id"]>("");
    const [startLocation, setStartLocation] = useState<
        RouteRes["route"]["startLocation"]
    >({
        type: "Point",
        coordinates: [],
        address: "",
        description: "",
    });
    const [endLocation, setEndLocation] = useState<
        RouteRes["route"]["endLocation"]
    >({
        type: "Point",
        coordinates: [],
        address: "",
        description: "",
    });
    const [fare, setFare] = useState<RouteRes["route"]["fare"]>(0);

    useEffect(() => {
        const fetchRoute = async () => {
            if (route.params?._id) {
                setId(route.params._id);

                const res = await runAxiosAsync<RouteRes>(
                    authClient.get(`/route/${route.params._id}`)
                );

                if (res?.route) {
                    setStartLocation(res.route.startLocation);
                    setEndLocation(res.route.endLocation);
                    setFare(res.route.fare);
                }
            }
        };

        fetchRoute();
    }, [route.params?._id]);

    const handleSubmit = async () => {
        setBusy(true);

        const routeInfo = {
            startLocation,
            endLocation,
            fare,
        };

        const { values, error } = await validate(CreateRouteSchema, routeInfo);
        if (error) {
            showMessage({ message: error, type: "danger" });
            setBusy(false);
            return;
        }

        if (id) {
            const res = await runAxiosAsync<RouteRes>(
                authClient.patch(`/route/${id}`, values)
            );
            if (res?.route) {
                showMessage({ message: "Route updated", type: "success" });
                navigation.goBack();
            }
        } else {
            const res = await runAxiosAsync<RouteRes>(
                authClient.post("/route/create", values)
            );
            if (res?.route) {
                showMessage({ message: "Route created", type: "success" });
                navigation.goBack();
            }
        }

        setBusy(false);
    };

    return (
        <View style={{ gap: 15, marginBottom: 30 }}>
            <Text style={styles.header}>
                {id ? "Edit Route" : "Create Route"}
            </Text>

            <Text style={styles.subtitle}>Start Location</Text>

            <FormInput
                label="Description"
                onChangeText={(text) =>
                    setStartLocation({ ...startLocation, description: text })
                }
                value={startLocation.description}
                collapsable
            />

            <FormInput
                label="Address"
                onChangeText={(text) =>
                    setStartLocation({ ...startLocation, address: text })
                }
                value={startLocation.address}
                collapsable
            />

            {startLocation.coordinates.length > 0 && (
                <View style={styles.infoContainer}>
                    <Info title="Latitude">
                        {startLocation.coordinates[0].toFixed(5)}
                    </Info>
                    <Info title="Longitude">
                        {startLocation.coordinates[1].toFixed(5)}
                    </Info>
                </View>
            )}
            <Button
                onPress={() =>
                    navigation.navigate("Map", {
                        location: startLocation.coordinates,
                        setCoordinates: (
                            location: number[],
                            address: string
                        ) => {
                            setStartLocation({
                                ...startLocation,
                                coordinates: location,
                                address: address,
                            });
                        },
                    })
                }
            >
                Select Start Location
            </Button>

            <View
                style={{
                    height: 1,
                    backgroundColor: "white",
                }}
            />

            <Text style={styles.subtitle}>End Location</Text>

            <FormInput
                label="Address"
                onChangeText={(text) =>
                    setEndLocation({ ...endLocation, address: text })
                }
                value={endLocation.address}
                collapsable
            />
            <FormInput
                label="Description"
                onChangeText={(text) =>
                    setEndLocation({ ...endLocation, description: text })
                }
                value={endLocation.description}
                collapsable
            />
            {endLocation.coordinates.length > 0 && (
                <View style={styles.infoContainer}>
                    <Info title="Latitude">
                        {endLocation.coordinates[0].toFixed(5)}
                    </Info>
                    <Info title="Longitude">
                        {endLocation.coordinates[1].toFixed(5)}
                    </Info>
                </View>
            )}

            <Button
                onPress={() =>
                    navigation.navigate("Map", {
                        location: endLocation.coordinates,
                        setCoordinates: (
                            location: number[],
                            address: string
                        ) => {
                            setEndLocation({
                                ...endLocation,
                                coordinates: location,
                                address: address,
                            });
                        },
                    })
                }
            >
                Select End Location
            </Button>
            <View
                style={{
                    height: 1,
                    backgroundColor: "white",
                }}
            />

            <Text style={styles.subtitle}>Fare</Text>

            <FormInput
                label="Fare"
                onChangeText={(text) => setFare(Number(text))}
                value={fare.toString()}
                keyboardType="numeric"
                collapsable
                returnKeyType="done"
            />

            <Button active={!busy} onPress={handleSubmit}>
                {id ? "Update Route" : "Create Route"}
            </Button>

            <Button active={!busy} onPress={() => navigation.goBack()}>
                Cancel
            </Button>
        </View>
    );
};

export default RouteForm;

const styles = StyleSheet.create({
    header: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
    },
    subtitle: {
        color: "white",
        fontSize: 21,
        fontWeight: "bold",
    },
    infoContainer: {
        flexDirection: "row",
        gap: 40,
        justifyContent: "center",
    },
});
