import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import SearchInput from "@UI/form/SearchInput";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
    users: {
        _id: string;
        firstName: string;
        lastName: string;
        studentId: number;
    }[];
};

const UsersList = (props: Props) => {
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();
    const { users } = props;
    const [search, setSearch] = useState("");

    return (
        <Card style={styles.innerContainer}>
            <SearchInput
                label="Search by Name or Student ID"
                onChangeText={setSearch}
                placeholder="Type to search..."
            />
            {users.length > 0 &&
                users
                    .filter((user) => {
                        const searchLower = search.toLowerCase();
                        const fullName =
                            `${user.firstName} ${user.lastName}`.toLowerCase();
                        return (
                            fullName.includes(searchLower) ||
                            user.studentId.toString().includes(search)
                        );
                    })
                    .map((user) => (
                        <LightCard
                            key={user._id}
                            onPressHandler={() => {
                                navigation.navigate("User", { _id: user._id });
                            }}
                        >
                            <Text style={styles.nameText}>
                                {user.firstName.charAt(0).toUpperCase() +
                                    user.firstName.slice(1)}{" "}
                                {user.lastName}
                            </Text>
                            <Text style={styles.studentIdText}>
                                {user.studentId}
                            </Text>
                        </LightCard>
                    ))}
            {search.length > 0 &&
                users.filter((user) => {
                    const searchLower = search.toLowerCase();
                    const fullName =
                        `${user.firstName} ${user.lastName}`.toLowerCase();
                    return (
                        fullName.includes(searchLower) ||
                        user.studentId.toString().includes(search)
                    );
                }).length === 0 && (
                    <Text style={styles.noResultsText}>
                        No results found for "{search}"
                    </Text>
                )}
        </Card>
    );
};

export default UsersList;

const styles = StyleSheet.create({
    innerContainer: {
        gap: 15,
    },
    nameText: {
        fontSize: 24,
    },
    studentIdText: {
        fontSize: 16,
    },
    noResultsText: {
        textAlign: "center",
        fontSize: 16,
        color: "white",
        marginTop: 20,
    },
});
