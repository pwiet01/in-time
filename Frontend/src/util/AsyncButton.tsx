import React, {FC, useState} from "react";
import {Button} from "native-base";

interface AsyncButtonProps {
    onPress: () => Promise<void>,
    [style: string]: any
}

export const AsyncButton: FC<AsyncButtonProps> = (props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handlePress() {
        setIsLoading(true);
        await props.onPress();
        setIsLoading(false);
    }

    return <Button {...props} onPress={handlePress} isLoading={isLoading}>{props.children}</Button>;
}