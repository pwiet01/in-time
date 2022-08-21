import {NativeBaseProvider} from "native-base";
import {Root} from "./src/screens/auth/Root";
import {NavigationContainer} from "@react-navigation/native";
import {theme, colorModeManager} from "./src/style/theme"
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "./src/firebase/firebase-config";
import {getDatabase, onValue, ref} from "firebase/database"
import {useEffect, useState} from "react";
import {OnlineContext} from "./src/util/Context";
import * as SystemUI from 'expo-system-ui';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
    const [online, setOnline] = useState<boolean>(true);

    useEffect(() => {
        const connectedRef = ref(db, ".info/connected");
        return onValue(connectedRef, (snap) => {
            setOnline(snap.val() || false);
        });
    }, []);

    return (
        <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
            <OnlineContext.Provider value={online}>
                <NavigationContainer>
                    <Root />
                </NavigationContainer>
            </OnlineContext.Provider>
        </NativeBaseProvider>
    );
}