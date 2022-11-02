import React, {FC, useContext} from "react";
import {
    Center,
    Icon,
    Image,
    Text,
    useColorModeValue, useToast, useToken,
    View
} from "native-base";
import {getAuth} from "firebase/auth";
import {useAssets} from "expo-asset";
import {Feather, MaterialIcons} from "@expo/vector-icons";
import {LangContext} from "../../util/Context";
import {TouchableOpacity} from "react-native";
import * as Clipboard from 'expo-clipboard';

interface UserSettingsProps {
    [style: string]: any
}

export const UserSettings: FC<UserSettingsProps> = (props) => {
    const user = getAuth().currentUser;
    const {lang} = useContext(LangContext);

    const toast = useToast();

    const imgBgColor = useToken("colors", useColorModeValue("coolGray.300", "blueGray.500"));
    const [assets] = useAssets([require("../../../assets/default-user.png")]);

    const imgSize = 100;

    async function copyUID() {
        await Clipboard.setStringAsync(user.uid);
        toast.show({description: lang.other.copied});
    }

    function getProfilePicture() {
        return (
            <TouchableOpacity style={{width: imgSize, height: imgSize, borderRadius: 50,
                borderWidth: 1, marginRight: 30, backgroundColor: imgBgColor, justifyContent: "center", alignItems: "center"}}>
                {assets && <Image source={assets[0]} alt={""} w={"80%"} h={"80%"} borderRadius={100} position={"absolute"} />}
                {user.photoURL ? <Image source={{uri: user.photoURL}} alt={""} w={"100%"} h={"100%"} borderRadius={100} position={"absolute"} /> : <></>}
            </TouchableOpacity>
        );
    }

    function getOtherInformation() {
        const name = (
            <View marginBottom={4}>
                <TouchableOpacity style={{alignItems: "center", flexDirection: "row"}}>
                    <Text fontSize={"2xl"} isTruncated bold marginRight={2}>{user.displayName || ""}</Text>
                    <Icon as={MaterialIcons} name={"edit"} size={"md"} />
                </TouchableOpacity>
                <Text fontSize={"xs"} fontStyle={"italic"} isTruncated>{user.email || ""}</Text>
            </View>
        );

        const uid = (
            <TouchableOpacity style={{alignItems: "center", flexDirection: "row"}} onPress={copyUID}>
                <Text fontSize={"xs"} marginRight={2}>{lang.community.uid}</Text>
                <Icon as={Feather} name={"copy"} size={"sm"} />
            </TouchableOpacity>
        );

        return (
            <View justifyContent={"center"} alignItems={"flex-start"} flex={1}>
                {name}
                {uid}
            </View>
        );
    }

    return (
        <Center w={"100%"} h={100}>
            <View flexDir={"row"} justifyContent={"flex-start"} alignItems={"center"} w={"100%"} h={"100%"}>
                {getProfilePicture()}
                {getOtherInformation()}
            </View>
        </Center>
    );
}