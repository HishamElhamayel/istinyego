import colors from "@utils/colors";
import { DateTime } from "luxon";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import {
    Modal,
    Pressable,
    PressableProps,
    StyleSheet,
    Text,
    View,
} from "react-native";
import DateTimePicker from "react-native-ui-datepicker";

interface props extends PressableProps {
    label: string;
    setParentDate: Dispatch<SetStateAction<Date>>;
}

const DateInput: FC<props> = ({ label, setParentDate }) => {
    const [date, setDate] = useState<Date>(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showCalendar}
            >
                <View style={styles.dateContainer}>
                    <View style={styles.innerDateContainer}>
                        <DateTimePicker
                            mode="single"
                            date={date}
                            onChange={({ date }) => {
                                const selectedDate = new Date(
                                    date?.valueOf() ||
                                        DateTime.now().toSeconds()
                                );

                                setDate(selectedDate);
                                setParentDate(selectedDate);
                                setShowCalendar(false);
                            }}
                            styles={{
                                today: {
                                    borderColor: colors.primary100,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                }, // Add a border to today's date
                                selected: {
                                    backgroundColor: colors.primary100,
                                    borderRadius: 10,
                                }, // Highlight the selected day
                                selected_label: { color: "white" },
                                selected_month: {
                                    borderRadius: 10,
                                    backgroundColor: colors.primary100,
                                },
                                selected_month_label: {
                                    color: "white",
                                },
                                selected_year: {
                                    borderRadius: 10,
                                    backgroundColor: colors.primary100,
                                },
                                selected_year_label: {
                                    color: "white",
                                },
                                button_next: {
                                    borderRadius: 5,
                                    backgroundColor: "white",
                                },
                                button_prev: {
                                    borderRadius: 5,
                                    backgroundColor: "white",
                                },
                            }}
                        />
                    </View>
                </View>
            </Modal>

            <Pressable
                style={styles.container}
                onPress={() => setShowCalendar(true)}
            >
                <Text style={styles.label}>{label}</Text>
                <View style={styles.dateBox}>
                    <Text style={styles.date}>
                        {DateTime.fromJSDate(date).toFormat("yyyy LL dd")}
                    </Text>
                </View>
            </Pressable>
        </>
    );
};

export default DateInput;

const styles = StyleSheet.create({
    container: {
        // marginBottom: 15,
        flex: 1,
    },
    label: {
        color: "white",
        marginBottom: 5,
    },
    dateBox: {
        borderRadius: 8,
        fontSize: 20,
        borderWidth: 1,
        borderColor: "#CCCCCC",
    },
    dateContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    innerDateContainer: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 20,
        width: "90%",
    },
    date: {
        color: "white",
        padding: 10,
        fontSize: 20,
    },
});
