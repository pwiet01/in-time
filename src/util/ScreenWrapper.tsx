import React, {FC, useContext} from "react";
import {Center, Text, useColorModeValue, useContrastText, View} from "native-base";
import {LangContext, OnlineContext} from "./Context";

export const ScreenWrapper: FC<any> = ({children}) => {
    const {lang} = useContext(LangContext);
    const online = useContext(OnlineContext);

    const bgColor = useColorModeValue("coolGray.50", "blueGray.800");

    const hintColor = useColorModeValue("coolGray.400", "blueGray.500");
    const hintTextColor = useContrastText(hintColor);
    const hintText = lang.hints.currentlyOffline;

    return (
        <View w={"100%"} h={"100%"}>
            {!online &&
            <Center w={"100%"} bg={hintColor}>
                <Text fontSize={"sm"} color={hintTextColor}>{hintText}</Text>
            </Center>}
            <View bg={bgColor} w={"100%"} flex={1}>
                {children}
            </View>
        </View>
    );
}