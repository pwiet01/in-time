import {InTimeEvent} from "../util/InTimeEvent";
import {axiosInstance} from "../util/AxiosInstance";
import {getAuth} from "firebase/auth";

export async function createEvent(event: InTimeEvent): Promise<void> {
    await axiosInstance.post("createEvent", {
        uid: getAuth().currentUser.uid,
        ...event
    });
}

export async function setEventInvitations(eventId: string, uids: string[]) {
    await axiosInstance.post("setEventInvitations", {
        eventId: eventId,
        uids: uids
    });
}

export async function acceptEventInvite(eventId: string) {
    await axiosInstance.post("acceptEventInvite", {
        eventId: eventId,
        uid: getAuth().currentUser.uid
    });
}

export async function rejectEventInvite(eventId: string) {
    await axiosInstance.post("rejectEventInvite", {
        eventId: eventId,
        uid: getAuth().currentUser.uid
    });
}

export async function removeEventParticipant(eventId: string, uid: string) {
    await axiosInstance.post("rejectEventInvite", {
        eventId: eventId,
        uid: uid
    });
}