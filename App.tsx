import {NativeBaseProvider} from "native-base";
import {Root} from "./src/screens/auth/Root";
import {NavigationContainer, DefaultTheme} from "@react-navigation/native";
import {theme} from "./src/style/theme"
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "./src/firebase/firebase-config";
import {getDatabase} from "firebase/database"
import React from "react";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
    return (
        <NativeBaseProvider theme={theme}>
            <NavigationContainer theme={{
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    background: "transparent"
                }
            }}>
                <Root />
            </NavigationContainer>
        </NativeBaseProvider>
    );
}