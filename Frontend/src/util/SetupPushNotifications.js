import * as Device from 'expo-device';
import * as Notifications from "expo-notifications";
import {Platform} from "react-native";
import {AndroidImportance} from "expo-notifications";
import {getStorageValue, setStorageValue} from "./Util";
import {getDatabase, ref, set} from "firebase/database";
import {getAuth} from "firebase/auth";

export async function registerForPushNotificationsAsync() {
    const result = [];
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }

        if (await getStorageValue("@push-token") == null) {
            try {
                const token = (await Notifications.getDevicePushTokenAsync()).data;
                await set(ref(getDatabase(), "push-tokens/" + getAuth().currentUser.uid), token);
                await setStorageValue("@push-token", token);
            } catch (e) {
                console.log(e);
            }
        }
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync("invite1", {
            name: "Invite",
            vibrationPattern: [0, 50, 100, 50, 100, 50],
            sound: "another_one.wav",
            importance: AndroidImportance.MAX,
            enableVibrate: true
        });

        await Notifications.setNotificationChannelAsync("reminder1", {
            name: "Reminder",
            vibrationPattern: [0, 50, 100, 50, 100, 50],
            sound: "among_us.wav",
            importance: AndroidImportance.MAX,
            enableVibrate: true
        });

        await Notifications.setNotificationChannelAsync("late1", {
            name: "Late",
            vibrationPattern: [0, 50, 100, 50, 100, 50],
            sound: "aha.wav",
            importance: AndroidImportance.MAX,
            enableVibrate: true
        });
    }
};