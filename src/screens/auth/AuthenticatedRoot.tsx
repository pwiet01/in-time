import React, {FC, useContext, useEffect, useState} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {LangContext, BadgeContext} from "../../util/Context";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {Center, Icon, View} from "native-base";
import {headerStyle} from "../../style/HeaderStyle";
import {CommunityScreen} from "../CommunityScreen";
import {HomeScreen} from "../HomeScreen";
import {SettingsScreen} from "../SettingsScreen";
import {useHeaderBg, useTabBarStyle} from "../../hooks/StyleHooks";
import {getDatabase, onValue, ref, onDisconnect, set} from "firebase/database";
import {getAuth} from "firebase/auth";
import {BadgeColor, BadgedElement} from "../../util/BadgedElement";

const Tab = createBottomTabNavigator();

export const AuthenticatedRoot: FC = (_) => {
    const {lang} = useContext(LangContext);

    const headerBg = useHeaderBg();
    const {tabBarBackground, activeColor, inactiveColor} = useTabBarStyle();

    const [friendRequests, setFriendRequests] = useState<string[]>([]);
    const context = {friendRequests: friendRequests};

    useEffect(() => {
        const userRef = ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/friendRequests");
        return onValue(userRef, (snapshot) => {
            const value = snapshot.val();
            setFriendRequests(value ? Object.keys(value) : []);
        });
    }, []);

    useEffect(() => {
        const me = getAuth().currentUser.uid;
        const db = getDatabase();
        const connectedRef = ref(db, ".info/connected");
        const userStatusRef = ref(db, "users/" + me + "/isOnline");

        return onValue(connectedRef, async (snap) => {
            if (!snap.val()) {
                return;
            }

            try {
                await onDisconnect(userStatusRef).set(false);
                await set(userStatusRef, true);
            } catch (e) {
                console.log(e);
            }
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

    const badges = {
        friendRequests: friendRequests.length > 0 ? friendRequests.length : null
    };

    return (
        <BadgeContext.Provider value={context}>
            <Tab.Navigator
                initialRouteName={"home"}
                screenOptions={({route}) => ({
                    ...headerStyle(headerBg),
                    tabBarIcon: (props) => getMenuIcon(props, route),
                    tabBarActiveTintColor: activeColor,
                    tabBarInactiveTintColor: inactiveColor,
                    tabBarShowLabel: false,
                    tabBarBackground: () => <View w={"100%"} h={"100%"} bg={tabBarBackground} />
                })}
            >
                <Tab.Screen name={"community"} component={CommunityScreen} options={{headerShown: false}} />
                <Tab.Screen name={"home"} component={HomeScreen} options={{title: lang.screens.home}} />
                <Tab.Screen name={"settings"} component={SettingsScreen} options={{title: lang.screens.settings}} />
            </Tab.Navigator>
        </BadgeContext.Provider>
    );
};