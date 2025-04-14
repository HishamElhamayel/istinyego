import {
    NavigationProp,
    RouteProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import FormInput from "@UI/form/FormInput";
import validate, { UpdateUserSchema } from "@utils/validator";
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
            coordinates: [number, number];
            address: string;
            description: string;
        };
        endLocation: {
            type: "Point";
            coordinates: [number, number];
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
    const [pending, setPending] = useState(true);

    const [id, setId] = useState<RouteRes["route"]["_id"]>("");
    const [startLocation, setStartLocation] = useState<
        RouteRes["route"]["startLocation"]
    >({
        type: "Point",
        coordinates: [0, 0],
        address: "",
        description: "",
    });
    const [endLocation, setEndLocation] = useState<
        RouteRes["route"]["endLocation"]
    >({
        type: "Point",
        coordinates: [0, 0],
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

            setPending(false);
        };

        fetchRoute();
    }, [route.params?._id]);

    const routeInfo = {
        _id: id,
        startLocation,
        endLocation,
        fare,
    };

    const handleSubmit = async () => {
        // const { values, error } = await validate(createRoute, routeInfo);
        // if (error) return showMessage({ message: error, type: "danger" });

        setBusy(true);
        const res = await runAxiosAsync<RouteRes>(
            authClient.post("/routes/create", routeInfo)
        );

        if (res?.route) {
            showMessage({ message: "Route created", type: "success" });
            navigation.goBack();
        }
        setBusy(false);
    };

    return (
        <View style={{ gap: 15 }}>
            <Text style={styles.header}>
                {id ? "Edit Route" : "Create Route"}
            </Text>

            <Text>Start Location</Text>

            <FormInput
                label="Address"
                onChangeText={(text) =>
                    setStartLocation({ ...startLocation, address: text })
                }
                value={startLocation.address}
                collapsable
            />
            <FormInput
                label="Description"
                onChangeText={(text) =>
                    setStartLocation({ ...startLocation, description: text })
                }
                value={startLocation.description}
                collapsable
            />

            <Text>End Location</Text>

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
});
