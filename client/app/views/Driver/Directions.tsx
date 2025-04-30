import { RouteProp, useRoute } from "@react-navigation/native";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { DriverStackParamList } from "app/navigator/DriverNavigator";
import * as Location from "expo-location";
import React, { FC, useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import MapView, { Marker, Region } from "react-native-maps";

const Directions: FC = () => {
    const route = useRoute<RouteProp<DriverStackParamList, "Directions">>();
    const { fullRoute } = route.params;
    const { authClient } = useClient();
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<number[] | null>(null);
    const [region, setRegion] = useState<Region | null>(null);

    useEffect(() => {
        async function getCurrentLocation() {
            try {
                let { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    showMessage({
                        message:
                            "For better experience, please allow location permission",
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
            } catch (error) {
                console.error("Error getting location:", error);
            } finally {
                setLoading(false);
            }
        }

        getCurrentLocation();
    }, []);

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

    // useEffect(() => {
    //     let intervalId: NodeJS.Timeout;

    //     const fetchLocation = async () => {
    //         const res = await runAxiosAsync(
    //             authClient.get<GetShuttleLocationRes>(
    //                 `/shuttle/shuttle-location/${shuttleId}`
    //             )
    //         );

    //         if (res?.shuttle) {
    //             const coords = res.shuttle.currentLocation.coordinates;
    //             setMarkerCoordinates([coords[0], coords[1]]);
    //             setLoading(false);
    //         }
    //     };

    //     fetchLocation();
    //     intervalId = setInterval(fetchLocation, 2000);
    //     return () => clearInterval(intervalId);
    // }, [authClient, shuttleId]);

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
                />

                {location && (
                    <Marker
                        coordinate={{
                            latitude: location[0],
                            longitude: location[1],
                        }}
                    >
                        <Image
                            source={require("../../../assets/map_marker.png")}
                            style={{
                                width: 40,
                                height: 50,
                                backgroundColor: "transparent",
                            }}
                        />
                    </Marker>
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
