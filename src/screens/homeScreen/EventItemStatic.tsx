import React, {FC} from "react";
import {Center, Spinner, Text, useColorModeValue, View} from "native-base";
import {TouchableOpacity} from "react-native";
import {InTimeEvent} from "../../util/InTimeEvent";

interface EventItemStaticProps {
    event: InTimeEvent
}

export const EventItemStatic: FC<EventItemStaticProps> = (props) => {
    const bgColor = useColorModeValue("coolGray.200", "blueGray.600");

    function getInformation() {
        return (
            <View justifyContent={"center"} alignItems={"flex-start"} flex={1}>
                <Text fontSize={"lg"} isTruncated bold>{props.event.title || ""}</Text>
                <Text fontSize={"sm"} italic>Montag, 29. August 2022</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity style={{width: "100%", height: 100}} onPress={() => {}}>
            <Center bgColor={bgColor} rounded={"xl"} padding={5} w={"100%"} h={"100%"}>
                {props.event ? <View flexDir={"row"} justifyContent={"flex-start"} alignItems={"center"} w={"100%"} h={"100%"}>
                    {getInformation()}
                </View> : <Spinner size={"lg"} />}
            </Center>
        </TouchableOpacity>
    );
}