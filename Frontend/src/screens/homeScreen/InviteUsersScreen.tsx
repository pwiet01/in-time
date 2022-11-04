import React, {FC, useContext, useEffect, useLayoutEffect, useState} from "react";
import {NavScreen} from "../../util/NavScreen";
import {Button, Center, Divider, Icon, View} from "native-base";
import {getDatabase, onValue, ref} from "firebase/database";
import {getAuth} from "firebase/auth";
import {UserProfile} from "../communityScreen/UserProfile";
import {FlatList} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {protectedAsyncCall} from "../../util/Util";
import {setEventInvitations} from "../../firebase/Events";
import {LangContext} from "../../util/Context";

export const InviteUsersScreen: FC<NavScreen> = (props) => {
    const [friends, setFriends] = useState<string[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<string[]>([]);
    const [invited, setInvited] = useState<string[]>([]);

    const {lang} = useContext(LangContext);

    useEffect(() => {
        const userRef = ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/friends");
        return onValue(userRef, (snapshot) => {
            const value = snapshot.val();
            setFriends(value ? Object.keys(value) : []);
        });
    }, []);

    useEffect(() => {
        const invitedRef = ref(getDatabase(), "events/" + props.route.params.eventId + "/participants");
        return onValue(invitedRef, (snapshot) => {
            const value: {[id: string]: any} = snapshot.val();
            setInvited(Object.entries(value).filter(([_, {accepted}]) => !accepted).map(([id, _]) => id));
            setFilteredFriends(friends.filter(friend => !value[friend]));
        });
    }, [friends]);

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <Button colorScheme={"transparent"} onPress={handleSave} marginRight={2}>
                    <Icon as={MaterialCommunityIcons} name={"check"} color={"white"} size={"lg"} />
                </Button>
            )
        });
    }, [props.navigation, invited]);

    async function handleSave() {
        if ((await protectedAsyncCall(() =>
            setEventInvitations(props.route.params.eventId, invited), null, lang.home.changesSaved)).success) {
            props.navigation.goBack();
        }
    }

    function handleFriendTap(uid: string) {
        if (invited.includes(uid)) {
            setInvited(prev => prev.filter(item => item !== uid));
        } else {
            setInvited(prev => [...prev, uid]);
        }
    }

    function renderFriend(uid: string) {
        return (
            <View rounded={"xl"} borderWidth={2} borderColor={invited.includes(uid) ? "emerald.500" : "transparent"}>
                <UserProfile uid={uid} onPress={() => handleFriendTap(uid)} />
            </View>
        );
    }

    return (
        <Center w={"100%"} h={"100%"} padding={5}>
            <FlatList style={{width: "100%", flex: 1}} data={filteredFriends}
                      renderItem={({item}) => renderFriend(item)}
                      keyExtractor={(item) => item} ItemSeparatorComponent={() => <Divider margin={1} thickness={0} />} />
        </Center>
    );
}