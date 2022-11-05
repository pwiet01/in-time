import React, {FC, useContext} from "react";
import {NavScreen} from "../../util/NavScreen";
import {EventInvitationsContext} from "../../util/Context";
import {Center, Divider} from "native-base";
import {FlatList} from "react-native";
import {EventItem} from "./EventItem";

export const EventInvitationsScreen: FC<NavScreen> = (props) => {
    const {eventInvitations} = useContext(EventInvitationsContext);

    return (
        <Center w={"100%"} h={"100%"} padding={5}>
            <FlatList style={{width: "100%", flex: 1}} data={eventInvitations}
                      renderItem={({item}) => <EventItem eventId={item}
                                                         onPress={() => props.navigation.navigate("event-screen", {id: item, isInvite: true})} />}
                      keyExtractor={(item) => item} ItemSeparatorComponent={() => <Divider margin={1} thickness={0} />} />
        </Center>
    );
}