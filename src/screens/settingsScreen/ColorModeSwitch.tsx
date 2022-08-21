import React, {FC, useContext} from "react";
import {LangContext} from "../../util/Context";
import {Button, Icon, Select, Text, useColorMode, View} from "native-base";
import {Feather} from "@expo/vector-icons";

interface ColorModeSwitchProps {
    [style: string]: any
}

export const ColorModeSwitch: FC<ColorModeSwitchProps> = (props) => {
    const {lang} = useContext(LangContext);
    const {colorMode, toggleColorMode} = useColorMode();

    return (
        <View justifyContent={"space-between"} alignItems={"center"} flexDir={"row"} {...props}>
            <Text>{lang.colorMode.theme}</Text>
            <Button onPress={toggleColorMode} colorScheme={"transparent"}>
                <Icon as={Feather} name={colorMode === "light" ? "sun" : "moon"} size={"md"} />
            </Button>
        </View>
    );
}