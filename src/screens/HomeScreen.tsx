import React, {FC, useContext, useLayoutEffect} from "react";
import {NavScreen} from "../util/NavScreen";
import {ScreenWrapper} from "../util/ScreenWrapper";
import {Button, Center, Divider, Heading, Icon, View} from "native-base";
import {FlatList} from "react-native";
import {LangContext} from "../util/Context";
import {EventItem} from "./homeScreen/EventItem";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export const HomeScreen: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <View flexDir={"row"}>
                    <Button colorScheme={"transparent"} onPress={() => {}}>
                        <Icon as={MaterialCommunityIcons} name={"plus"} color={"white"} size={"xl"} />
                    </Button>
                </View>
            )
        });
    }, [props.navigation]);

    return (
        <ScreenWrapper>
            <Center w={"100%"} h={"100%"} padding={5}>
                <Heading marginBottom={5} w={"95%"}>{lang.home.events}</Heading>
                <FlatList style={{width: "100%", flex: 1}} data={["test"]}
                          renderItem={({item}) => <EventItem eventId={item} />}
                          keyExtractor={(item) => item} ItemSeparatorComponent={() => <Divider margin={1} thickness={0} />} />
            </Center>
        </ScreenWrapper>
    );
};