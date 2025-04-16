import { RouteProp, useRoute } from "@react-navigation/native";
import colors from "@utils/colors";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import MapView, { Marker } from "react-native-maps";

type Props = {};

const origin = { latitude: 41.102635, longitude: 28.975461 };

const Map = (props: Props) => {
    const route = useRoute<RouteProp<AdminStackParamList, "Map">>();
    const [location, setLocation] = useState<number[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [markerCoordinates, setMarkerCoordinates] = useState<number[] | null>(
        null
    );
    const { setCoordinates } = route.params;

    useEffect(() => {
        async function getCurrentLocation() {
            try {
                // If props location is provided, use it
                if (route.params.location && route.params.location.length > 0) {
                    setLocation(route.params.location);
                    setMarkerCoordinates(route.params.location);
                    setLoading(false);
                    return;
                }

                let { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    showMessage({
                        message:
                            "For better experience, please allow location permission",
                        type: "warning",
                    });
                    // Use origin as fallback when location access is denied
                    setLocation([origin.latitude, origin.longitude]);
                    setLoading(false);
                    return;
                }

                // Get user location if no props location
                let userLocation = await Location.getCurrentPositionAsync({});
                const lat = userLocation.coords.latitude;
                const lng = userLocation.coords.longitude;
                setLocation([lat, lng]);
            } catch (error) {
                console.error("Error getting location:", error);
                setLocation([origin.latitude, origin.longitude]);
            } finally {
                setLoading(false);
            }
        }

        getCurrentLocation();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary100} />
            </View>
        );
    }

    if (!location) {
        return null;
    }

    const fetchAddress = async () => {
        if (!location) return "";

        try {
            const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${location[0]},${location[1]}&lang=en-US&apiKey=${process.env.EXPO_PUBLIC_HERE_API_KEY}`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Failed to fetch address");
            }
            const data = await res.json();
            if (
                !data ||
                !data.items ||
                !data.items[0] ||
                !data.items[0].address
            ) {
                throw new Error("Invalid address data received");
            }
            const address = data.items[0].address.label;

            return address;
        } catch (error) {
            console.log("Error fetching address:", error);
            return "";
        }
    };

    const setNewLocation = async (newLocation: number[]) => {
        setLocation(newLocation);
        setMarkerCoordinates(newLocation);

        const address = await fetchAddress();
        if (setCoordinates) {
            setCoordinates(newLocation, address);
        }
    };

    return (
        <MapView
            style={{ flex: 1 }}
            initialRegion={{
                latitude: location[0],
                longitude: location[1],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
            onPress={(e) => {
                setNewLocation([
                    e.nativeEvent.coordinate.latitude,
                    e.nativeEvent.coordinate.longitude,
                ]);
            }}
        >
            {markerCoordinates && (
                <Marker
                    coordinate={{
                        latitude: markerCoordinates[0],
                        longitude: markerCoordinates[1],
                    }}
                />
            )}
        </MapView>
    );
};

export default Map;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
