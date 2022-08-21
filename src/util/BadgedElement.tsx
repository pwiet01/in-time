import React, {FC} from "react";
import {Badge, Center} from "native-base";

export type BadgeColor = "red" | "green";

interface BadgedElementProps {
    text: string,
    color: BadgeColor,
    width?: number,
    height?: number,
    offsetX?: string,
    offsetY?: string,
    children: any
}

export const BadgedElement: FC<BadgedElementProps> = (props) => {
    let color;

    switch (props.color) {
        case "red":
            color = "red.600";
            break;

        case "green":
        default:
            color = "green.600";
            break;
    }

    return (
        <Center>
            {props.children}
            {props.text != null &&
                <Badge bg={color} rounded={"full"} position={"absolute"} top={props.offsetY || 0} right={props.offsetX || 0}
                       w={props.width} h={props.height} _text={{fontSize: 10, color: "white"}}>
                    {props.text}
                </Badge>
            }
        </Center>
    );
}