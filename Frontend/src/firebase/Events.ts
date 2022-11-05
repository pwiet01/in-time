import {InTimeEvent} from "../util/InTimeEvent";
import {axiosInstance} from "../util/AxiosInstance";
import {getAuth} from "firebase/auth";
import {addStorageEvent, removeStorageEvent} from "../util/Util";

export async function createEvent(event: InTimeEvent): Promise<void> {
    const res = await axiosInstance.post("createEvent", {
        uid: getAuth().currentUser.uid,
        ...event
    });

    addStorageEvent({...event, general: {...event.general, id: res.data}});
}

export async function setEventInvitations(eventId: string, uids: string[]) {
    await axiosInstance.post("setEventInvitations", {
        eventId: eventId,
        uids: uids
    });
}

export async function acceptEventInvite(event: InTimeEvent) {
    await axiosInstance.post("acceptEventInvite", {
        eventId: event.general.id,
        uid: getAuth().currentUser.uid
    });

    addStorageEvent(event);
}

export async function rejectEventInvite(eventId: string) {
    await axiosInstance.post("rejectEventInvite", {
        eventId: eventId,
        uid: getAuth().currentUser.uid
    });
}

export async function removeEventParticipant(event: InTimeEvent, uid: string) {
    await axiosInstance.post("rejectEventInvite", {
        eventId: event.general.id,
        uid: uid
    });

    removeStorageEvent(event.general.id);
}