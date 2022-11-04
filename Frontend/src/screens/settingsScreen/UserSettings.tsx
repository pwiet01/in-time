import React, {FC, useContext, useEffect, useState} from "react";
import {
    Center, FormControl,
    Icon,
    Image, Input,
    Text,
    useColorModeValue, useDisclose, useToast, useToken,
    View
} from "native-base";
import {getAuth, User} from "firebase/auth";
import {useAssets} from "expo-asset";
import {Feather, MaterialIcons} from "@expo/vector-icons";
import {LangContext} from "../../util/Context";
import {TouchableOpacity} from "react-native";
import * as Clipboard from 'expo-clipboard';
import {StandardDialog} from "../../util/StandardDialog";
import {protectedAsyncCall} from "../../util/Util";
import {updateDisplayName, updatePhotoURL} from "../../firebase/Users";

interface UserSettingsProps {
    [style: string]: any
}

export const UserSettings: FC<UserSettingsProps> = (props) => {
    const [user, setUser] = useState<User>(getAuth().currentUser);
    const {lang} = useContext(LangContext);

    const toast = useToast();

    const imgBgColor = useToken("colors", useColorModeValue("coolGray.300", "blueGray.500"));
    const [assets] = useAssets([require("../../../assets/default-user.png")]);

    const imgSize = 100;

    const editName = useDisclose();
    const [name, setName] = useState<string>("");

    const editPhoto = useDisclose();
    const [photo, setPhoto] = useState<string>("");

    useEffect(() => {
        setName("");
        setPhoto("");
    }, [editName.isOpen, editPhoto.isOpen]);

    async function copyUID() {
        await Clipboard.setStringAsync(user.uid);
        toast.show({description: lang.other.copied});
    }

    function getProfilePicture() {
        return (
            <TouchableOpacity style={{width: imgSize, height: imgSize, borderRadius: 50,
                borderWidth: 1, marginRight: 30, backgroundColor: imgBgColor, justifyContent: "center", alignItems: "center"}}
                onPress={editPhoto.onOpen}>
                {assets && <Image source={assets[0]} alt={""} w={"80%"} h={"80%"} borderRadius={100} position={"absolute"} />}
                {user.photoURL ? <Image source={{uri: user.photoURL}} alt={""} w={"100%"} h={"100%"} borderRadius={100} position={"absolute"} /> : <></>}
            </TouchableOpacity>
        );
    }

    function getOtherInformation() {
        const name = (
            <View marginBottom={4}>
                <TouchableOpacity style={{alignItems: "center", flexDirection: "row"}} onPress={editName.onOpen}>
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

    function getDialogs() {
        async function saveName() {
            if ((await protectedAsyncCall(() => updateDisplayName(name))).success) {
                editName.onClose();
                setUser(getAuth().currentUser);
            }
        }

        async function savePhoto() {
            if ((await protectedAsyncCall(() => updatePhotoURL(photo))).success) {
                editPhoto.onClose();
                setUser(getAuth().currentUser);
            }
        }

        return (
            <View>
                <StandardDialog title={lang.auth.editName} isOpen={editName.isOpen} onClose={editName.onClose}
                                onAccept={saveName} acceptDisabled={name.trim().length === 0}
                                content={
                                    <FormControl isInvalid={name.trim().length === 0} w={"90%"} alignSelf={"center"}>
                                        <Input value={name} onChangeText={setName} w={"100%"} placeholder={lang.auth.displayName} />
                                        <FormControl.ErrorMessage>
                                            {lang.auth.specifyName}
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                } />
                <StandardDialog title={lang.auth.editPhoto} isOpen={editPhoto.isOpen} onClose={editPhoto.onClose}
                                onAccept={savePhoto} acceptDisabled={photo.trim().length === 0}
                                content={
                                    <FormControl isInvalid={photo.trim().length === 0} w={"90%"} alignSelf={"center"}>
                                        <Input value={photo} onChangeText={setPhoto} w={"100%"} placeholder={lang.auth.photoURL} />
                                        <FormControl.ErrorMessage>
                                            {lang.auth.mustBeValidURL}
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                } />
            </View>
        );
    }

    return (
        <Center w={"100%"} h={100}>
            <View flexDir={"row"} justifyContent={"flex-start"} alignItems={"center"} w={"100%"} h={"100%"}>
                {getProfilePicture()}
                {getOtherInformation()}
            </View>
            {getDialogs()}
        </Center>
    );
}