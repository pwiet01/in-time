import React, {FC, useContext, useEffect, useState} from "react";
import {CustomUser} from "../../util/CustomUser";
import {Center, Image, Spinner, Text, useColorModeValue, View} from "native-base";
import {useAssets} from "expo-asset";
import {getTimeString} from "../../util/UserUtils";
import {TouchableOpacity} from "react-native";
import {getStatus, Participant, statusColor} from "../../util/InTimeEvent";
import {LangContext} from "../../util/Context";

interface ParticipantItemStaticProps {
    eventTime: number,
    user: CustomUser,
    participant: Participant,
    isMe?: boolean,
    disabled?: boolean,
    onPress: (user: CustomUser) => void
}

export const ParticipantItemStatic: FC<ParticipantItemStaticProps> = (props) => {
    const bgColor = useColorModeValue("coolGray.200", "blueGray.600");
    const imgBgColor = useColorModeValue("coolGray.300", "blueGray.500");
    const [assets] = useAssets([require("../../../assets/default-user.png")]);
    const {lang} = useContext(LangContext);

    const imgSize = 60;

    const [status, setStatus] = useState<{status: number, time: number}>(getStatus(props.eventTime, props.participant.arrivalTime));

    useEffect(() => {
        const timerId = setInterval(() => setStatus(getStatus(props.eventTime, props.participant.arrivalTime)), 1000);
        return () => clearInterval(timerId);
    }, [props.eventTime, props.participant.arrivalTime]);

    function getProfilePicture() {
        return (
            <Center w={imgSize} h={imgSize} bg={imgBgColor} borderRadius={50} borderWidth={1} marginRight={5}>
                {assets && <Image source={assets[0]} alt={""} w={"80%"} h={"80%"} borderRadius={100} position={"absolute"} />}
                {props.user.photoURL ? <Image source={{uri: props.user.photoURL}} alt={""} w={"100%"} h={"100%"} borderRadius={100} position={"absolute"} /> : <></>}
            </Center>
        );
    }

    function getOtherInformation() {
        const name = (
            <Text fontSize={"lg"} isTruncated bold>{props.user.displayName || ""}</Text>
        );

        const statusText = (
            <View flexDir={"row"} alignItems={"center"}>
                <Text color={statusColor[status.status]}>{lang.home.eventStatus[status.status]}</Text>
                <Text marginLeft={2} marginRight={2}>{"\u00b7"}</Text>
                <Text color={status.time < 0 ? "emerald.500" : "danger.500"}>
                    {getTimeString(Math.abs(status.time))}
                </Text>
            </View>
        );

        return (
            <View justifyContent={"center"} alignItems={"flex-start"} flex={1}>
                {name}
                {props.participant.arrivalTime && status.status > 1 && statusText}
            </View>
        );
    }

    return (
        <TouchableOpacity style={{width: "100%", height: 80}} onPress={() => props.onPress(props.user)} disabled={props.isMe || props.disabled}>
            <Center bgColor={bgColor} rounded={"xl"} padding={5} w={"100%"} h={"100%"} borderColor={"gold"} borderWidth={props.isMe ? 2 : 0}>
                {props.user && status ? <View flexDir={"row"} justifyContent={"flex-start"} alignItems={"center"} w={"100%"} h={"100%"}>
                    {getProfilePicture()}
                    {getOtherInformation()}
                </View> : <Spinner size={"lg"} />}
            </Center>
        </TouchableOpacity>
    );
}