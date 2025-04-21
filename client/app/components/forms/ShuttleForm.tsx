import {
    NavigationProp,
    RouteProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import DropDown from "@UI/form/DropDown";
import FormInput from "@UI/form/FormInput";
import validate, { CreateShuttleSchema } from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";

interface Props {}

interface DriversRes {
    drivers: {
        _id: string;
        firstName: string;
        lastName: string;
        studentId: string;
    }[];
}

interface ShuttleRes {
    message: string;
}

const ShuttleForm: FC<Props> = () => {
    const { authClient } = useClient();
    const [busy, setBusy] = useState(false);
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();
    const [drivers, setDrivers] = useState<DriversRes["drivers"]>();
    const route = useRoute<RouteProp<AdminStackParamList, "CreateShuttle">>();
    const { shuttle } = route.params;

    const [shuttleInfo, setShuttleInfo] = React.useState({
        number: "",
        capacity: "",
        driver: "",
    });
    const { number, capacity } = shuttleInfo;

    const handleChange = (key: string) => (text: string) => {
        setShuttleInfo({ ...shuttleInfo, [key]: text });
    };

    const handleSubmit = async () => {
        const { values, error } = await validate(
            CreateShuttleSchema,
            shuttleInfo
        );
        if (error) return showMessage({ message: error, type: "danger" });

        setBusy(true);

        // If editing, update the shuttle
        if (shuttle) {
            const res = await runAxiosAsync<ShuttleRes>(
                authClient.patch(`/shuttle/${shuttle._id}`, values)
            );

            if (res?.message) {
                showMessage({ message: res.message, type: "success" });
                navigation.goBack();
            }
            setBusy(false);
            return;
        }

        const res = await runAxiosAsync<ShuttleRes>(
            authClient.post("/shuttle/create", values)
        );

        if (res?.message) {
            showMessage({ message: res.message, type: "success" });
            navigation.goBack();
        }
        setBusy(false);
    };

    useEffect(() => {
        const fetchDrivers = async () => {
            const res = await runAxiosAsync<DriversRes>(
                authClient.get("/profile/possible-drivers")
            );
            if (res?.drivers) setDrivers(res.drivers);
        };
        fetchDrivers();

        if (shuttle) {
            setShuttleInfo({
                number: shuttle.number.toString(),
                capacity: shuttle.capacity.toString(),
                driver: shuttle.driver._id,
            });
        }
    }, []);

    // Build driverList and ensure the shuttle’s driver (when editing) is included
    const driverList = [
        // If editing, prepend the shuttle’s current driver when not in fetched drivers
        ...(shuttle &&
        shuttle.driver &&
        !drivers?.some((d) => d._id === shuttle.driver._id)
            ? [
                  {
                      label: `${shuttle.driver.firstName} ${shuttle.driver.lastName}`,
                      value: shuttle.driver._id,
                  },
              ]
            : []),
        // Then append all fetched drivers
        ...(drivers?.map((driver) => ({
            label: `${driver.firstName} ${driver.lastName}`,
            value: driver._id,
        })) ?? []),
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                {shuttle ? "Update Shuttle" : "Create Shuttle"}
            </Text>
            <FormInput
                label="Number"
                onChangeText={handleChange("number")}
                value={number}
                collapsable
            />
            <FormInput
                label="Capacity"
                onChangeText={handleChange("capacity")}
                value={capacity}
                collapsable
            />
            <DropDown
                data={driverList} // now includes shuttle’s driver if in edit mode
                onChange={handleChange("driver")}
                placeholder="Select Driver"
                label="Driver"
                value={shuttleInfo.driver}
            />
            <View style={styles.buttonsContainer}>
                <Button active={!busy} onPress={handleSubmit}>
                    {shuttle ? "Update Shuttle" : "Create Driver"}
                </Button>

                <Button active={!busy} onPress={() => navigation.goBack()}>
                    Cancel
                </Button>
            </View>
        </View>
    );
};

export default ShuttleForm;

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBottom: 30,
    },
    header: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
    },
    buttonsContainer: {
        marginTop: 20,
        gap: 15,
    },
});
