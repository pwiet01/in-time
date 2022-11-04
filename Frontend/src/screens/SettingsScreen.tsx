import React, {FC, useContext, useMemo} from "react";
import {NavScreen} from "../util/NavScreen";
import {Button, Center, Divider, ScrollView, useDisclose, View} from "native-base";
import {StandardDialog} from "../util/StandardDialog";
import {LangContext} from "../util/Context";
import {protectedAsyncCall} from "../util/Util";
import {signOut} from "../firebase/Auth";
import {LanguageSwitch} from "./settingsScreen/LanguageSwitch";
import {UserSettings} from "./settingsScreen/UserSettings";

export const SettingsScreen: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);
    const logout = useDisclose();

    function getLogoutConfirmDialog() {
        async function onAccept() {
            await protectedAsyncCall(signOut);
        }

        return (
            <StandardDialog title={lang.dialog.confirmAction} content={lang.auth.youWillBeLoggedOut}
                            isOpen={logout.isOpen} onAccept={onAccept} onClose={logout.onClose} />
        );
    }

    const fields = useMemo(() => [
        {key: "uid", comp: <UserSettings w={"100%"} />},
        {key: "lang-switch", comp: <LanguageSwitch w={"100%"} />},
        {key: "signout", comp: <Button w={"100%"} colorScheme={"danger"} onPress={logout.onOpen}>{lang.auth.signout}</Button>}
    ], [lang]);

    return (
        <Center w={"100%"} h={"100%"} padding={5}>
            <ScrollView w={"100%"} h={"100%"}>
                {fields.map(({key, comp}, index) => (
                    <View key={key}>
                        <View w={"100%"} padding={5}>{comp}</View>
                        {index < fields.length - 1 && <Divider w={"100%"} alignSelf={"center"} />}
                    </View>
                ))}
            </ScrollView>
            {getLogoutConfirmDialog()}
        </Center>
    );
};