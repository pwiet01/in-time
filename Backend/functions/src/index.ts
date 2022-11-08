import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {sendPushNotification} from "./PushNotifications";

admin.initializeApp();

export const onRegister = functions.region("europe-west1").auth.user().onCreate(async (user) => {
    return admin.database().ref("users/" + user.uid + "/general/time").set(0);
});

export const addFriend = functions.region("europe-west1").https.onRequest(async (req, res) => {
    const {me, other} = req.body;
    const db = admin.database();

    try {
        if ((await db.ref("users/" + me + "/friends/" + other).get()).val() === true) {
            res.status(500).send("Friend already added");
            return;
        }

        await db.ref("users/" + other + "/friendRequests/" + me).set(true);
        const myName = (await db.ref("users/" + me + "/general/displayName").get()).val();
        await sendPushNotification(other, "Freundschaftsanfrage", "Neue Freundschaftsanfrage von " + myName + "!");
        res.send("Success");
    } catch (e) {
        console.log(e);
        res.status(500).send("Request failed");
    }
});

export const acceptFriendRequest = functions.region("europe-west1").https.onRequest(async (req, res) => {
    const {me, other} = req.body;

    try {
        if ((await admin.database().ref("users/" + me + "/friendRequests/" + other).get()).val() !== true) {
            res.status(500).send("No request from this person!");
            return;
        }

        const updates = {};

        updates[other + "/friendRequests/" + me] = null;
        updates[me + "/friendRequests/" + other] = null;

        updates[me + "/friends/" + other] = true;
        updates[other + "/friends/" + me] = true;

        await admin.database().ref("users/").update(updates);
        res.send("Success");
    } catch (e) {
        console.log(e);
        res.status(500).send("Request failed");
    }
});

export const rejectFriendRequest = functions.region("europe-west1").https.onRequest(async (req, res) => {
    const {me, other} = req.body;

    try {
        const updates = {};

        updates[other + "/friendRequests/" + me] = null;
        updates[me + "/friendRequests/" + other] = null;

        await admin.database().ref("users/").update(updates);
        res.send("Success");
    } catch (e) {
        console.log(e);
        res.status(500).send("Request failed");
    }
});

export const deleteFriend = functions.region("europe-west1").https.onRequest(async (req, res) => {
    const {me, other} = req.body;

    try {
        const updates = {};

        updates[me + "/friends/" + other] = null;
        updates[other + "/friends/" + me] = null;

        await admin.database().ref("users/").update(updates);
        res.send("Success");
    } catch (e) {
        console.log(e);
        res.status(500).send("Request failed");
    }
});

export const createEvent = functions.region("europe-west1").https.onRequest(async (req, res) => {
    const {uid, event} = req.body;

    try {
        const eventRef = admin.database().ref("events/").push();
        await eventRef.set({
            ...event,
            general: {
                ...event.general,
                admin: uid
            },
            participants: {
                [uid]: {
                    accepted: true
                }
            }
        });

        await admin.database().ref("users/" + uid + "/events/" + eventRef.key).set(true);
        res.send(eventRef.key);
    } catch (e) {
        console.log(e);
        res.status(500).send("Request failed");
    }
});

export const setEventInvitations = functions.region("europe-west1").https.onRequest(async (req, res) => {
    let {eventId, uids} = req.body;
    uids = new Set(uids);

    try {
        const participants: {[id: string]: any} = (await admin.database().ref("events/" + eventId + "/participants").get()).val();
        const currentInvitations = new Set<string>();

        for (const [id, {accepted}] of Object.entries(participants)) {
            if (accepted === false) {
                currentInvitations.add(id);
            }
        }

        const updates = {};

        for (const uid of uids) {
            if (!currentInvitations.has(uid)) {
                updates["events/" + eventId + "/participants/" + uid] = {accepted: false};
                updates["users/" + uid + "/eventInvitations/" + eventId] = true;
            }
        }

        for (const uid of currentInvitations) {
            if (!uids.has(uid)) {
                updates["events/" + eventId + "/participants/" + uid] = null;
                updates["users/" + uid + "/eventInvitations/" + eventId] = null;
            }
        }

        await admin.database().ref().update(updates);

        const eventName = (await admin.database().ref("events/" + eventId + "/general/title").get()).val();
        await Promise.all(uids.filter(uid => !currentInvitations.has(uid)).map(uid =>
            sendPushNotification(uid, "Neues Ereignis", `Du wurdest eingeladen zu "${eventName}"!`)));

        res.send("Success");
    } catch (e) {
        console.log(e);
        res.status(500).send("Request failed");
    }
});

