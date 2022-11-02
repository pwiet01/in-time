import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const onRegister = functions.auth.user().onCreate(async (user) => {
    return admin.database().ref("users/" + user.uid + "/general/time").set(0);
});

export const addFriend = functions.https.onRequest(async (req, res) => {
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

export const acceptFriendRequest = functions.https.onRequest(async (req, res) => {
    const {me, other} = req.body;

    try {
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

export const rejectFriendRequest = functions.https.onRequest(async (req, res) => {
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

export const deleteFriend = functions.https.onRequest(async (req, res) => {
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