import {
    NavigationProp,
    RouteProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import DropDown from "@UI/form/DropDown";
import FormInput from "@UI/form/FormInput";
import validate, { CreateTripSchema } from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import { DateTime } from "luxon";
import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface Props {}

interface TripRes {
    message: string;
}

interface GetRoutesRes {
    routes: {
        _id: string;
        startLocation: string;
        endLocation: string;
    }[];
}

const TripForm: FC<Props> = () => {
    const { authClient } = useClient();
    const [busy, setBusy] = useState(false);
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();
    const route = useRoute<RouteProp<AdminStackParamList, "CreateTrip">>();
    const [routes, setRoutes] = useState<GetRoutesRes["routes"]>([]);
    const { date, shuttleId, availableSeats } = route.params;
    const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [tripInfo, setTripInfo] = React.useState({
        routeId: "",
        duplicate: "",
    });

    const { routeId, duplicate } = tripInfo;

    const tripData = {
        shuttleId,
        routeId,
        date,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duplicate,
        availableSeats,
    };

    const toggleStartTimePicker = () => {
        setStartTimePickerVisible(!startTimePickerVisible);
    };

    const toggleEndTimePicker = () => {
        setEndTimePickerVisible(!endTimePickerVisible);
    };

    const handleChange = (key: string) => (text: string) => {
        setTripInfo({ ...tripInfo, [key]: text });
    };

    const handleSubmit = async () => {
        const { values, error } = await validate(CreateTripSchema, tripData);
        if (error) return showMessage({ message: error, type: "danger" });

        setBusy(true);
        const res = await runAxiosAsync<TripRes>(
            authClient.post("/trip/create", values)
        );

        if (res?.message) {
            showMessage({ message: res.message, type: "success" });
            navigation.goBack();
        }
        setBusy(false);
    };

    const fetchData = async () => {
        // Fetch user bookings
        const res = await runAxiosAsync<GetRoutesRes>(authClient.get("/route"));

        if (res?.routes) {
            setRoutes(res.routes);
        }
    };

    const getTime = (date: Date) => {
        const time = DateTime.fromJSDate(date).toLocaleString(
            DateTime.TIME_SIMPLE
        );
        return time;
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={{ gap: 15, marginBottom: 30 }}>
            <Text style={styles.header}>Create Trip</Text>

            <DropDown
                data={
                    routes?.map((route) => ({
                        label: `${route.startLocation} -> ${route.endLocation}`,
                        value: route._id,
                    })) ?? []
                }
                label="Route"
                onChange={handleChange("routeId")}
                value={routeId}
                placeholder="Select a route"
            />
            <View style={styles.timeContainer}>
                <Text style={styles.title}>Start Time</Text>
                <Button active={!busy} onPress={toggleStartTimePicker}>
                    {getTime(startTime)}
                </Button>
                <DateTimePickerModal
                    isVisible={startTimePickerVisible}
                    mode="time"
                    date={startTime}
                    onConfirm={(pickedTime) => {
                        const base = new Date(date);
                        base.setHours(
                            pickedTime.getHours(),
                            pickedTime.getMinutes(),
                            pickedTime.getSeconds()
                        );
                        setStartTime(base);
                        toggleStartTimePicker();
                    }}
                    onCancel={toggleStartTimePicker}
                />
            </View>
            <View style={styles.timeContainer}>
                <Text style={styles.title}>Start End</Text>
                <Button active={!busy} onPress={toggleEndTimePicker}>
                    {getTime(endTime)}
                </Button>
                <DateTimePickerModal
                    isVisible={endTimePickerVisible}
                    mode="time"
                    date={endTime}
                    onConfirm={(pickedTime) => {
                        const base = new Date(date);
                        base.setHours(
                            pickedTime.getHours(),
                            pickedTime.getMinutes(),
                            pickedTime.getSeconds()
                        );
                        setEndTime(base);
                        toggleEndTimePicker();
                    }}
                    onCancel={toggleEndTimePicker}
                />
            </View>

            <FormInput
                label="Duplicate"
                onChangeText={handleChange("duplicate")}
                value={duplicate}
                keyboardType="number-pad"
                collapsable
            />
            <View style={styles.buttonsContainer}>
                <Button active={!busy} onPress={handleSubmit}>
                    Create Trip
                </Button>
                <Button active={!busy} onPress={() => navigation.goBack()}>
                    Cancel
                </Button>
            </View>
        </View>
    );
};

export default TripForm;

const styles = StyleSheet.create({
    header: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
    },

    buttonsContainer: {
        marginTop: 20,
        gap: 15,
    },
    title: {
        fontSize: 18,
        color: "white",
        fontWeight: "600",
        marginVertical: 2,
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
