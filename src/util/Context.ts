import {createContext} from "react";

export const LangContext = createContext(null);
export const UsersContext = createContext<{friends: string[]}>(null);
export const BadgeContext = createContext<{friendRequests: string[]}>(null);