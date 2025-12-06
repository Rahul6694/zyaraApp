import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const CustomSwitch = ({
    value = false,
    onValueChange = () => {},
    activeColor = "#00B272",
    inActiveColor = "#D3D3D3",
    size = 40,
}) => {

    const trackWidth = size * 1;      // perfect width
    const trackHeight = size * 0.55;    // perfect height
    const circleSize = trackHeight - 4; // perfect circle

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onValueChange(!value)}
            style={{ transform: [{ rotate: "-180deg" }] }}
        >
            <View
                style={[
                    styles.switchContainer,
                    {
                        width: trackWidth,
                        height: trackHeight,
                        backgroundColor: value ? inActiveColor :activeColor,
                    },
                ]}
            >
                <View
                    style={[
                        styles.circle,
                        {
                            width: circleSize,
                            height: circleSize,
                            left: value
                                ? trackWidth - circleSize - 2
                                : 2,
                        },
                    ]}
                />
            </View>
        </TouchableOpacity>
    );
};

export default CustomSwitch;

const styles = StyleSheet.create({
    switchContainer: {
        borderRadius: 50,
        justifyContent: "center",
        position: "relative",
    },
    circle: {
        backgroundColor: "#fff",
        borderRadius: 50,
        position: "absolute",
        top: 2,
    },
});
