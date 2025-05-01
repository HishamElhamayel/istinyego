import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type Props = {
    data: { label: string; value: string }[];
    onChange: (value: string) => void;
    placeholder: string;
    label: string;
    value?: string | null;
};

const DropDown = (props: Props) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [value, setValue] = useState<string | null>(props.value || null);

    useEffect(() => {
        if (props.value) {
            setValue(props.value);
        }
    }, [props.value]);

    return (
        <View>
            <Text style={styles.label}>{props.label}</Text>

            <Dropdown
                data={props.data}
                style={[
                    styles.dropdown,
                    isFocused ? styles.borderActive : styles.borderInActive,
                ]}
                mode="auto"
                onChange={(item) => {
                    setValue(item.value);
                    props.onChange(item.value);
                }}
                labelField="label"
                valueField="value"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={props.placeholder}
                search
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                containerStyle={styles.containerStyle}
                itemContainerStyle={styles.itemContainerStyle}
                value={value}
            />
        </View>
    );
};

export default DropDown;

const styles = StyleSheet.create({
    dropdown: {
        padding: 10,
        borderRadius: 8,
    },
    placeholderStyle: {
        fontSize: 20,
        color: "white",
    },
    selectedTextStyle: {
        fontSize: 20,
        color: "white",
    },
    label: {
        color: "white",
        marginBottom: 5,
        fontSize: 18,
    },
    borderActive: {
        borderColor: "#FFFFFF",
        borderWidth: 1,
    },
    borderInActive: {
        borderColor: "#CCCCCC",
        borderWidth: 1,
    },
    inputSearchStyle: {
        borderRadius: 8,
        backgroundColor: "white",
        borderColor: "grey",
    },
    containerStyle: {
        backgroundColor: "#edeef0",
        borderRadius: 8,
        padding: 10,
    },
    itemContainerStyle: {
        backgroundColor: "white",
        borderRadius: 8,
        borderColor: "grey",
        borderWidth: 1,
        marginVertical: 4,
    },
});
