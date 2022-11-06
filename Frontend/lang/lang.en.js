export const lang = {
    key: "en",
    title: "English",
    lang: {
        language: "Language"
    },
    screens: {
        login: "Login",
        signup: "Sign Up",
        home: "Events",
        community: "Community",
        settings: "Settings"
    },
    auth: {
        email: "Email",
        password: "Password",
        login: "Login",
        signup: "Sign Up",
        signout: "Sign Out",
        newAccount: "Sign Up",
        youWillBeLoggedOut: "You will be logged out!",
        displayName: "Name",
        specifyName: "Please enter a name!",
        editName: "Edit Name",
        editPhoto: "Edit Profile Photo",
        mustBeValidURL: "Enter a valid URL!"
    },
    dialog: {
        accept: "OK",
        cancel: "Cancel",
        confirmAction: "Confirm Action"
    },
    community: {
        friends: "Friends",
        leaderboard: "Leaderboard",
        friendWillBeDeleted: (name) => `${name} will be removed from your friends list!`,
        thisUser: "This user",
        search: "Search",
        searchUser: "Search User",
        uid: "User-ID",
        uidOrName: "User-ID or Name",
        requestSent: "Request Sent!",
        friendRequests: "Open Requests",
        friendRequest: "Friend Request",
        friendRequestDialogMsg: (name) => `Accept friend request from ${name}?`,
        accept: "Accept",
        reject: "Reject",
        itsYou: "It's you!"
    },
    home: {
        newEvent: "New Event",
        selectLocation: "Select Location",
        createEvent: "Create Event",
        specifyTitle: "Enter a title!",
        invalidEventTime: "Must be at least 15 minutes in the future!",
        eventTitle: "Title",
        eventCreated: "Event created!",
        event: "Event",
        participants: "Participants",
        invited: "Invited",
        location: "Location",
        eventStatus: {
            0: "Upcoming",
            1: "Meeting in",
            2: "Late",
            3: "Arrived"
        },
        inviteUsers: "Invite Friends",
        changesSaved: "Changes saved!",
        eventInvitations: "Invitations",
        inviteAccepted: "Invitation accepted!",
        inviteRejected: "Invitation rejected!",
        removeParticipantTitle: "Remove Participant",
        removeParticipant: (name) => `Remove ${name} from this event?`,
        leaveEventTitle: "Leave Event",
        leaveEvent: "Leave this event?",
        closed: "Closed",
        deleteEventTitle: "Delete Event",
        deleteEvent: "Delete this event?",
        closeEventTitle: "Close Event",
        closeEvent: "Close this event?"
    },
    other: {
        copied: "Saved to clipboard!",
        error: "Action failed",
        offline: "Establish an internet connection!",
        upcomingEvent: "Upcoming Event",
        late: "You are late!"
    }
};