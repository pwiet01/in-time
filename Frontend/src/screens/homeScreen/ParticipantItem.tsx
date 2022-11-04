import React, {FC, useEffect, useState} from "react";
import {CustomUser} from "../../util/CustomUser";
import {getDatabase, onValue, ref} from "firebase/database";
import {getAuth} from "firebase/auth";
import {ParticipantItemStatic} from "./ParticipantItemStatic";
import {Participant} from "../../util/InTimeEvent";

interface ParticipantItemProps {
    eventTime: number,
    participant: Participant,
    disabled?: boolean,
    onPress: (user: CustomUser) => void
}

export const ParticipantItem: FC<ParticipantItemProps> = (props) => {
    const [user, setUser] = useState<CustomUser>(null);

    useEffect(() => {
        const db = getDatabase();
        const userRef = ref(db, "users/" + props.participant.uid + "/general");

        return onValue(userRef, (snapshot) => {
            const value = snapshot.val();
            setUser(value ? {...value, uid: props.participant.uid} : null);
        });
    }, []);

    return <ParticipantItemStatic user={user} participant={props.participant} eventTime={props.eventTime} disabled={props.disabled}
                                  onPress={props.onPress} isMe={props.participant.uid === getAuth().currentUser.uid} />;
}