import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { DriverStackParamList } from "app/navigator/DriverNavigator";
import * as Location from "expo-location";
import React, { FC, useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import MapView, { Marker, Region } from "react-native-maps";

interface UpdateShuttleLocationRes {
    message: string;
}

const Directions: FC = () => {
    const route = useRoute<RouteProp<DriverStackParamList, "Directions">>();
    const { fullRoute } = route.params;
    const { authClient } = useClient();
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<number[] | null>(null);
    const [region, setRegion] = useState<Region | null>(null);

    let intervalId: NodeJS.Timeout;
    useEffect(() => {
        async function getCurrentLocation() {
            try {
                let { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    showMessage({
                        message:
                            "Please enable location permissions in your settings.",
                        type: "warning",
                    });
                    setLoading(false);
                    return;
                }

                let userLocation = await Location.getCurrentPositionAsync({});
                const lat = userLocation.coords.latitude;
                const lng = userLocation.coords.longitude;
                setLocation([lat, lng]);
                setRegion({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });

                const updateLocation = async () => {
                    const res = await runAxiosAsync<UpdateShuttleLocationRes>(
                        authClient.patch(`/shuttle/update-shuttle-location/`, {
                            location: [lat, lng],
                        })
                    );

                    if (res?.message) {
                        setLoading(false);
                    }
                };

                updateLocation();
                intervalId = setInterval(updateLocation, 2000);
            } catch (error) {
                console.error("Error getting location:", error);
            } finally {
                setLoading(false);
            }
        }

        getCurrentLocation();

        return () => clearInterval(intervalId);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                // Cleanup interval when the user leaves the page
                clearInterval(intervalId);
            };
        }, [])
    );

    useEffect(() => {
        if (fullRoute.startLocation && fullRoute.endLocation) {
            // Set the initial region based on the route's start location
            setRegion({
                latitude: fullRoute.startLocation.coordinates[0],
                longitude: fullRoute.startLocation.coordinates[1],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    }, [fullRoute]);

    if (loading || !region) {
        // Ensure region is loaded before rendering the map
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary100} />
            </View>
        );
    }

    return (
        <>
            <MapView
                style={{ flex: 1 }}
                initialRegion={region} // Use initialRegion instead of region
            >
                <Marker
                    coordinate={{
                        latitude: fullRoute.endLocation.coordinates[0],
                        longitude: fullRoute.endLocation.coordinates[1],
                    }}
                    title={fullRoute.endLocation.description}
                    image={require("../../../assets/destination_marker.png")}
                />

                {location && (
                    <Marker
                        coordinate={{
                            latitude: location[0],
                            longitude: location[1],
                        }}
                        title="My location"
                        description="My current location"
                        image={require("../../../assets/map_marker.png")}
                    />
                )}
            </MapView>
        </>
    );
};

export default Directions;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
