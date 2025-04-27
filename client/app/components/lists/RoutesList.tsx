import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import RouteLocations from "@UI/ui/RouteLocations";
import runAxiosAsync from "app/API/runAxiosAsync";
import useAuth from "app/hooks/useAuth";
import useClient from "app/hooks/useClient";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import { UserStackParamList } from "app/navigator/UserNavigator";
import { setFavRoutes } from "app/store/auth";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";

type Props = {
    routes: {
        _id: string;
        startLocation: string;
        endLocation: string;
    }[];
    title?: string;
};

interface FavRes {
    favoriteRoutes: string[];
}

const RoutesList = ({ routes, title }: Props) => {
    const { authState } = useAuth();
    const navigation =
        useNavigation<
            NavigationProp<AdminStackParamList & UserStackParamList>
        >();
    const { authClient } = useClient();
    const {
        authState: { profile },
    } = useAuth();
    const dispatch = useDispatch();
    const isAdmin = authState.profile?.role === "admin";
    const isUser = authState.profile?.role === "user";

    const onPress = (route: {
        _id: string;
        startLocation: string;
        endLocation: string;
    }) => {
        navigation.navigate("Trips", {
            routeId: route._id,
            startLocation: route.startLocation,
            endLocation: route.endLocation,
        });
    };

    const toggleFavorite = async (routeId: string) => {
        const res = await runAxiosAsync<FavRes>(
            authClient.post(`/route/toggle-fav-route/${routeId}`)
        );
        if (res?.favoriteRoutes) {
            showMessage({
                message: "Favorite routes updated",
                type: "success",
            });
            dispatch(setFavRoutes(res));
        }
    };

    // console.log(trips);

    return (
        <Card title={title || ""} style={styles.container}>
            {routes.map((route) => (
                <View key={route._id} style={styles.subContainers}>
                    <LightCard
                        style={[!isAdmin && { width: "90%" }]}
                        onPressHandler={() => {
                            if (isAdmin) {
                                navigation.navigate("Route", {
                                    _id: route._id,
                                });
                            } else {
                                onPress(route);
                            }
                        }}
                    >
                        <RouteLocations
                            from={route.startLocation}
                            to={route.endLocation}
                        />
                    </LightCard>

                    {isUser && profile?.favoriteRoutes?.includes(route._id) ? (
                        <Pressable
                            onPress={() => {
                                toggleFavorite(route._id);
                            }}
                        >
                            <Ionicons name="heart" size={24} color="red" />
                        </Pressable>
                    ) : (
                        isUser && (
                            <Pressable
                                onPress={() => {
                                    toggleFavorite(route._id);
                                }}
                            >
                                <Ionicons
                                    name="heart-outline"
                                    size={24}
                                    color="black"
                                />
                            </Pressable>
                        )
                    )}
                </View>
            ))}
        </Card>
    );
};

export default RoutesList;

const styles = StyleSheet.create({
    container: { gap: 15 },
    subContainers: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        gap: 10,
    },
});
