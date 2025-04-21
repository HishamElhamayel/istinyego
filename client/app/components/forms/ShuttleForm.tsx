import { NavigationProp, useNavigation } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import DropDown from "@UI/form/DropDown";
import FormInput from "@UI/form/FormInput";
import validate, {
    CreateDriverSchema,
    CreateShuttleSchema,
} from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
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
    }, []);

    return (
        <View style={{ gap: 15, marginBottom: 30 }}>
            <Text style={styles.header}>Create Driver</Text>
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
                data={
                    drivers?.map((driver) => ({
                        label: `${driver.firstName} ${driver.lastName}`,
                        value: driver._id,
                    })) || []
                }
                onChange={handleChange("driver")}
                placeholder="Select Driver"
                label="Driver"
            />
            <Button active={!busy} onPress={handleSubmit}>
                Create Shuttle
            </Button>

            <Button active={!busy} onPress={() => navigation.goBack()}>
                Cancel
            </Button>
        </View>
    );
};

export default ShuttleForm;

const styles = StyleSheet.create({
    header: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
    },
});
