import React, {FC, useContext, useEffect, useState} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {LangContext, FriendRequestsContext, EventInvitationsContext} from "../../util/Context";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {Center, Icon, View} from "native-base";
import {headerStyle, tabBarStyle} from "../../style/theme";
import {CommunityScreen} from "../CommunityScreen";
import {HomeScreen} from "../HomeScreen";
import {SettingsScreen} from "../SettingsScreen";
import {getDatabase, onValue, ref} from "firebase/database";
import {getAuth} from "firebase/auth";
import {BadgeColor, BadgedElement} from "../../util/BadgedElement";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

TaskManager.defineTask("BACKGROUND_LOCATION_TASK", ({ data, error }) => {
    if (error) {
        return;
    }

    const coords = data["locations"][0]["coords"];
    console.log(coords["latitude"]);
    console.log(coords["longitude"]);
});

const Tab = createBottomTabNavigator();

export const AuthenticatedRoot: FC = (_) => {
    const {lang} = useContext(LangContext);
    const {tabBarBackground, activeColor, inactiveColor} = tabBarStyle;

    const [friendRequests, setFriendRequests] = useState<string[]>([]);
    const friendRequestsContext = {friendRequests: friendRequests};

    const [eventInvitations, setEventInvitations] = useState<string[]>([]);
    const eventInvitationsContext = {eventInvitations: eventInvitations};

    useEffect(() => {
        async function requestPermissions() {
            if ((await Location.requestForegroundPermissionsAsync()).granted && (await Location.requestBackgroundPermissionsAsync()).granted) {
                Location.startLocationUpdatesAsync("BACKGROUND_LOCATION_TASK");
            }
        }

        requestPermissions();
        const userRef = ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/friendRequests");
        return onValue(userRef, (snapshot) => {
            const value = snapshot.val();
            setFriendRequests(value ? Object.keys(value) : []);
        });
    }, []);

    useEffect(() => {
        const eventsRef = ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/events");
        return onValue(eventsRef, (snapshot) => {
            const value = snapshot.val();
            setEventInvitations(value ? Object.entries(value).filter(([_, status]) => status === false).map(([id]) => id) : []);
        });
    }, []);

    function getMenuIcon({focused, color, size}, route) {
        let iconName;
        let family: any = MaterialCommunityIcons;
        let badge: {text: string, color: BadgeColor} = null;

        switch (route.name) {
            case "community":
                iconName = focused ? "account" : "account-outline";
                badge = {text: friendRequests.length > 0 ? friendRequests.length.toString() : null, color: "red"};
                break;

            case "home":
                iconName = focused ? "home" : "home-outline";
                badge = {text: eventInvitations.length > 0 ? eventInvitations.length.toString() : null, color: "red"};
                break;

            case "settings":
                iconName = focused ? "md-settings-sharp" : "md-settings-outline";
                family = Ionicons;
                break;
        }

        const icon = <Icon as={family} name={iconName} color={color} size={size} />;

        if (badge) {
            return (
                <BadgedElement text={badge.text} color={badge.color}>
                    <Center w={10} h={10}>
                        {icon}
                    </Center>
                </BadgedElement>
            );
        }

        return icon;
    }

    return (
        <FriendRequestsContext.Provider value={friendRequestsContext}>
            <EventInvitationsContext.Provider value={eventInvitationsContext}>
                <Tab.Navigator
                    initialRouteName={"home"}
                    screenOptions={({route}) => ({
                        ...headerStyle,
                        tabBarIcon: (props) => getMenuIcon(props, route),
                        tabBarActiveTintColor: activeColor,
                        tabBarInactiveTintColor: inactiveColor,
                        tabBarShowLabel: false,
                        tabBarBackground: () => <View w={"100%"} h={"100%"} bg={tabBarBackground} />
                    })}
                >
                    <Tab.Screen name={"community"} component={CommunityScreen} options={{headerShown: false}} />
                    <Tab.Screen name={"home"} component={HomeScreen} options={{headerShown: false}} />
                    <Tab.Screen name={"settings"} component={SettingsScreen} options={{title: lang.screens.settings}} />
                </Tab.Navigator>
            </EventInvitationsContext.Provider>
        </FriendRequestsContext.Provider>
    );
};