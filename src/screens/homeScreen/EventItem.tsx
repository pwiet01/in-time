import React, {FC} from "react";
import {EventItemStatic} from "./EventItemStatic";
import {InTimeEvent} from "../../util/InTimeEvent";

interface EventItemProps {
    eventId: string
}

export const EventItem: FC<EventItemProps> = (props) => {
    const event: InTimeEvent = {
        id: "1",
        title: "Test Ereignis",
        time: new Date(2022, 7, 31),
        location: null,
        participants: []
    }

    return <EventItemStatic event={event} />;
}