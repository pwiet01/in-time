import React, {FC, useEffect, useState} from "react";
import {CustomUser} from "../../util/CustomUser";
import {getDatabase, ref, onValue} from "firebase/database";
import {UserProfileStatic} from "./UserProfileStatic";

interface UserProfileProps {
    uid: string,
    isMe?: boolean,
    onPress: (user: CustomUser | string) => void
}

export const UserProfile: FC<UserProfileProps> = (props) => {
    const [user, setUser] = useState<CustomUser>(null);
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const db = getDatabase();
        const userRef = ref(db, "users/" + props.uid + "/general");
        const onlineRef = ref(db, "users/" + props.uid + "/isOnline");

        const unsubscribeGeneral = onValue(userRef, (snapshot) => {
            const value = snapshot.val();
            setUser(value ? {...value, uid: props.uid} : null);
        });

        const unsubscribeOnline = onValue(onlineRef, (snapshot) => {
            setIsOnline(snapshot.val() || false);
        });

        return () => {
            unsubscribeGeneral();
            unsubscribeOnline();
        };
    }, []);

    return <UserProfileStatic user={user} onPress={(user) => props.onPress(user || props.uid)} isMe={props.isMe} isOnline={isOnline} />;
}