import React, {FC, useContext, useEffect, useState} from "react";
import {NavScreen} from "../../util/NavScreen";
import * as Location from "expo-location";
import {Button, Center, useDisclose, View} from "native-base";
import MapView, {LatLng, Marker} from "react-native-maps";
import {NewEventDialog} from "./NewEventDialog";
import {LangContext} from "../../util/Context";

export const NewEventScreen: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);

    const [location, setLocation] = useState(null);
    const [marker, setMarker] = useState<LatLng>(null);

    const addDialog = useDisclose();

    useEffect(() => {
        async function loadLocation() {
            try {
                const location = await Location.getCurrentPositionAsync();
                setLocation(location);
            } catch (e) {}
        }

        loadLocation();
    }, []);

    function closeAll() {
        addDialog.onClose();
        props.navigation.goBack();
    }

    return (
        <View>
            <Center w={"100%"} h={"100%"}>
                <MapView style={{width: "100%", height: "100%"}}
                         showsUserLocation
                         initialRegion={location && {
                             ...location.coords,
                             latitudeDelta: 0.01,
                             longitudeDelta: 0.01
                         }}
                         onPress={(event) => {
                             setMarker(event.nativeEvent.coordinate);
                         }}
                >
                    {marker && <Marker coordinate={marker} />}
                </MapView>
                <Button w={"90%"} position={"absolute"} bottom={3} colorScheme={"tertiary"} onPress={addDialog.onOpen} isDisabled={!marker}>
                    {!marker ? lang.home.selectLocation : lang.home.createEvent}
                </Button>
            </Center>
            <NewEventDialog isOpen={addDialog.isOpen} onClose={addDialog.onClose} location={marker} closeAll={closeAll} />
        </View>
    );
}