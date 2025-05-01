import LottieView from "lottie-react-native";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";

type Props = {
    visible: boolean;
};

const LoadingAnimation = ({ visible }: Props) => {
    if (!visible) return null;
    return (
        <Modal animationType="fade">
            <View style={styles.container}>
                <LottieView
                    source={require("../../../assets/IstinyeGo_Loading.json")}
                    autoPlay
                    loop
                    style={{ flex: 1 }}
                />
            </View>
        </Modal>
    );
};

export default LoadingAnimation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
