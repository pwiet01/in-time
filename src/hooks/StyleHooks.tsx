import {useColorModeValue, useToken} from "native-base";

export function useHeaderBg() {
    return useToken("colors", useColorModeValue("primary.700", "primary.900"));
}

export function useTabBarStyle() {
    const tabBarBackground = useToken("colors", useColorModeValue("coolGray.100", "blueGray.700"));
    const activeColor = useToken("colors", "primary.700");
    const inactiveColor = useToken("colors", useColorModeValue("coolGray.700", "coolGray.100"));

    return {
        tabBarBackground: tabBarBackground,
        activeColor: activeColor,
        inactiveColor: inactiveColor
    };
}