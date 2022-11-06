import {InTimeEvent} from "../util/InTimeEvent";
import {axiosInstance} from "../util/AxiosInstance";
import {getAuth} from "firebase/auth";
import {getDatabase, ref, remove, set} from "firebase/database";
import {addStorageEvent} from "../util/Util";

export async function createEvent(event: InTimeEvent): Promise<void> {
    await axiosInstance.post("createEvent", {uid: getAuth().currentUser.uid, event: event});
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

    addStorageEvent(event.general);
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
}

export async function leaveEvent(event: InTimeEvent) {
    await axiosInstance.post("rejectEventInvite", {
        eventId: event.general.id,
        uid: getAuth().currentUser.uid
    });
}

export async function closeEvent(id: string) {
    await set(ref(getDatabase(), "events/" + id + "/general/closed"), true);
}

export async function deleteEvent(id: string) {
    await remove(ref(getDatabase(), "events/" + id));
}

export async function removeClosedEvent(id: string) {
    await remove(ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/events/" + id));
}