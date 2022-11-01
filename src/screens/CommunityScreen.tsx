import React, {FC, useContext, useEffect, useState} from "react";
import {NavScreen} from "../util/NavScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {UserList} from "./communityScreen/UserList";
import {LangContext} from "../util/Context";
import {Leaderboard} from "./communityScreen/Leaderboard";
import {UsersContext} from "../util/Context";
import {headerStyle} from "../style/theme";
import {getDatabase, onValue, ref} from "firebase/database";
import {getAuth} from "firebase/auth";
import {SearchUser} from "./communityScreen/SearchUser";
import {FriendRequests} from "./communityScreen/FriendRequests";

const Stack = createNativeStackNavigator();

export const CommunityScreen: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);

    const [friends, setFriends] = useState<string[]>([]);
    const context = {friends: friends};

    useEffect(() => {
        const userRef = ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/friends");
        return onValue(userRef, (snapshot) => {
            const value = snapshot.val();
            setFriends(value ? Object.keys(value) : []);
        });
    }, []);

    return (
        <UsersContext.Provider value={context}>
            <Stack.Navigator screenOptions={{
                ...headerStyle,

            }}>
                <Stack.Screen name={"users"} component={UserList} options={{title: lang.screens.community}} />
                <Stack.Screen name={"leaderboard"} component={Leaderboard} options={{title: lang.community.leaderboard}} />
                <Stack.Screen name={"search-user"} component={SearchUser} options={{title: lang.community.search}} />
                <Stack.Screen name={"friend-requests"} component={FriendRequests} options={{title: lang.community.friendRequests}} />
            </Stack.Navigator>
        </UsersContext.Provider>
    );
};