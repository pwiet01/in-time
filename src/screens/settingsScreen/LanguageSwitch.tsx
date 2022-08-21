import React, {FC, useContext} from "react";
import {LangContext} from "../../util/Context";
import {Select, Text, View} from "native-base";
import {getAllLanguages} from "../../util/Util";

interface LanguageSwitchProps {
    [style: string]: any
}

export const LanguageSwitch: FC<LanguageSwitchProps> = (props) => {
    const {lang, setLang, langKey} = useContext(LangContext);

    return (
        <View justifyContent={"space-between"} alignItems={"center"} flexDir={"row"} {...props}>
            <Text>{lang.lang.language}</Text>
            <Select selectedValue={langKey} onValueChange={setLang} w={200}>
                {getAllLanguages().map((language) =>
                    <Select.Item key={language.key} label={language.title} value={language.key} />)}
            </Select>
        </View>
    );
}