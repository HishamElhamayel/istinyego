import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import RoutLocations from "@UI/RoutLocations";
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
    const onPress = () => {
        console.log("onPress");
    };

    // console.log(trips);

    return (
        <Card title={title} style={styles.container}>
            {routes.map((route) => (
                <LightCard key={route._id} onPressHandler={onPress}>
                    <RoutLocations
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
