import {NativeBaseProvider} from "native-base";
import {Root} from "./src/screens/auth/Root";
import {NavigationContainer, DefaultTheme} from "@react-navigation/native";
import {theme} from "./src/style/theme";
import {initializeApp} from "firebase/app";
import {initializeAuth} from "firebase/auth";
import {getReactNativePersistence} from 'firebase/auth/react-native';
import {firebaseConfig} from "./src/firebase/firebase-config";
import {getDatabase} from "firebase/database";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = initializeAuth(app, {persistence: getReactNativePersistence(AsyncStorage)});

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