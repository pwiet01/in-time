import {getDatabase, ref, get, set} from "firebase/database";
import {getAuth, updateProfile} from "firebase/auth";
import {CustomUser} from "../util/CustomUser";
import {axiosInstance} from "../util/AxiosInstance";

export async function addFriend(uid: string): Promise<void> {
    await axiosInstance.post("addFriend", {
        me: getAuth().currentUser.uid,
        other: uid
    });
}

export async function acceptRequest(uid: string): Promise<void> {
    await axiosInstance.post("acceptFriendRequest", {
        me: getAuth().currentUser.uid,
        other: uid
    });
}

export async function rejectRequest(uid: string): Promise<void> {
    await axiosInstance.post("rejectFriendRequest", {
        me: getAuth().currentUser.uid,
        other: uid
    });
}

export async function deleteFriend(uid: string): Promise<void> {
    await axiosInstance.post("deleteFriend", {
        me: getAuth().currentUser.uid,
        other: uid
    });
}

export async function getUser(uid: string): Promise<CustomUser> {
    const db = ref(getDatabase(), "users/" + uid + "/general");
    const dbEntry = (await get(db)).val();

    return {
        ...dbEntry,
        uid: uid,
        displayName: dbEntry.displayName || uid
    };
}

export async function updateDisplayName(displayName: string) {
    const me = getAuth().currentUser;
    await set(ref(getDatabase(), "users/" + me.uid + "/general/displayName"), displayName);
    await updateProfile(me, {displayName: displayName});
}

export async function updatePhotoURL(photoURL: string) {
    const me = getAuth().currentUser;
    await set(ref(getDatabase(), "users/" + me.uid + "/general/photoURL"), photoURL);
    await updateProfile(me, {photoURL: photoURL});
}