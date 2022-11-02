import React, {FC} from "react";
import {Center, Spinner} from "native-base";

export const LoadingScreen: FC = (_) => {

    return (
        <Center w={"100%"} h={"100%"}>
            <Spinner size={"lg"} />
        </Center>
    );
}