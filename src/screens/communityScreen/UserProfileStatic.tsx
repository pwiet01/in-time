import React, {FC} from "react";
import {Center, Image, Pressable, Spinner, Text, useColorModeValue, useContrastText, View} from "native-base";
import {useAssets} from "expo-asset";
import {getRank, getTimeString} from "../../util/UserUtils";
import {CustomUser} from "../../util/CustomUser";
import {getAuth} from "firebase/auth";
import {TouchableOpacity} from "react-native";
import {BadgedElement} from "../../util/BadgedElement";

interface UserProfileStaticProps {
    user: CustomUser,
    isMe?: boolean,
    isOnline?: boolean,
    onPress: (user: CustomUser) => void
}

export const UserProfileStatic: FC<UserProfileStaticProps> = (props) => {
    const bgColor = useColorModeValue("coolGray.200", "blueGray.600");
    const imgBgColor = useColorModeValue("coolGray.300", "blueGray.500");
    const iconColor = useContrastText(bgColor);
    const [assets] = useAssets([require("../../../assets/default-user.png")]);

    const imgSize = props.isMe ? 100 : 60;

    function getProfilePicture() {
        return (
            <BadgedElement text={props.isOnline ? "" : null} color={"green"} offsetX={"20%"} offsetY={"5%"}>
                <Center w={imgSize} h={imgSize} bg={imgBgColor} borderRadius={50} borderWidth={1} marginRight={5}>
                    {assets && <Image source={assets[0]} alt={""} w={"80%"} h={"80%"} borderRadius={100} position={"absolute"} />}
                    {props.user.photoURL ? <Image source={{uri: props.user.photoURL}} alt={""} w={"100%"} h={"100%"} borderRadius={100} position={"absolute"} /> : <></>}
                </Center>
            </BadgedElement>
        );
    }

    function getOtherInformation() {
        const name = (
            <View marginBottom={2}>
                <Text fontSize={"lg"} isTruncated bold>{props.user.displayName || ""}</Text>
                {props.isMe && <Text fontSize={"xs"} fontStyle={"italic"} isTruncated>{getAuth().currentUser.email || ""}</Text>}
            </View>
        );

        const time = (
            <View flexDir={"row"} alignItems={"center"}>
                <Text color={"danger.500"}>{getTimeString(props.user.time)}</Text>
                <Text marginLeft={2} marginRight={2}>{"\u00b7"}</Text>
                {getRank(props.user.time, iconColor)}
            </View>
        );

        return (
            <View justifyContent={"center"} alignItems={"flex-start"} flex={1}>
                {name}
                {time}
            </View>
        );
    }

    return (
        <TouchableOpacity style={{width: "100%", height: props.isMe ? 150 : 100}} onPress={() => props.onPress(props.user)} disabled={props.isMe}>
            <Center bgColor={bgColor} rounded={"xl"} padding={5} w={"100%"} h={"100%"} borderColor={"gold"} borderWidth={props.isMe ? 2 : 0}>
                {props.user ? <View flexDir={"row"} justifyContent={"flex-start"} alignItems={"center"} w={"100%"} h={"100%"}>
                    {getProfilePicture()}
                    {getOtherInformation()}
                </View> : <Spinner size={"lg"} />}
            </Center>
        </TouchableOpacity>
    );
}