import {LatLng} from "react-native-maps";

export interface Participant {
    uid: string,
    accepted: boolean,
    arrivalTime: number
}

export interface InTimeEventGeneralInfo {
    id: string,
    title: string,
    time: number
}

export interface InTimeEvent {
    general: InTimeEventGeneralInfo,
    location: LatLng,
    participants: Participant[],
    admin: string
}

export const eventConfig = {
    earliestNewEvent: 1200,
    earliestArrival: -600,
    latestArrival: 3600
}

export const statusColor = {
    0: "white",
    1: "emerald.500",
    2: "danger.500",
    3: "white"
}

export function getStatus(eventTime: number, arrivalTime: number) {
    if (eventTime == null) {
        return {
            status: 0,
            time: 0
        };
    }

    if (arrivalTime != null) {
        return {
            status: 3,
            time: Math.floor((arrivalTime - eventTime) / 1000)
        };
    }

    const time = Math.floor((new Date().getTime() - eventTime) / 1000);
    let status;

    if (time < eventConfig.earliestArrival) {
        status = 0;
    } else if (time < 0) {
        status = 1;
    } else {
        status = 2;
    }

    return {
        status: status,
        time: time
    };
}

export function getEventParticipants(event: {participants: {[uid: string]: any}}): Participant[] {
    const result: Participant[] = [];
    for (const [uid, other] of Object.entries(event.participants)) {
        if (other.accepted === true) {
            result.push({...other, uid: uid});
        }
    }

    return result;
}