export const acceptEventInvite = functions.region("europe-west1").https.onRequest(async (req, res) => {
    const {eventId, uid} = req.body;

    try {
        if ((await admin.database().ref("events/" + eventId + "/participants/" + uid + "/accepted").get()).val() !== false) {
            res.status(500).send("No invite for this event!");
            return;
        }

        const updates = {};

        updates["events/" + eventId + "/participants/" + uid] = {accepted: true};
        updates["users/" + uid + "/events/" + eventId] = true;
        updates["users/" + uid + "/eventInvitations/" + eventId] = null;

        await admin.database().ref().update(updates);
        res.send("Success");
    } catch (e) {
        console.log(e);
        res.status(500).send("Request failed");
    }
});

export const rejectEventInvite = functions.region("europe-west1").https.onRequest(async (req, res) => {
    const {eventId, uid} = req.body;

    try {
        const updates = {};

        updates["events/" + eventId + "/participants/" + uid] = null;
        updates["users/" + uid + "/eventInvitations/" + eventId] = null;

        await admin.database().ref().update(updates);
        res.send("Success");
    } catch (e) {
        console.log(e);
        res.status(500).send("Request failed");
    }
});

export const onParticipantArrival = functions.region("europe-west1").database.ref("events/{eventId}/participants/{uid}/arrivalTime")
    .onCreate(async (snapshot, context) => {
        const eventRef = admin.database().ref("events/" + context.params.eventId);
        const arrivalTime = snapshot.val();
        const event = (await eventRef.get()).val();
        const eventTime = event.general.time;
        const diff = arrivalTime - eventTime;

        if (diff > 0) {
            const userTimeRef = admin.database().ref("users/" + context.params.uid + "/general/time");
            const seconds = Math.floor(diff / 1000);
            const currentTime = (await userTimeRef.get()).val();
            await userTimeRef.set(currentTime + seconds);
        }

        if (!event.general.closed) {
            const participants: {[uid: string]: any} = event.participants;
            if (Object.values(participants).findIndex((user) => !user.hasOwnProperty("arrivalTime") && user.accepted) === -1) {
                await eventRef.child("general/closed").set(true);
            }
        }
    });

export const onEventClosed = functions.region("europe-west1").database.ref("events/{eventId}/general/closed")
    .onCreate(async (snapshot, context) => {
        const eventRef = admin.database().ref("events/" + context.params.eventId + "/participants");
        const eventParticipants: {[uid: string]: any} = (await eventRef.get()).val();

        const updates = {};
        const now = Date.now();
        for (const [uid, info] of Object.entries(eventParticipants)) {
            if (info.accepted) {
                if (!info.hasOwnProperty("arrivalTime")) {
                    updates["events/" + context.params.eventId + "/participants/" + uid + "/arrivalTime"] = now;
                }

                updates["users/" + uid + "/events/" + context.params.eventId] = false;
            } else {
                updates["users/" + uid + "/eventInvitations/" + context.params.eventId] = null;
            }
        }

        await admin.database().ref().update(updates);
    });

export const onEventDeletion = functions.region("europe-west1").database.ref("events/{eventId}")
    .onDelete(async (snapshot, context) => {
        const participants = Object.keys(snapshot.val().participants);

        const updates = {};
        for (const user of participants) {
            updates["users/" + user + "/events/" + context.params.eventId] = null;
            updates["users/" + user + "/eventInvitations/" + context.params.eventId] = null;
        }

        return admin.database().ref().update(updates);
    });