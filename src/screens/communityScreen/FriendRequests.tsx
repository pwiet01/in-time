import React, {FC, useContext, useRef} from "react";
import {NavScreen} from "../../util/NavScreen";
import {ScreenWrapper} from "../../util/ScreenWrapper";
import {Button, Center, Divider, useDisclose, View} from "native-base";
import {UserProfile} from "./UserProfile";
import {FlatList} from "react-native";
import {BadgeContext, LangContext} from "../../util/Context";
import {CustomUser} from "../../util/CustomUser";
import {StandardDialog} from "../../util/StandardDialog";
import {protectedAsyncCall} from "../../util/Util";
import {acceptRequest, rejectRequest} from "../../firebase/Users";
import {AsyncButton} from "../../util/AsyncButton";

export const FriendRequests: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);
    const {friendRequests} = useContext(BadgeContext);
    const addFriendDialog = useDisclose();

    const selectedFriend = useRef<CustomUser | string>(null);

    function handleFriendTap(user: CustomUser | string) {
        if (user != null) {
            selectedFriend.current = user;
            addFriendDialog.onOpen();
        }
    }

    function getAddFriendDialog() {
        if (!selectedFriend.current) {
            return <></>;
        }

        let uid;
        let displayName = "...";

        if (typeof selectedFriend.current === "string") {
            uid = selectedFriend.current;
        } else {
            uid = selectedFriend.current.uid;
            displayName = selectedFriend.current.displayName;
        }

        const customButtons = (
            <Button.Group space={2}>
                <Button colorScheme="danger" onPress={async () => {
                    await protectedAsyncCall(rejectRequest, uid);
                    addFriendDialog.onClose();
                }}>
                    {lang.community.reject}
                </Button>
                <AsyncButton colorScheme="primary" onPress={async () => {
                    await protectedAsyncCall(acceptRequest, uid);
                    addFriendDialog.onClose();
                }}>
                    {lang.community.accept}
                </AsyncButton>
            </Button.Group>
        );

        return <StandardDialog title={lang.community.friendRequest} message={lang.community.friendRequestDialogMsg(displayName)}
                               isOpen={addFriendDialog.isOpen} onClose={addFriendDialog.onClose}
                               customButtonGroup={customButtons} />
    }

    return (
        <ScreenWrapper>
            <View>
                <Center w={"100%"} h={"100%"} padding={5}>
                    <FlatList style={{width: "100%", flex: 1}} data={friendRequests}
                              renderItem={({item}) => <UserProfile uid={item} onPress={handleFriendTap} />}
                              keyExtractor={(item) => item} ItemSeparatorComponent={() => <Divider margin={1} thickness={0} />} />
                </Center>
                {getAddFriendDialog()}
            </View>
        </ScreenWrapper>
    );
}