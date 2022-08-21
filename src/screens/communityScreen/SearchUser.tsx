import React, {FC, useContext, useState} from "react";
import {NavScreen} from "../../util/NavScreen";
import {ScreenWrapper} from "../../util/ScreenWrapper";
import {Center, Heading, Input, useToast, View} from "native-base";
import {AsyncButton} from "../../util/AsyncButton";
import {LangContext} from "../../util/Context";
import {CustomUser} from "../../util/CustomUser";
import {protectedAsyncCall} from "../../util/Util";
import {addFriend, getUser} from "../../firebase/Users";
import {UserProfileStatic} from "./UserProfileStatic";
import {getAuth} from "firebase/auth";

export const SearchUser: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);

    const [uid, setUid] = useState<string>("");
    const [user, setUser] = useState<CustomUser>(null);

    const toast = useToast();

    async function handleSearch() {
        const user = await protectedAsyncCall(getUser, uid);
        if (user != null) {
            setUser(user);
        }
    }

    async function handleAdd() {
        try {
            if (user.uid === getAuth().currentUser.uid) {
                toast.show({description: lang.community.itsYou});
            } else {
                await addFriend(user.uid);
                toast.show({description: lang.community.requestSent});
            }
        } catch (e) {
            console.log(e);
            toast.show({description: e.code});
        }
    }

    return (
        <ScreenWrapper>
            <Center w={"100%"} h={"100%"}>
                <View w={"80%"} alignItems={"flex-start"}>
                    <Heading marginBottom={5}>{lang.community.searchUser}</Heading>
                    <View w={"100%"} flexDir={"row"} alignItems={"center"} marginBottom={5}>
                        <Input placeholder={lang.community.uid} value={uid} onChangeText={setUid} marginRight={2} flex={1} autoCapitalize={"none"} />
                        <AsyncButton onPress={handleSearch}>{lang.community.search}</AsyncButton>
                    </View>
                    {user && <UserProfileStatic user={user} onPress={handleAdd} />}
                </View>
            </Center>
        </ScreenWrapper>
    );
}