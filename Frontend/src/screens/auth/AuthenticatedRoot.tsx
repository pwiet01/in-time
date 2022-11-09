import React, {FC, useContext, useEffect, useState} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {EventInvitationsContext, FriendRequestsContext, LangContext} from "../../util/Context";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {Center, Icon, View} from "native-base";
import {headerStyle, tabBarStyle} from "../../style/theme";
import {CommunityScreen} from "../CommunityScreen";
import {HomeScreen} from "../HomeScreen";
import {SettingsScreen} from "../SettingsScreen";
import {get, getDatabase, onValue, ref, set} from "firebase/database";
import {getAuth} from "firebase/auth";
import {BadgeColor, BadgedElement} from "../../util/BadgedElement";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {getDistanceFromLatLon, getStorageEvents, setStorageEvents} from "../../util/Util";
import {LatLng} from "react-native-maps";
import {eventConfig} from "../../util/InTimeEvent";
import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import {registerForPushNotificationsAsync} from "../../util/SetupPushNotifications";

async function checkEvents(myCoords: LatLng) {
    for (const event of await getStorageEvents()) {
        if (Math.floor((Date.now() - event.time) / 1000) > eventConfig.earliestArrival &&
            getDistanceFromLatLon(myCoords.latitude, myCoords.longitude, event.location.latitude, event.location.longitude) < 100) {

            try {
                const arrivalTimeRef = ref(getDatabase(), "events/" + event.id + "/participants/" + getAuth().currentUser.uid + "/arrivalTime");
                if ((await get(ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/events/" + event.id))).val() === true &&
                    (await get(arrivalTimeRef)).val() == null) {
                    await set(arrivalTimeRef, Date.now());
                }

                const storageEvents = await getStorageEvents();
                await setStorageEvents(storageEvents.filter(otherEvent => event.id !== otherEvent.id));
            } catch (e) {
                console.log(e);
            }
        }
    }
}

TaskManager.defineTask("BACKGROUND_LOCATION_TASK", ({ data, error }) => {
    if (error || !getAuth().currentUser) {
        return;
    }

    checkEvents(data["locations"][0]["coords"]);
});

TaskManager.defineTask("BACKGROUND_FETCH_TASK", async () => {
    if (!getAuth().currentUser) {
        return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    try {
        const dbRef = ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/events");
        const remoteEvents = Object.entries((await get(dbRef)).val()).filter(([, status]) => status === true).map(([id]) => id);
        const localEvents = await getStorageEvents();

        await setStorageEvents(localEvents.filter(event => remoteEvents.includes(event.id)));
        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (e) {
        console.log(e);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true
        };
    }
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
            if ((await Location.requestForegroundPermissionsAsync()).granted) {
                Location.watchPositionAsync({}, (location) => {
                    checkEvents(location.coords);
                });

                if ((await Location.requestBackgroundPermissionsAsync()).granted) {
                    Location.startLocationUpdatesAsync("BACKGROUND_LOCATION_TASK");
                }
            }
        }

        requestPermissions();
        registerForPushNotificationsAsync();

        const userRef = ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/friendRequests");
        return onValue(userRef, (snapshot) => {
            const value = snapshot.val();
            setFriendRequests(value ? Object.keys(value) : []);
        });
    }, []);

    useEffect(() => {
        const eventsRef = ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/eventInvitations");
        return onValue(eventsRef, (snapshot) => {
            const value = snapshot.val();
            setEventInvitations(value ? Object.keys(value) : []);
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