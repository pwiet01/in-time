import React, {FC, useEffect, useState} from "react";
import {CustomUser} from "../../util/CustomUser";
import {getDatabase, ref, onValue} from "firebase/database";
import {UserProfileStatic} from "./UserProfileStatic";

interface UserProfileProps {
    uid?: string,
    user?: CustomUser,
    isMe?: boolean,
    onPress: (user: CustomUser | string) => void
}

export const UserProfile: FC<UserProfileProps> = (props) => {
    const [user, setUser] = useState<CustomUser>(null);

    useEffect(() => {
        if (!props.user) {
            const db = getDatabase();
            const userRef = ref(db, "users/" + props.uid + "/general");

            return onValue(userRef, (snapshot) => {
                const value = snapshot.val();
                setUser(value ? {...value, uid: props.uid} : null);
            });
        }
    }, []);

    return <UserProfileStatic user={props.user || user} onPress={(user) => props.onPress(user || props.uid)} isMe={props.isMe} />;
}