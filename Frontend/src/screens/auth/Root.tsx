import React, {FC, useEffect, useState} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {LoginScreen} from "./LoginScreen";
import {AuthenticatedRoot} from "./AuthenticatedRoot";
import {headerStyle} from "../../style/theme";
import {getLang, getStorageValue, setStorageValue} from "../../util/Util";
import {SignupScreen} from "./SignupScreen";
import {User, onAuthStateChanged, getAuth} from "firebase/auth";
import {LangContext} from "../../util/Context";
import {Center, Spinner, Text, useColorModeValue} from "native-base";
import moment from "moment";
import "moment/locale/de";
import * as Localization from "expo-localization";

const Stack = createNativeStackNavigator();

export const Root: FC = (_) => {
    const [lang, setLang] = useState<{key: string, lang: any}>(getLang(null));
    const bgColor = useColorModeValue("coolGray.50", "blueGray.800");

    const [user, setUser] = useState<User>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const locale = Localization.locale.split("-")[0];

        async function loadLanguage() {
            let language = await getStorageValue("@language");
            if (!language) {
                language = locale;
                await setStorageValue("@language", language);
            }

            setLang(getLang(language));
        }

        loadLanguage();
        moment.locale(locale);

        return onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }

            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <Center w={"100%"} h={"100%"} bg={bgColor}>
                <Spinner size={"lg"} />
            </Center>
        );
    }

    return (
        <LangContext.Provider value={{lang: lang.lang, langKey: lang.key, setLang: async (id: string) => {
                const newLang = getLang(id);
                setLang(newLang);
                await setStorageValue("@language", newLang.key);
            }}}>
            <Stack.Navigator screenOptions={headerStyle}>
                {user ? (
                    <Stack.Screen name={"authenticated-root"} component={AuthenticatedRoot} options={{headerShown: false}}/>
                ) : (
                    <>
                        <Stack.Screen name={"login"} component={LoginScreen} options={{title: lang.lang.screens.login}} />
                        <Stack.Screen name={"signup"} component={SignupScreen} options={{title: lang.lang.screens.signup}} />
                    </>
                )}
            </Stack.Navigator>
        </LangContext.Provider>
    );
}