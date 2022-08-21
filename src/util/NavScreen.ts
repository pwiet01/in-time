import {NavigationProp} from "@react-navigation/native";

export interface NavScreen {
    navigation: NavigationProp<any>,
    route: {
        params?: {
            [key: string]: any
        }
    }
}