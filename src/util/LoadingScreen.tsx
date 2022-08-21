import React, {FC} from "react";
import {Center, Spinner} from "native-base";
import {ScreenWrapper} from "./ScreenWrapper";

export const LoadingScreen: FC = (_) => {

    return (
        <ScreenWrapper>
            <Center w={"100%"} h={"100%"}>
                <Spinner size={"lg"} />
            </Center>
        </ScreenWrapper>
    );
}