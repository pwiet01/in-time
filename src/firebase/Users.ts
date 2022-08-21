import {getDatabase, ref, update, child, get, set} from "firebase/database";
import {getAuth} from "firebase/auth";
import {CustomUser} from "../util/CustomUser";

export async function addFriend(uid: string): Promise<void> {
    const me = getAuth().currentUser.uid;
    await set(ref(getDatabase(), "users/" + uid + "/friendRequests/" + me), true);
}

export async function acceptRequest(uid: string): Promise<void> {
    const me = getAuth().currentUser.uid;

    const updates = {};

    updates["users/" + uid + "/friendRequests/" + me] = null;
    updates["users/" + me + "/friendRequests/" + uid] = null;

    updates["users/" + me + "/friends/" + uid] = true;
    updates["users/" + uid + "/friends/" + me] = true;

    await update(ref(getDatabase()), updates);
}

export async function rejectRequest(uid: string): Promise<void> {
    const me = getAuth().currentUser.uid;

    const updates = {};

    updates["users/" + uid + "/friendRequests/" + me] = null;
    updates["users/" + me + "/friendRequests/" + uid] = null;

    await update(ref(getDatabase()), updates);
}

export async function deleteFriend(uid: string): Promise<void> {
    const me = getAuth().currentUser.uid;

    const updates = {};
    updates["users/" + me + "/friends/" + uid] = null;
    updates["users/" + uid + "/friends/" + me] = null;

    await update(ref(getDatabase()), updates);
}

export async function getUser(uid: string): Promise<CustomUser> {
    const db = ref(getDatabase());
    return {...(await get(child(db, "users/" + uid))).val().general, uid: uid};
}