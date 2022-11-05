import React, {FC, useContext, useState} from "react";
import {StandardDialog} from "../../util/StandardDialog";
import {Button, FormControl, Input, useDisclose, View} from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import {LangContext} from "../../util/Context";
import {createEvent} from "../../firebase/Events";
import {eventConfig, InTimeEvent} from "../../util/InTimeEvent";
import {LatLng} from "react-native-maps";
import {protectedAsyncCall} from "../../util/Util";
import moment from "moment";
import {getAuth} from "firebase/auth";

interface NewEventDialogProps {
    location: LatLng,
    isOpen: boolean,
    onClose: () => void,
    closeAll: () => void
}

export const NewEventDialog: FC<NewEventDialogProps> = (props) => {
    const {lang} = useContext(LangContext);

    const [title, setTitle] = useState<string>("");

    const datePicker = useDisclose();
    const timePicker = useDisclose();
    const [date, setDate] = useState<Date>(new Date(Date.now() + 1800000));

    function getContent() {
        return (
            <View justifyContent={"center"} alignItems={"center"} w={"90%"} alignSelf={"center"}>
                <FormControl isInvalid={title.trim().length === 0}>
                    <Input value={title} onChangeText={setTitle} w={"100%"} placeholder={lang.home.eventTitle} />
                    <FormControl.ErrorMessage>
                        {lang.home.specifyTitle}
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={date.getTime() - new Date().getTime() < eventConfig.earliestNewEvent}>
                    <View flexDir={"row"} alignSelf={"flex-start"} marginTop={3}>
                        <Button onPress={datePicker.onOpen} marginRight={1} variant={"outline"}>
                            {moment(date).format("L")}
                        </Button>
                        <Button onPress={timePicker.onOpen} variant={"outline"}>
                            {moment(date).format("LT")}
                        </Button>
                    </View>
                    <FormControl.ErrorMessage>
                        {lang.home.invalidEventTime}
                    </FormControl.ErrorMessage>
                </FormControl>
                {datePicker.isOpen && <DateTimePicker mode={"date"} value={date} onChange={(e, date) => {
                    datePicker.onClose();
                    setDate(date);
                }} />}
                {timePicker.isOpen && <DateTimePicker mode={"time"} value={date} onChange={(e, date) => {
                    timePicker.onClose();
                    setDate(date);
                }} />}
            </View>
        );
    }

    async function addEvent() {
        const event: InTimeEvent = {
            admin: getAuth().currentUser.uid,
            general: {
                id: null,
                title: title,
                time: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()).getTime()
            },
            location: props.location,
            participants: null
        };

        if ((await protectedAsyncCall(() => createEvent(event), null, lang.home.eventCreated)).success) {
            props.closeAll();
        }
    }

    return <StandardDialog title={lang.home.createEvent} content={getContent()} isOpen={props.isOpen} onClose={props.onClose}
                           acceptDisabled={title.trim().length === 0}
                           onAccept={addEvent} />
}