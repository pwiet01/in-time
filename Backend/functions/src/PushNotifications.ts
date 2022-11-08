import * as admin from "firebase-admin";

export async function sendPushNotification(uid: string, title: string, text: string) {
    const token = (await admin.database().ref("push-tokens/" + uid).get()).val();
    if (token) {
        try {
            await admin.messaging().sendToDevice(token, {
                 notification: {
                     title: title,
                     body: text
                 }
            });
        } catch (e) {
            console.log(e);
        }
    }
}