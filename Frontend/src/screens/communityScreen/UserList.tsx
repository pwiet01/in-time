import React, {FC, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {NavScreen} from "../../util/NavScreen";
import {FriendRequestsContext, LangContext} from "../../util/Context";
import {Button, Center, Divider, Heading, Icon, useDisclose, View} from "native-base";
import {UserProfile} from "./UserProfile";
import {FlatList} from "react-native";
import {getAuth} from "firebase/auth";
import {StandardDialog} from "../../util/StandardDialog";
import {CustomUser} from "../../util/CustomUser";
import {deleteFriend} from "../../firebase/Users";
import {protectedAsyncCall} from "../../util/Util";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {BadgedElement} from "../../util/BadgedElement";
import {child, getDatabase, onValue, ref} from "firebase/database";

export const UserList: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);
    const {friendRequests} = useContext(FriendRequestsContext);

    const selectedFriend = useRef<CustomUser | string>(null);
    const deleteFriendDialog = useDisclose();

    const [friendIds, setFriendIds] = useState<string[]>([]);
    const [friends, setFriends] = useState<{[id: string]: CustomUser}>({});
    const [friendsSorted, setFriendsSorted] = useState<CustomUser[]>([]);

    useEffect(() => {
        const userRef = ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/friends");
        return onValue(userRef, (snapshot) => {
            const value = snapshot.val();
            setFriendIds(value ? Object.keys(value) : []);
        });
    }, []);

    useEffect(() => {
        if (friendIds) {
            setFriends({});
            const friendsRef = ref(getDatabase(), "users");
            const unsubscribeList = friendIds.map(friendId => onValue(child(friendsRef, friendId + "/general"), snapshot => {
                const value = snapshot.val();
                setFriends(prev => ({...prev, [friendId]: {...value, uid: friendId}}));
            }));

            return () => unsubscribeList.forEach(unsub => unsub());
        }
    }, [friendIds]);

    useEffect(() => {
        if (friends && Object.keys(friends).length === friendIds.length) {
            const sortedFriends = Object.values(friends);
            sortedFriends.sort((a, b) => b.time - a.time);
            setFriendsSorted(sortedFriends);
        }
    }, [friends]);

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <View flexDir={"row"} alignItems={"center"}>
                    {
                        friendRequests.length > 0 &&
                        <BadgedElement text={friendRequests.length.toString()} color={"red"}>
                            <Button colorScheme={"transparent"} onPress={() => props.navigation.navigate("friend-requests")}>
                                <Icon as={MaterialCommunityIcons} name={"email"} color={"white"} size={"lg"} />
                            </Button>
                        </BadgedElement>
                    }
                    <Button colorScheme={"transparent"} onPress={() => props.navigation.navigate("search-user")} marginRight={2}>
                        <Icon as={MaterialCommunityIcons} name={"account-plus"} color={"white"} size={"lg"} />
                    </Button>
                </View>
            )
        });
    }, [props.navigation, friendRequests]);

    function handleFriendTap(user: CustomUser | string) {
        if (user != null) {
            selectedFriend.current = user;
            deleteFriendDialog.onOpen();
        }
    }

    function getDeleteFriendDialog() {
        if (!selectedFriend.current) {
            return <></>;
        }

        let uid;
        let displayName = lang.community.thisUser;

        if (typeof selectedFriend.current === "string") {
            uid = selectedFriend.current;
        } else {
            uid = selectedFriend.current.uid;
            displayName = selectedFriend.current.displayName;
        }

        return <StandardDialog title={lang.dialog.confirmAction} content={lang.community.friendWillBeDeleted(displayName)}
                               isOpen={deleteFriendDialog.isOpen} onClose={deleteFriendDialog.onClose}
                               onAccept={async () => {
                                   await protectedAsyncCall(() => deleteFriend(uid));
                                   deleteFriendDialog.onClose();
                               }} />
    }

    return useMemo(() => {
        return (
            <View>
                <Center w={"100%"} h={"100%"} padding={5}>
                    <UserProfile uid={getAuth().currentUser.uid} isMe onPress={() => {
                    }}/>
                    <Heading marginTop={10} marginBottom={3} alignSelf={"flex-start"}>{lang.community.friends}</Heading>
                    <FlatList style={{width: "100%", flex: 1}} data={friendsSorted}
                              renderItem={({item}) => <UserProfile user={item} onPress={handleFriendTap}/>}
                              keyExtractor={(item) => item.uid}
                              ItemSeparatorComponent={() => <Divider margin={1} thickness={0}/>}/>
                </Center>
                {getDeleteFriendDialog()}
            </View>
        );
    }, [friendsSorted, lang, deleteFriendDialog.isOpen]);
}