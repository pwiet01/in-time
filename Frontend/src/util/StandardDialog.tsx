import React, {FC, useContext} from "react";
import {AlertDialog, Button, KeyboardAvoidingView} from "native-base";
import {LangContext} from "./Context";
import {AsyncButton} from "./AsyncButton";
import {Keyboard} from "react-native";

interface StandardDialogProps {
    title: string,
    content: any,
    isOpen: boolean,
    onAccept?: () => Promise<void>,
    onClose: () => void,
    customButtonGroup?: JSX.Element,
    acceptDisabled?: boolean
}

export const StandardDialog: FC<StandardDialogProps> = (props) => {
    const cancelRef = React.useRef(null);
    const {lang} = useContext(LangContext);

    return (
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={props.isOpen} onClose={props.onClose}>
            <AlertDialog.Content>
                <KeyboardAvoidingView>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>{props.title}</AlertDialog.Header>
                    <AlertDialog.Body>
                        {props.content}
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        {props.customButtonGroup ||
                            <Button.Group space={2}>
                                <Button variant="unstyled" colorScheme="coolGray" onPress={props.onClose} ref={cancelRef}>
                                    {lang.dialog.cancel}
                                </Button>
                                <AsyncButton isDisabled={props.acceptDisabled} colorScheme="primary" onPress={props.onAccept}>
                                    {lang.dialog.accept}
                                </AsyncButton>
                            </Button.Group>
                        }
                    </AlertDialog.Footer>
                </KeyboardAvoidingView>
            </AlertDialog.Content>
        </AlertDialog>
    );
}