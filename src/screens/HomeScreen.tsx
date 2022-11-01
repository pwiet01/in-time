import React, {FC, useContext, useEffect, useLayoutEffect, useState} from "react";
import {NavScreen} from "../util/NavScreen";
import {Button, Center, Divider, Heading, Icon, View} from "native-base";
import {FlatList} from "react-native";
import {LangContext} from "../util/Context";
import {EventItem} from "./homeScreen/EventItem";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import MapView, {Marker} from 'react-native-maps';
import * as Location from "expo-location";

export const HomeScreen: FC<NavScreen> = (props) => {
    const {lang} = useContext(LangContext);
    const [showMap, setShowMap] = useState(false);

    const [location, setLocation] = useState(null);

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <View flexDir={"row"}>
                    <Button colorScheme={"transparent"} onPress={() => setShowMap(prevState => !prevState)}>
                        <Icon as={MaterialCommunityIcons} name={"plus"} color={"white"} size={"xl"} />
                    </Button>
                </View>
            )
        });
    }, [props.navigation]);

    useEffect(() => {
        async function loadLocation() {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const location = await Location.getCurrentPositionAsync();
                console.log(location);
                setLocation(location);
            }
        }

        if (showMap) {
            loadLocation();
        }
    }, [showMap]);

    if (showMap) {
        return (
            <Center w={"100%"} h={"100%"}>
                <MapView style={{width: "100%", height: "100%"}}
                         showsUserLocation
                         followsUserLocation
                         region={location && {
                             ...location.coords,
                             latitudeDelta: 0.01,
                             longitudeDelta: 0.01
                         }}
                >
                    <Marker coordinate={location.coords} title={"LOL"} description={"Mashallah"} />
                </MapView>
            </Center>
        );
    }

    return (
        <Center w={"100%"} h={"100%"} padding={5}>
            <Heading marginBottom={5} w={"95%"}>{lang.home.events}</Heading>
            <FlatList style={{width: "100%", flex: 1}} data={["test"]}
                      renderItem={({item}) => <EventItem eventId={item} />}
                      keyExtractor={(item) => item} ItemSeparatorComponent={() => <Divider margin={1} thickness={0} />} />
        </Center>
    );
};