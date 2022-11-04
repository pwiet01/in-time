import {lang as langDE} from "../../lang/lang.de";
import {lang as langEN} from "../../lang/lang.en";
import {Toast} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

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