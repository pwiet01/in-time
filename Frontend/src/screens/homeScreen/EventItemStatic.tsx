import React, {FC, useContext, useEffect, useState} from "react";
import {Center, Spinner, Text, useColorModeValue, View} from "native-base";
import {TouchableOpacity} from "react-native";
import {getStatus, InTimeEventGeneralInfo, statusColor} from "../../util/InTimeEvent";
import moment from "moment";
import {LangContext} from "../../util/Context";
import {getTimeString} from "../../util/UserUtils";

interface EventItemStaticProps {
    event: InTimeEventGeneralInfo,
    arrivalTime: number,
    onPress?: (id: string) => void
}

export const EventItemStatic: FC<EventItemStaticProps> = (props) => {
    const bgColor = useColorModeValue("coolGray.200", "blueGray.600");
    const statusBgColor = useColorModeValue("coolGray.100", "blueGray.700");

    const {lang} = useContext(LangContext);

    const [status, setStatus] = useState<{status: number, time: number}>(getStatus(props.event?.time, null));

    useEffect(() => {
        const timerId = setInterval(() => setStatus(getStatus(props.event?.time, props.arrivalTime)), 1000);
        return () => clearInterval(timerId);
    }, [props.event, props.arrivalTime]);

    function getStatusComponent() {
        return (
            <Center w={120} h={"100%"} rounded={"md"}>
                <Text color={statusColor[status.status]}>{lang.home.eventStatus[status.status]}</Text>
                {status.status > 0 &&
                    <Text color={status.time < 0 ? "emerald.500" : "danger.500"}>
                        {getTimeString(Math.abs(status.time))}
                    </Text>
                }
            </Center>
        );
    }

    function getInformation() {
        return (
            <View justifyContent={"center"} alignItems={"flex-start"} flex={1}>
                <Text fontSize={"lg"} isTruncated bold>{props.event.title || ""}</Text>
                <Text fontSize={"sm"} italic>{moment(props.event.time).format("L")}</Text>
                <Text fontSize={"xs"} italic>{moment(props.event.time).format("LT")}</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity style={{width: "100%", height: 100}} onPress={() => props.onPress(props.event.id)} disabled={!props.onPress}>
            <Center bgColor={bgColor} rounded={"xl"} padding={5} w={"100%"} h={"100%"}>
                {props.event ? <View flexDir={"row"} justifyContent={"flex-start"} alignItems={"center"} w={"100%"} h={"100%"}>
                    {getInformation()}
                    {getStatusComponent()}
                </View> : <Spinner size={"lg"} />}
            </Center>
        </TouchableOpacity>
    );
}