import React, {FC, useContext, useEffect, useMemo, useRef, useState} from "react";
import {NavScreen} from "../../util/NavScreen";
import {UsersContext} from "../../util/Context";
import {Center, ScrollView, Text, useColorModeValue, useContrastText, View} from "native-base";
import {getRank, getTimeString} from "../../util/UserUtils";
import {getAuth} from "firebase/auth";
import {CustomUser} from "../../util/CustomUser";
import {getDatabase, onValue, ref} from "firebase/database";
import {LoadingScreen} from "../../util/LoadingScreen";

export const Leaderboard: FC<NavScreen> = (props) => {
    const {friends} = useContext(UsersContext);
    const me = getAuth().currentUser.uid;
    const iconColor = useContrastText(useColorModeValue("coolGray.50", "blueGray.800"));

    const initialUsers = useRef<{[uid: string]: CustomUser}>({});
    const allUsersLoaded = useRef(false);
    const [users, setUsers] = useState<{[uid: string]: CustomUser}>(null);

    const unsubscribeCallbacks = useRef<any[]>([]);

    useEffect(() => {
        for (const uid of [me, ...friends]) {
            const userRef = ref(getDatabase(), "users/" + uid + "/general");

            const unsubscribe = onValue(userRef, (snapshot) => {
                const value = snapshot.val();

                if (!allUsersLoaded.current) {
                    initialUsers.current[uid] = value ? {...value, uid: uid} : null;
                    if (Object.keys(initialUsers.current).length === friends.length + 1) {
                        setUsers(initialUsers.current);
                        allUsersLoaded.current = true;
                    }
                } else {
                    if (value) {
                        setUsers((prev) => ({...prev, [uid]: {...value, uid: uid}}));
                    }
                }
            });

            unsubscribeCallbacks.current.push(unsubscribe);
        }

        return () => {
            unsubscribeCallbacks.current.forEach((unsubscribe) => unsubscribe());
            unsubscribeCallbacks.current = [];
            initialUsers.current = {};
            allUsersLoaded.current = false;
        };
    }, [friends]);

    const sortedUsers = useMemo(() => {
        if (!users) {
            return null;
        }

        const sorted = Object.values(users);
        sorted.sort((a, b) => a.time - b.time);
        return sorted;
    }, [users]);

    function renderUser(user: CustomUser, pos: number) {
        return (
            <View key={user.uid} flexDir={"row"} w={"100%"} padding={1} marginBottom={1} rounded={"md"}
                  borderColor={"gold"} borderWidth={user.uid === me ? 1 : 0}>
                <Text maxW={"50%"} isTruncated marginRight={2}>{`${pos}. ${user.displayName}:`}</Text>
                <Text color={"danger.500"}>{getTimeString(user.time)}</Text>
                <Text marginLeft={2} marginRight={2}>{"\u00b7"}</Text>
                {getRank(user.time, iconColor)}
            </View>
        );
    }

    if (!sortedUsers) {
        return <LoadingScreen />;
    }

    return (
        <Center w={"100%"} h={"100%"} padding={5}>
            <ScrollView w={"100%"} h={"100%"}>
                {sortedUsers.filter((user) => user != null).map((user, index) => renderUser(user, index + 1))}
            </ScrollView>
        </Center>
    );
}