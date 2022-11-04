import React, {FC, useContext} from "react";
import {NavScreen} from "../util/NavScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {UserList} from "./communityScreen/UserList";
import {LangContext} from "../util/Context";
import {headerStyle} from "../style/theme";
import {SearchUser} from "./communityScreen/SearchUser";
import {FriendRequests} from "./communityScreen/FriendRequests";

const Stack = createNativeStackNavigator();

export const CommunityScreen: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);

    return (
        <Stack.Navigator screenOptions={{
            ...headerStyle,

        }}>
            <Stack.Screen name={"users"} component={UserList} options={{title: lang.screens.community}} />
            <Stack.Screen name={"search-user"} component={SearchUser} options={{title: lang.community.search}} />
            <Stack.Screen name={"friend-requests"} component={FriendRequests} options={{title: lang.community.friendRequests}} />
        </Stack.Navigator>
    );
};