import { RouteProp, useRoute } from "@react-navigation/native";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient"; // add client hook
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import { UserStackParamList } from "app/navigator/UserNavigator";
import React, { FC, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

interface GetShuttleLocationRes {
    shuttle: {
        _id: string;
        currentLocation: {
            type: "Point";
            coordinates: number[];
        };
    };
}

const TrackShuttle: FC = () => {
    const route =
        useRoute<
            RouteProp<AdminStackParamList & UserStackParamList, "TrackShuttle">
        >();
    const { shuttleId } = route.params;
    const { authClient } = useClient();

    const [markerCoordinates, setMarkerCoordinates] = useState<number[] | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const fetchLocation = async () => {
            const res = await runAxiosAsync(
                authClient.get<GetShuttleLocationRes>(
                    `/shuttle/shuttle-location/${shuttleId}`
                )
            );

            if (res?.shuttle) {
                const coords = res.shuttle.currentLocation.coordinates;
                setMarkerCoordinates([coords[0], coords[1]]);
                setLoading(false);
            }
        };

        fetchLocation();
        intervalId = setInterval(fetchLocation, 2000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading || !markerCoordinates) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary100} />
            </View>
        );
    }

    const region: Region = {
        latitude: markerCoordinates[0],
        longitude: markerCoordinates[1],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    return (
        <MapView style={{ flex: 1 }} region={region}>
            <Marker
                coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                }}
            />
        </MapView>
    );
};

export default TrackShuttle;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
