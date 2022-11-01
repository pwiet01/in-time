import React, {FC, useContext, useState} from "react";
import {Button, Center, Heading, Input, View} from "native-base";
import {NavScreen} from "../../util/NavScreen";
import {LangContext} from "../../util/Context";
import {protectedAsyncCall} from "../../util/Util";
import {signIn} from "../../firebase/Auth";
import {AsyncButton} from "../../util/AsyncButton";

export const LoginScreen: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    async function handleSignIn() {
        await protectedAsyncCall(signIn, {email: email, password: password});
    }

    return (
        <Center w={"100%"} h={"100%"}>
            <View w={"80%"} alignItems={"flex-start"}>
                <Heading marginBottom={5}>{lang.screens.login}</Heading>
                <View marginBottom={5} w={"100%"}>
                    <Input placeholder={lang.auth.email} value={email} onChangeText={setEmail} marginBottom={2} autoCapitalize={"none"} />
                    <Input placeholder={lang.auth.password} value={password} onChangeText={setPassword} type={"password"} autoCapitalize={"none"} />
                </View>
                <View flexDir={"row"}>
                    <AsyncButton onPress={handleSignIn} marginRight={2}>{lang.auth.login}</AsyncButton>
                    <Button onPress={() => props.navigation.navigate("signup")} colorScheme={"coolGray"}>{lang.auth.newAccount}</Button>
                </View>
            </View>
        </Center>
    );
};