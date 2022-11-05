import {lang as langDE} from "../../lang/lang.de";
import {lang as langEN} from "../../lang/lang.en";
import {Toast} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LatLng} from "react-native-maps";
import {InTimeEvent} from "./InTimeEvent";

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
        Toast.show({description: errMsg || e.toString()});
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

export interface StorageEvents {
    [id: string]: {
        time: number,
        location: LatLng
    }
}

export async function getStorageEvents(): Promise<StorageEvents> {
    try {
        return JSON.parse(await AsyncStorage.getItem("@event-locations")) || {};
    } catch (e) {}

    return {};
}

async function setStorageEvents(storageEvents: StorageEvents) {
    try {
        await AsyncStorage.setItem("@event-locations", JSON.stringify(storageEvents));
    } catch (e) {}
}

export async function addStorageEvent(event: InTimeEvent) {
    await setStorageEvents({...(await getStorageEvents()), [event.general.id]: {time: event.general.time, location: event.location}});
}

export async function removeStorageEvent(eventId: string) {
    const current = await getStorageEvents();
    delete current[eventId];
    await setStorageEvents(current);
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