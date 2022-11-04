import React, {FC, useContext, useEffect, useLayoutEffect, useState} from "react";
import {NavScreen} from "../../util/NavScreen";
import {Button, Center, Divider, Heading, Icon, View} from "native-base";
import {FlatList} from "react-native";
import {EventItem} from "./EventItem";
import {Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import {getDatabase, onValue, ref} from "firebase/database";
import {getAuth} from "firebase/auth";
import {BadgedElement} from "../../util/BadgedElement";
import {EventInvitationsContext} from "../../util/Context";

export const EventList: FC<NavScreen> = (props) => {
    const [events, setEvents] = useState<string[]>([]);
    const {eventInvitations} = useContext(EventInvitationsContext);

    useEffect(() => {
        const eventsRef = ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/events");
        return onValue(eventsRef, (snapshot) => {
            const value = snapshot.val();
            setEvents(value ? Object.entries(value).filter(([_, status]) => status === true).map(([id]) => id) : []);
        });
    }, []);

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <View flexDir={"row"}>
                    <BadgedElement text={eventInvitations.length > 0 ? eventInvitations.length.toString() : null} color={"red"}>
                        <Button colorScheme={"transparent"} onPress={() => props.navigation.navigate("event-invitations")}>
                            <Icon as={Feather} name={"info"} color={"white"} size={"lg"} />
                        </Button>
                    </BadgedElement>
                    <Button colorScheme={"transparent"} onPress={() => props.navigation.navigate("new-event")}>
                        <Icon as={MaterialCommunityIcons} name={"plus"} color={"white"} size={"xl"} />
                    </Button>
                </View>
            )
        });
    }, [props.navigation, eventInvitations]);

    return (
        <Center w={"100%"} h={"100%"} padding={5}>
            <FlatList style={{width: "100%", flex: 1}} data={events}
                      renderItem={({item}) => <EventItem eventId={item}
                                                         onPress={({id}) => props.navigation.navigate("event-screen", {id: id})} />}
                      keyExtractor={(item) => item} ItemSeparatorComponent={() => <Divider margin={1} thickness={0} />} />
        </Center>
    );
}