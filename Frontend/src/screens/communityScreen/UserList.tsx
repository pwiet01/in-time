import React, {FC, useContext, useLayoutEffect, useRef} from "react";
import {NavScreen} from "../../util/NavScreen";
import {BadgeContext, LangContext, UsersContext} from "../../util/Context";
import {Button, Center, Divider, Heading, Icon, useDisclose, View} from "native-base";
import {UserProfile} from "./UserProfile";
import {FlatList} from "react-native";
import {getAuth} from "firebase/auth";
import {StandardDialog} from "../../util/StandardDialog";
import {CustomUser} from "../../util/CustomUser";
import {deleteFriend} from "../../firebase/Users";
import {protectedAsyncCall} from "../../util/Util";
import {Entypo, Feather} from "@expo/vector-icons";
import {BadgedElement} from "../../util/BadgedElement";

export const UserList: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);
    const {friends} = useContext(UsersContext);
    const {friendRequests} = useContext(BadgeContext);

    const selectedFriend = useRef<CustomUser | string>(null);
    const deleteFriendDialog = useDisclose();

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <View flexDir={"row"}>
                    <Button colorScheme={"transparent"} onPress={() => props.navigation.navigate("search-user")} marginRight={2}>
                        <Icon as={Entypo} name={"magnifying-glass"} color={"white"} size={"lg"} />
                    </Button>
                    <BadgedElement text={friendRequests.length > 0 ? friendRequests.length.toString() : null} color={"red"}>
                        <Button colorScheme={"transparent"} onPress={() => props.navigation.navigate("friend-requests")}>
                            <Icon as={Feather} name={"info"} color={"white"} size={"lg"} />
                        </Button>
                    </BadgedElement>
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

        return <StandardDialog title={lang.dialog.confirmAction} message={lang.community.friendWillBeDeleted(displayName)}
                               isOpen={deleteFriendDialog.isOpen} onClose={deleteFriendDialog.onClose}
                               onAccept={async () => {
                                   await protectedAsyncCall(() => deleteFriend(uid));
                                   deleteFriendDialog.onClose();
                               }} />
    }

    return (
        <View>
            <Center w={"100%"} h={"100%"} padding={5}>
                <UserProfile uid={getAuth().currentUser.uid} isMe onPress={() => {}} />
                <View flexDir={"row"} justifyContent={"space-between"} marginTop={10} marginBottom={5} w={"95%"}>
                    <Heading>{lang.community.friends}</Heading>
                    <Button variant={"link"} onPress={() => props.navigation.navigate("leaderboard")}>{lang.community.leaderboard}</Button>
                </View>
                <FlatList style={{width: "100%", flex: 1}} data={friends}
                          renderItem={({item}) => <UserProfile uid={item} onPress={handleFriendTap} />}
                          keyExtractor={(item) => item} ItemSeparatorComponent={() => <Divider margin={1} thickness={0} />} />
            </Center>
            {getDeleteFriendDialog()}
        </View>
    );
}