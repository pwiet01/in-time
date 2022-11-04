import React, {FC, useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import {NavScreen} from "../../util/NavScreen";
import {eventConfig, getEventParticipants, InTimeEvent} from "../../util/InTimeEvent";
import {getDatabase, onValue, ref} from "firebase/database";
import {EventItemStatic} from "./EventItemStatic";
import {Button, Heading, Icon, ScrollView, useDisclose, View} from "native-base";
import MapView, {Marker} from "react-native-maps";
import {LoadingScreen} from "../../util/LoadingScreen";
import {LangContext} from "../../util/Context";
import {ParticipantItem} from "./ParticipantItem";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {getAuth} from "firebase/auth";
import {StandardDialog} from "../../util/StandardDialog";
import {protectedAsyncCall} from "../../util/Util";
import {CustomUser} from "../../util/CustomUser";
import {acceptEventInvite, rejectEventInvite, removeEventParticipant} from "../../firebase/Events";

export const EventScreen: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);
    const [event, setEvent] = useState<InTimeEvent>(null);

    const selectedUser = useRef<CustomUser>(null);
    const removeParticipantDialog = useDisclose();

    const leaveDialog = useDisclose();

    const adminAccess = event?.admin === getAuth().currentUser.uid;
    const editAllowed = new Date().getTime() - event?.general.time < eventConfig.earliestArrival;

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

    useLayoutEffect(() => {
        async function handleInvitationAccept() {
            if ((await protectedAsyncCall(() => acceptEventInvite(props.route.params.id), null, lang.home.inviteAccepted))) {
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
                if (props.route.params.isInvite) {
                    return (
                        <View flexDir={"row"} alignItems={"center"}>
                            <Button colorScheme={"transparent"} onPress={handleInvitationAccept}>
                                <Icon as={MaterialCommunityIcons} name={"check"} color={"white"} size={"lg"}/>
                            </Button>
                            <Button colorScheme={"transparent"} onPress={handleInvitationReject} marginRight={2}>
                                <Icon as={MaterialCommunityIcons} name={"close"} color={"white"} size={"lg"}/>
                            </Button>
                        </View>
                    );
                } else {
                    return adminAccess || !editAllowed ?
                        <></> :
                        <Button colorScheme={"transparent"} onPress={leaveDialog.onOpen} marginRight={2}>
                            <Icon as={MaterialCommunityIcons} name={"logout"} color={"white"} size={"lg"}/>
                        </Button>
                }
            }
        });
    }, [props.navigation, event]);

    function getParticipantsSection() {
        return (
            <View marginTop={10} w={"100%"}>
                <View flexDir={"row"} justifyContent={"space-between"} alignItems={"center"} marginBottom={5}>
                    <Heading>{lang.home.participants}</Heading>
                    {adminAccess && editAllowed &&
                        <Button colorScheme={"transparent"}
                                onPress={() => props.navigation.navigate("invite-users", {eventId: event.general.id})}>
                            <Icon as={MaterialCommunityIcons} name={"account-multiple-plus"} color={"primary.500"}
                                  size={"xl"}/>
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
            <View marginTop={10} marginBottom={10} w={"100%"}>
                <Heading marginBottom={5}>{lang.home.location}</Heading>
                <MapView style={{width: "100%", height: 300}}
                         showsUserLocation
                         initialRegion={{
                             ...event.location,
                             latitudeDelta: 0.01,
                             longitudeDelta: 0.01
                         }}>
                    <Marker coordinate={event.location}/>
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
                                       removeEventParticipant(props.route.params.id, selectedUser.current.uid))).success)
                                       removeParticipantDialog.onClose();
                               }}/>
    }

    function getLeaveDialog() {
        return <StandardDialog title={lang.home.leaveEventTitle}
                               content={lang.home.leaveEvent}
                               isOpen={leaveDialog.isOpen} onClose={leaveDialog.onClose}
                               onAccept={async () => {
                                   if ((await protectedAsyncCall(() =>
                                       removeEventParticipant(props.route.params.id, getAuth().currentUser.uid))).success) {
                                       removeParticipantDialog.onClose();
                                       props.navigation.goBack();
                                   }
                               }}/>
    }

    if (!event) {
        return <LoadingScreen/>;
    }

    return (
        <View>
            <ScrollView w={"100%"} h={"100%"} padding={5}>
                <EventItemStatic event={event.general}
                                 arrivalTime={event.participants.find(user => user.uid === getAuth().currentUser.uid)?.arrivalTime}/>
                {getParticipantsSection()}
                {getLocationSection()}
            </ScrollView>
            {getDeleteParticipantDialog()}
            {getLeaveDialog()}
        </View>
    );
}