import React, {FC, useContext, useRef, useState} from "react";
import {NavScreen} from "../../util/NavScreen";
import {Center, Heading, Input, useToast, View} from "native-base";
import {AsyncButton} from "../../util/AsyncButton";
import {LangContext} from "../../util/Context";
import {CustomUser} from "../../util/CustomUser";
import {protectedAsyncCall} from "../../util/Util";
import {addFriend, getUsers} from "../../firebase/Users";
import {UserProfileStatic} from "./UserProfileStatic";
import {getAuth} from "firebase/auth";

export const SearchUser: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);

    const [uid, setUid] = useState<string>("");
    const [users, setUsers] = useState<CustomUser[]>([]);

    const toast = useToast();

    async function handleSearch() {
        const users = await protectedAsyncCall(() => getUsers(uid));
        if (users.success) {
            setUsers(users.data);
        }
    }

    async function handleAdd(user: CustomUser) {
        if (user.uid === getAuth().currentUser.uid) {
            toast.show({description: lang.community.itsYou});
        } else {
            await protectedAsyncCall(() => addFriend(user.uid), null, lang.community.requestSent);
        }
    }

    return (
        <Center w={"100%"} h={"100%"}>
            <View w={"80%"} alignItems={"flex-start"}>
                <Heading marginBottom={5}>{lang.community.searchUser}</Heading>
                <View w={"100%"} flexDir={"row"} alignItems={"center"} marginBottom={5}>
                    <Input placeholder={lang.community.uidOrName} value={uid} onChangeText={setUid} marginRight={2} flex={1} autoCapitalize={"none"} />
                    <AsyncButton onPress={handleSearch}>{lang.community.search}</AsyncButton>
                </View>
                {users.map(user => (
                    <View marginBottom={1} key={user.uid}>
                        <UserProfileStatic user={user} onPress={handleAdd} />
                    </View>
                ))}
            </View>
        </Center>
    );
}