import {createContext} from "react";

export const LangContext = createContext(null);
export const FriendRequestsContext = createContext<{friendRequests: string[]}>(null);
export const EventInvitationsContext = createContext<{eventInvitations: string[]}>(null);