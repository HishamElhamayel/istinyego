import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "@utils/colors";
import { DateTime } from "luxon";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";

type Props = {
    date: Date;
    setParentDate: Dispatch<SetStateAction<Date>>;
};

const DatePicker = ({ date, setParentDate }: Props) => {
    // const [date, setDate] = useState<Date>(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    const ChangeDate = (direction: "back" | "forward") => {
        if (direction === "back") {
            const newDate = new Date(date);
            newDate.setDate(date.getDate() - 1);
            setParentDate(newDate);
        } else {
            const newDate = new Date(date);
            newDate.setDate(date.getDate() + 1);
            setParentDate(newDate);
        }
    };

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
                            }}
                        />
                    </View>
                </View>
            </Modal>

            <View style={styles.container}>
                <Pressable
                    onPress={() => ChangeDate("back")}
                    style={({ pressed }) => [pressed && styles.pressed]}
                >
                    <Ionicons
                        name="chevron-back-sharp"
                        size={36}
                        color="black"
                    />
                </Pressable>
                <Pressable onPress={() => setShowCalendar(true)}>
                    <Text style={styles.dateText}>
                        {DateTime.fromJSDate(date).toFormat("ccc dd MMMM")}
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => ChangeDate("forward")}
                    style={({ pressed }) => [pressed && styles.pressed]}
                >
                    <Ionicons
                        name="chevron-forward-sharp"
                        size={36}
                        color="black"
                    />
                </Pressable>
            </View>
        </>
    );
};

export default DatePicker;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dateText: {
        fontSize: 24,
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
    pressed: {
        opacity: 0.5,
    },
});
