import {extendTheme} from "native-base";

export const theme = extendTheme({
    config: {
        initialColorMode: "dark"
    },
    colors: {
        primary: {
            50: '#E3F2F9',
            100: '#C5E4F3',
            200: '#A2D4EC',
            300: '#7AC1E4',
            400: '#47A9DA',
            500: '#0088CC',
            600: '#007AB8',
            700: '#006BA1',
            800: '#005885',
            900: '#003F5E',
        }
    }
});

export const headerStyle = {
    headerStyle: {
        backgroundColor: '#003F5E'
    },
    headerTintColor: "white"
};

export const tabBarStyle = {
    tabBarBackground: '#334155',
    activeColor: '#006BA1',
    inactiveColor: '#f3f4f6'
}