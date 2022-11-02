import {Icon, Text, View} from "native-base";
import {FontAwesome5} from "@expo/vector-icons";
import React from "react";

export function getTimeString(time: number): string {
    if (!time) {
        return "00:00:00";
    }

    const seconds = (time % 60).toString().padStart(2, "0");

    time = Math.floor(time / 60);
    const minutes = (time % 60).toString().padStart(2, "0");

    time = Math.floor(time / 60);
    const hours = time.toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
}

export function getRank(time: number, color: string): JSX.Element {
    if (time == null) {
        return <></>;
    }

    return (
        <View flexDir={"row"} alignItems={"center"} flex={1}>
            <Icon as={FontAwesome5} name={"chess-knight"} color={color} size={3} marginRight={1} />
            <Text isTruncated>Rang</Text>
        </View>
    );
}