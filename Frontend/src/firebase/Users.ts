import {getDatabase, ref, get, set, child, orderByChild, limitToFirst, equalTo, query} from "firebase/database";
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

export async function getUsers(uid: string): Promise<CustomUser[]> {
    const users = [];
    const userRef = ref(getDatabase(), "users");

    try {
        const idMatch = (await get(child(userRef, uid + "/general"))).val();
        if (idMatch) {
            users.push({uid: uid, ...idMatch});
        }
    } catch (e) {}

    const nameMatches: {[uid: string]: any} = (await get(query(userRef, orderByChild("general/displayName"), equalTo(uid), limitToFirst(5)))).val();
    Object.entries(nameMatches).forEach(([uid, info]) => {
        users.push({uid: uid, ...info.general});
    });

    return users;
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