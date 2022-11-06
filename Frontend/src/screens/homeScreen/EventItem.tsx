import React, {FC, useEffect, useState} from "react";
import {EventItemStatic} from "./EventItemStatic";
import {InTimeEventGeneralInfo} from "../../util/InTimeEvent";
import {getDatabase, onValue, ref} from "firebase/database";
import {getAuth} from "firebase/auth";

interface EventItemProps {
    eventId?: string,
    event?: InTimeEventGeneralInfo,
    onPress?: (event: InTimeEventGeneralInfo) => void
}

export const EventItem: FC<EventItemProps> = (props) => {
    const [event, setEvent] = useState<InTimeEventGeneralInfo>(null);
    const [arrivalTime, setArrivalTime] = useState<number>(null);

    useEffect(() => {
        if (!props.event) {
            const db = getDatabase();
            const eventRef = ref(db, "events/" + props.eventId + "/general");

            return onValue(eventRef, (snapshot) => {
                const value = snapshot.val();
                setEvent(value ? {...value, id: props.eventId} : null);
            });
        }
    }, []);

    useEffect(() => {
        const db = getDatabase();
        const eventRef = ref(db, "events/" + (props.eventId || props.event.id) + "/participants/" + getAuth().currentUser.uid + "/arrivalTime");

        return onValue(eventRef, (snapshot) => {
            setArrivalTime(snapshot.val());
        });
    }, []);

    return <EventItemStatic event={props.event || event} onPress={() => props.onPress(props.event)} arrivalTime={arrivalTime} />;
}