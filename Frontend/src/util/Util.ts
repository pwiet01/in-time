import {lang as langDE} from "../../lang/lang.de";
import {lang as langEN} from "../../lang/lang.en";
import {Toast} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {eventConfig, InTimeEventGeneralInfo} from "./InTimeEvent";
import {getAuth} from "firebase/auth";
import {
    cancelAllScheduledNotificationsAsync, dismissAllNotificationsAsync,
    scheduleNotificationAsync
} from "expo-notifications";
import moment from "moment/moment";

export function getLang(id: string): {key: string, lang: any} {
    switch (id) {
        case "de":
            return {key: "de", lang: langDE};
        case "en":
        default:
            return {key: "en", lang: langEN};
    }
}

export function getAllLanguages(): {key: string, title: string}[] {
    const languages = [langDE, langEN];
    return languages.map((lang) => ({key: lang.key, title: lang.title}));
}

export async function protectedAsyncCall(target: () => Promise<any>, errMsg?: string, successMsg?: string): Promise<{success: boolean, data: any}> {
    try {
        const result = await target();
        if (successMsg) {
            Toast.show({description: successMsg});
        }

        return {success: true, data: result};
    } catch (e) {
        console.log(e);
        Toast.show({description: errMsg || getLang(await getStorageValue("@language")).lang.other.error});
    }

    return {success: false, data: null};
}

export async function getStorageValue(key: string): Promise<string> {
    try {
        return await AsyncStorage.getItem(key);
    } catch (e) {}

    return null;
}

export async function setStorageValue(key: string, value: string): Promise<void> {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {}
}

export async function getStorageEvents(): Promise<InTimeEventGeneralInfo[]> {
    try {
        return JSON.parse(await AsyncStorage.getItem("@event-locations:" + getAuth().currentUser.uid)) || [];
    } catch (e) {}

    return [];
}

export async function setStorageEvents(storageEvents: InTimeEventGeneralInfo[]) {
    try {
        const newEvents = JSON.stringify(storageEvents);
        if (newEvents !== await getStorageValue("@event-locations:" + getAuth().currentUser.uid)) {
            await setStorageValue("@event-locations:" + getAuth().currentUser.uid, newEvents);
            const lang = getLang(await getStorageValue("@language")).lang;

            await cancelAllScheduledNotificationsAsync();
            await dismissAllNotificationsAsync();

            await Promise.all(storageEvents
                .filter(event => event.time + (eventConfig.earliestArrival * 1000) > Date.now())
                .map(event => scheduleNotificationAsync({
                    identifier: event.id + "-reminder",
                    content: {
                        title: lang.other.upcomingEvent,
                        body: `${event.title} - ${moment(event.time).format("LT")}`,
                        sound: "among_us.mp3"
                    },
                    trigger: {
                        date: event.time + (eventConfig.earliestArrival * 1000),
                        channelId: "reminder"
                    }
                })));

            await Promise.all(storageEvents
                .map(event => scheduleNotificationAsync({
                    identifier: event.id + "-late",
                    content: {
                        title: lang.other.late,
                        body: `${event.title} - ${moment(event.time).format("LT")}`,
                        sticky: true,
                        sound: "aha.mp3"
                    },
                    trigger: {
                        date: event.time > Date.now() ? event.time : null,
                        channelId: "late"
                    }
                })));
        }
    } catch (e) {}
}

export function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}