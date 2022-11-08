import React, {FC, useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import {NavScreen} from "../../util/NavScreen";
import {eventConfig, getEventParticipants, InTimeEvent} from "../../util/InTimeEvent";
import {getDatabase, onValue, ref} from "firebase/database";
import {EventItemStatic} from "./EventItemStatic";
import {Button, Heading, Icon, ScrollView, useDisclose, View, Text} from "native-base";
import MapView, {Marker} from "react-native-maps";
import {LoadingScreen} from "../../util/LoadingScreen";
import {LangContext} from "../../util/Context";
import {ParticipantItem} from "./ParticipantItem";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {getAuth} from "firebase/auth";
import {StandardDialog} from "../../util/StandardDialog";
import {protectedAsyncCall} from "../../util/Util";
import {CustomUser} from "../../util/CustomUser";
import {
    acceptEventInvite, closeEvent,
    deleteEvent,
    leaveEvent,
    rejectEventInvite,
    removeEventParticipant
} from "../../firebase/Events";
import {AsyncButton} from "../../util/AsyncButton";

export const EventScreen: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);
    const [event, setEvent] = useState<InTimeEvent>(null);

    const selectedUser = useRef<CustomUser>(null);
    const removeParticipantDialog = useDisclose();

    const leaveDialog = useDisclose();
    const deleteDialog = useDisclose();
    const closeDialog = useDisclose();

    const adminAccess = event?.general.admin === getAuth().currentUser.uid;
    const [editAllowed, setEditAllowed] = useState<boolean>(false);
    const [closeAllowed, setCloseAllowed] = useState<boolean>(false);

    useEffect(() => {
        const db = getDatabase();
        const eventRef = ref(db, "events/" + props.route.params.id);

        return onValue(eventRef, (snapshot) => {
            const value = snapshot.val();
            setEvent(value ? {
                ...value,
                general: {...value.general, id: props.route.params.id},
                participants: getEventParticipants(value)
            } : null);
        });
    }, []);

    useEffect(() => {
        if (event) {
            const now = Date.now();
            if (Math.floor((now - event.general.time) / 1000) < eventConfig.earliestArrival) {
                setEditAllowed(true);
                const id = setTimeout(() => setEditAllowed(false), event.general.time + (eventConfig.earliestArrival * 1000) - now);
                return () => clearTimeout(id);
            } else if (!event.general.hasOwnProperty("closed")) {
                if (now > event.general.time) {
                    setCloseAllowed(true);
                } else {
                    const id = setTimeout(() => setCloseAllowed(true), event.general.time - now);
                    return () => clearTimeout(id);
                }
            } else {
                setCloseAllowed(false);
            }
        }
    }, [event]);

    useLayoutEffect(() => {
        async function handleInvitationAccept() {
            if ((await protectedAsyncCall(() => acceptEventInvite(event), null, lang.home.inviteAccepted))) {
                props.navigation.goBack();
            }
        }

        async function handleInvitationReject() {
            if ((await protectedAsyncCall(() => rejectEventInvite(props.route.params.id), null, lang.home.inviteRejected))) {
                props.navigation.goBack();
            }
        }

        props.navigation.setOptions({
            headerRight: () => {
                if (event) {
                    if (event.general.closed) {
                        return <Text>{lang.home.closed}</Text>
                    } else if (props.route.params.isInvite) {
                        return (
                            <View flexDir={"row"} alignItems={"center"}>
                                <AsyncButton colorScheme={"transparent"} onPress={handleInvitationAccept}>
                                    <Icon as={MaterialCommunityIcons} name={"check"} color={"white"} size={"lg"}/>
                                </AsyncButton>
                                <AsyncButton colorScheme={"transparent"} onPress={handleInvitationReject} marginRight={2}>
                                    <Icon as={MaterialCommunityIcons} name={"close"} color={"white"} size={"lg"}/>
                                </AsyncButton>
                            </View>
                        );
                    } else if (editAllowed) {
                        return adminAccess ?
                            <Button colorScheme={"transparent"} onPress={deleteDialog.onOpen} marginRight={2}>
                                <Icon as={MaterialCommunityIcons} name={"delete"} color={"white"} size={"lg"}/>
                            </Button> :
                            <Button colorScheme={"transparent"} onPress={leaveDialog.onOpen} marginRight={2}>
                                <Icon as={MaterialCommunityIcons} name={"logout"} color={"white"} size={"lg"}/>
                            </Button>
                    } else if (closeAllowed) {
                        return adminAccess &&
                            <Button colorScheme={"transparent"} onPress={closeDialog.onOpen} marginRight={2}>
                                <Icon as={MaterialCommunityIcons} name={"close"} color={"white"} size={"lg"}/>
                            </Button>
                    }
                }
            }
        });
    }, [props.navigation, event, editAllowed, closeAllowed, lang]);

    function getParticipantsSection() {
        return (
            <View marginTop={10} w={"100%"}>
                <View flexDir={"row"} justifyContent={"space-between"} alignItems={"center"} marginBottom={3}>
                    <Heading>{lang.home.participants}</Heading>
                    {adminAccess && editAllowed &&
                        <Button colorScheme={"transparent"}
                                onPress={() => props.navigation.navigate("invite-users", {eventId: event.general.id})}>
                            <Icon as={MaterialCommunityIcons} name={"account-multiple-plus"} color={"primary.500"} size={"xl"}/>
                        </Button>
                    }
                </View>
                {event.participants.map(participant => (
                    <View marginBottom={1} w={"100%"} key={participant.uid}>
                        <ParticipantItem eventTime={event.general.time} participant={participant}
                                         disabled={!adminAccess || !editAllowed}
                                         onPress={(user) => {
                                             selectedUser.current = user;
                                             removeParticipantDialog.onOpen();
                                         }}/>
                    </View>
                ))}
            </View>
        );
    }

    function getLocationSection() {
        return (
            <View marginTop={10} w={"100%"}>
                <Heading marginBottom={3}>{lang.home.location}</Heading>
                <MapView style={{width: "100%", height: 300}}
                         showsUserLocation
                         initialRegion={{
                             ...event.general.location,
                             latitudeDelta: 0.01,
                             longitudeDelta: 0.01
                         }}>
                    <Marker coordinate={event.general.location}/>
                </MapView>
            </View>
        );
    }

    function getDeleteParticipantDialog() {
        if (!selectedUser.current) {
            return <></>;
        }

        return <StandardDialog title={lang.home.removeParticipantTitle}
                               content={lang.home.removeParticipant(selectedUser.current.displayName)}
                               isOpen={removeParticipantDialog.isOpen} onClose={removeParticipantDialog.onClose}
                               onAccept={async () => {
                                   if ((await protectedAsyncCall(() =>
                                       removeEventParticipant(event, selectedUser.current.uid))).success)
                                       removeParticipantDialog.onClose();
                               }}/>
    }

    function getLeaveDialog() {
        return <StandardDialog title={lang.home.leaveEventTitle}
                               content={lang.home.leaveEvent}
                               isOpen={leaveDialog.isOpen} onClose={leaveDialog.onClose}
                               onAccept={async () => {
                                   if ((await protectedAsyncCall(() =>
                                       leaveEvent(event))).success) {
                                       leaveDialog.onClose();
                                       props.navigation.goBack();
                                   }
                               }}/>
    }

    function getDeleteDialog() {
        return <StandardDialog title={lang.home.deleteEventTitle}
                               content={lang.home.deleteEvent}
                               isOpen={deleteDialog.isOpen} onClose={deleteDialog.onClose}
                               onAccept={async () => {
                                   if ((await protectedAsyncCall(() =>
                                       deleteEvent(event.general.id))).success) {
                                       deleteDialog.onClose();
                                       props.navigation.goBack();
                                   }
                               }}/>
    }

    function getCloseDialog() {
        return <StandardDialog title={lang.home.closeEventTitle}
                               content={lang.home.closeEvent}
                               isOpen={closeDialog.isOpen} onClose={closeDialog.onClose}
                               onAccept={async () => {
                                   if ((await protectedAsyncCall(() => closeEvent(event.general.id))).success) {
                                       closeDialog.onClose();
                                   }
                               }} />
    }

    if (!event) {
        return <LoadingScreen/>;
    }

    return (
        <View w={"100%"} h={"100%"} padding={5}>
            <ScrollView w={"100%"} h={"100%"}>
                <EventItemStatic event={event.general}
                                 arrivalTime={event.participants.find(user => user.uid === getAuth().currentUser.uid)?.arrivalTime}/>
                {getParticipantsSection()}
                {getLocationSection()}
            </ScrollView>
            {getDeleteParticipantDialog()}
            {getLeaveDialog()}
            {getDeleteDialog()}
            {getCloseDialog()}
        </View>
    );
}