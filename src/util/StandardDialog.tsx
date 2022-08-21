import React, {FC, useContext} from "react";
import {AlertDialog, Button} from "native-base";
import {LangContext} from "./Context";
import {AsyncButton} from "./AsyncButton";

interface StandardDialogProps {
    title: string,
    message: string,
    isOpen: boolean,
    onAccept?: () => Promise<void>,
    onClose: () => void,
    customButtonGroup?: JSX.Element
}

export const StandardDialog: FC<StandardDialogProps> = (props) => {
    const cancelRef = React.useRef(null);
    const {lang} = useContext(LangContext);

    return (
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={props.isOpen} onClose={props.onClose}>
            <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>{props.title}</AlertDialog.Header>
                <AlertDialog.Body>
                    {props.message}
                </AlertDialog.Body>
                <AlertDialog.Footer>
                    {props.customButtonGroup ||
                        <Button.Group space={2}>
                            <Button variant="unstyled" colorScheme="coolGray" onPress={props.onClose} ref={cancelRef}>
                                {lang.dialog.cancel}
                            </Button>
                            <AsyncButton colorScheme="primary" onPress={props.onAccept}>
                                {lang.dialog.accept}
                            </AsyncButton>
                        </Button.Group>
                    }
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
    );
}