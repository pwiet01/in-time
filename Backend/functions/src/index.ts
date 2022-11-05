import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const onRegister = functions.region("europe-west1").auth.user().onCreate(async (user) => {
    return admin.database().ref("users/" + user.uid + "/general/time").set(0);
});

export const addFriend = functions.region("europe-west1").https.onRequest(async (req, res) => {
    const {me, other} = req.body;

    try {
        if ((await admin.database().ref("users/" + me + "/friends/" + other).get()).val() === true) {
            res.status(500).send("Friend already added");
            return;
        }

        await admin.database().ref("users/" + other + "/friendRequests/" + me).set(true);
        res.send("Success");
    } catch (e) {
        console.log(e);
        res.status(500).send("Request failed");
    }
});

export const acceptFriendRequest = functions.region("europe-west1").https.onRequest(async (req, res) => {
    const {me, other} = req.body;

    try {
        if ((await admin.database().ref("users/" + other + "/friendRequests/" + me).get()).val() !== true) {
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
    const {uid, general, location} = req.body;

    try {
        const eventRef = admin.database().ref("events/").push();
        await eventRef.set({
            admin: uid,
            general: general,
            location: location,
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
                updates["users/" + uid + "/events/" + eventId] = false;
            }
        }

        for (const uid of currentInvitations) {
            if (!uids.has(uid)) {
                updates["events/" + eventId + "/participants/" + uid] = null;
                updates["users/" + uid + "/events/" + eventId] = null;
            }
        }

        await admin.database().ref().update(updates);
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
        updates["users/" + uid + "/events/" + eventId] = null;

        await admin.database().ref().update(updates);
        res.send("Success");
    } catch (e) {
        console.log(e);
        res.status(500).send("Request failed");
    }
});

export const onParticipantArrival = functions.region("europe-west1").database.ref("events/{eventId}/participants/{uid}/arrivalTime")
    .onCreate(async (snapshot, context) => {
        const arrivalTime = snapshot.val();
        const eventTime = (await admin.database().ref("events/" + context.params.eventId + "/general/time").get()).val();
        const diff = arrivalTime - eventTime;

        if (diff > 0) {
            const seconds = Math.floor(diff / 1000);
            const currentTime = (await admin.database().ref("users/" + context.params.uid + "/general/time").get()).val();
            await admin.database().ref("users/" + context.params.uid + "/general/time").set(currentTime + seconds);
        }
    });

export const onEventDeletion = functions.region("europe-west1").database.ref("events/{eventId}")
    .onDelete(async (snapshot, context) => {
        const participants = Object.keys(snapshot.val().participants);

        const updates = {};
        for (const user of participants) {
            updates["users/" + user + "/events/" + context.params.eventId] = null;
        }

        return admin.database().ref().update(updates);
    });