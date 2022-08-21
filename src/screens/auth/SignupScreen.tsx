import React, {FC, useContext, useState} from "react";
import {Center, FormControl, Heading, Input, View} from "native-base";
import {NavScreen} from "../../util/NavScreen";
import {LangContext} from "../../util/Context";
import {AsyncButton} from "../../util/AsyncButton";
import {signUp} from "../../firebase/Auth";
import {protectedAsyncCall} from "../../util/Util";
import {ScreenWrapper} from "../../util/ScreenWrapper";

export const SignupScreen: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    async function handleSignUp() {
        await protectedAsyncCall(signUp, {email: email, password: password, displayName: name});
    }

    return (
        <ScreenWrapper>
            <Center w={"100%"} h={"100%"}>
                <View w={"80%"} alignItems={"flex-start"}>
                    <Heading marginBottom={5}>{lang.screens.signup}</Heading>
                    <View marginBottom={5} w={"100%"}>
                        <FormControl isInvalid={name.trim().length === 0} marginBottom={4}>
                            <Input placeholder={lang.auth.displayName} value={name} onChangeText={setName} />
                            <FormControl.ErrorMessage>
                                {lang.auth.specifyName}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <Input placeholder={lang.auth.email} value={email} onChangeText={setEmail} marginBottom={2} autoCapitalize={"none"} />
                        <Input placeholder={lang.auth.password} value={password} onChangeText={setPassword} type={"password"} autoCapitalize={"none"} />
                    </View>
                    <AsyncButton isDisabled={name.trim().length === 0} onPress={handleSignUp} marginRight={2}>{lang.auth.signup}</AsyncButton>
                </View>
            </Center>
        </ScreenWrapper>
    );
};