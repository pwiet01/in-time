import React, {FC, useContext} from "react";
import {NavScreen} from "../util/NavScreen";
import {LangContext} from "../util/Context";
import {headerStyle} from "../style/theme";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {EventList} from "./homeScreen/EventList";
import {NewEventScreen} from "./homeScreen/NewEventScreen";
import {EventScreen} from "./homeScreen/EventScreen";
import {InviteUsersScreen} from "./homeScreen/InviteUsersScreen";
import {EventInvitationsScreen} from "./homeScreen/EventInvitationsScreen";

const Stack = createNativeStackNavigator();

export const HomeScreen: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);

    return (
        <Stack.Navigator screenOptions={{
            ...headerStyle,

        }}>
            <Stack.Screen name={"events"} component={EventList} options={{title: lang.screens.home}} />
            <Stack.Screen name={"new-event"} component={NewEventScreen} options={{title: lang.home.newEvent}} />
            <Stack.Screen name={"event-screen"} component={EventScreen} options={{title: lang.home.event}} />
            <Stack.Screen name={"invite-users"} component={InviteUsersScreen} options={{title: lang.home.inviteUsers}} />
            <Stack.Screen name={"event-invitations"} component={EventInvitationsScreen} options={{title: lang.home.eventInvitations}} />
        </Stack.Navigator>
    );
};