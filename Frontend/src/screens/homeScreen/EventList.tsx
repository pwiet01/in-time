import React, {FC, useContext, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {NavScreen} from "../../util/NavScreen";
import {Button, Center, Divider, Heading, Icon, View} from "native-base";
import {SectionList} from "react-native";
import {EventItem} from "./EventItem";
import {Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import {child, getDatabase, onValue, ref} from "firebase/database";
import {getAuth} from "firebase/auth";
import {BadgedElement} from "../../util/BadgedElement";
import {EventInvitationsContext, LangContext} from "../../util/Context";
import {InTimeEventGeneralInfo} from "../../util/InTimeEvent";
import {protectedAsyncCall, setStorageEvents} from "../../util/Util";
import {removeClosedEvent} from "../../firebase/Events";

export const EventList: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);

    const [eventIds, setEventIds] = useState<string[]>([]);
    const [events, setEvents] = useState<{[id: string]: InTimeEventGeneralInfo}>({});
    const [sortedEvents, setSortedEvents] = useState([]);

    const {eventInvitations} = useContext(EventInvitationsContext);

    useEffect(() => {
        const eventsRef = ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/events");
        return onValue(eventsRef, (snapshot) => {
            const value = snapshot.val();
            setEventIds(value ? Object.keys(value) : []);
        });
    }, []);

    useEffect(() => {
        if (eventIds) {
            setEvents({});
            const eventsRef = ref(getDatabase(), "events");
            const unsubscribeList = eventIds.map(eventId => onValue(child(eventsRef, eventId + "/general"), snapshot => {
                const value = snapshot.val();
                setEvents(prev => ({...prev, [eventId]: {...value, id: eventId}}));
            }));

            return () => unsubscribeList.forEach(unsub => unsub());
        }
    }, [eventIds]);

    useEffect(() => {
        if (events && Object.keys(events).length === eventIds.length) {
            const newEvents = [{type: "open", data: []}, {type: "closed", data: []}];

            for (const [, event] of Object.entries(events)) {
                if (event) {
                    if (event.closed) {
                        newEvents[1].data.push(event);
                    } else {
                        newEvents[0].data.push(event);
                    }
                }
            }

            newEvents[0].data.sort((a, b) => a.time - b.time);
            newEvents[1].data.sort((a, b) => b.time - a.time);

            setSortedEvents(newEvents);
            setStorageEvents(newEvents[0].data);
        }
    }, [events]);

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <View flexDir={"row"}>
                    {
                        eventInvitations.length > 0 &&
                        <BadgedElement text={eventInvitations.length.toString()} color={"red"}>
                            <Button colorScheme={"transparent"} onPress={() => props.navigation.navigate("event-invitations")}>
                                <Icon as={MaterialCommunityIcons} name={"email"} color={"white"} size={"lg"} />
                            </Button>
                        </BadgedElement>
                    }
                    <Button colorScheme={"transparent"} onPress={() => props.navigation.navigate("new-event")}>
                        <Icon as={MaterialCommunityIcons} name={"plus"} color={"white"} size={"xl"} />
                    </Button>
                </View>
            )
        });
    }, [props.navigation, eventInvitations]);

    function renderEvent(event: InTimeEventGeneralInfo) {
        if (event.closed) {
            return (
                <View flexDir={"row"} alignItems={"center"}>
                    <View flex={1} marginRight={3}>
                        <EventItem event={event} onPress={({id}) => props.navigation.navigate("event-screen", {id: id})} />
                    </View>
                    <Button colorScheme={"transparent"} variant={"link"} onPress={() => protectedAsyncCall(() => removeClosedEvent(event.id))}>
                        <Icon as={MaterialCommunityIcons} name={"close"} color={"blueGray.600"} size={5} />
                    </Button>
                </View>
            );
        } else {
            return <EventItem event={event} onPress={({id}) => props.navigation.navigate("event-screen", {id: id})} />;
        }
    }

    return useMemo(() => {
        return (
            <Center w={"100%"} h={"100%"} padding={5}>
                <SectionList
                    style={{width: "100%"}}
                    sections={sortedEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => renderEvent(item)}
                    renderSectionHeader={({section: {type, data}}) => type === "closed" && data.length > 0 &&
                        <Heading marginTop={sortedEvents[0].data.length > 0 ? 10 : 0} marginBottom={3}>{lang.home.closed}</Heading>}
                    ItemSeparatorComponent={() => <Divider margin={1} thickness={0}/>}
                />
            </Center>
        );
    }, [sortedEvents, lang]);
}