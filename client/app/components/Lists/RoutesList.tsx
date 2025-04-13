import { NavigationProp, useNavigation } from "@react-navigation/native";
import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import RouteLocations from "@UI/ui/RouteLocations";
import { UserStackParamList } from "app/navigator/UserNavigator";
import React from "react";
import { StyleSheet } from "react-native";

type Props = {
    routes: {
        _id: string;
        startLocation: string;
        endLocation: string;
    }[];
    title: string;
};

const RoutesList = ({ routes, title }: Props) => {
    const navigation = useNavigation<NavigationProp<UserStackParamList>>();

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

    // console.log(trips);

    return (
        <Card title={title} style={styles.container}>
            {routes.map((route) => (
                <LightCard
                    key={route._id}
                    onPressHandler={() => onPress(route)}
                >
                    <RouteLocations
                        from={route.startLocation}
                        to={route.endLocation}
                    />
                </LightCard>
            ))}
        </Card>
    );
};

export default RoutesList;

const styles = StyleSheet.create({
    container: { gap: 15 },
    dateText: {
        fontSize: 22,
    },
});
