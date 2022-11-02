import {getDatabase, ref, get} from "firebase/database";
import {getAuth} from "firebase/auth";
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