export const lang = {
    key: "de",
    title: "Deutsch",
    lang: {
        language: "Sprache"
    },
    screens: {
        login: "Anmelden",
        signup: "Registrieren",
        home: "Ereignisse",
        community: "Community",
        settings: "Einstellungen"
    },
    auth: {
        email: "Email",
        password: "Passwort",
        login: "Anmelden",
        signup: "Registrieren",
        signout: "Abmelden",
        newAccount: "Neu hier?",
        youWillBeLoggedOut: "Du wirst ausgeloggt!",
        displayName: "Name",
        photoURL: "Bild URL",
        specifyName: "Gib einen Namen ein!",
        editName: "Namen bearbeiten",
        editPhoto: "Profilbild bearbeiten",
        mustBeValidURL: "Gib eine valide URL ein!"
    },
    dialog: {
        accept: "OK",
        cancel: "Abbrechen",
        confirmAction: "Aktion bestätigen"
    },
    colorMode: {
        theme: "Stil"
    },
    community: {
        friends: "Freunde",
        leaderboard: "Rangliste",
        friendWillBeDeleted: (name) => `${name} wird aus deiner Freundesliste entfernt!`,
        thisUser: "Dieser Nutzer",
        search: "Suche",
        searchUser: "Nutzer suchen",
        uid: "Nutzer-ID",
        requestSent: "Anfrage gesendet!",
        friendRequests: "Offene Anfragen",
        friendRequest: "Freundschaftsanfrage",
        friendRequestDialogMsg: (name) => `${name} und du könnten beste Freunde werden!`,
        accept: "Annehmen",
        reject: "Ablehnen",
        itsYou: "Das bist du!"
    },
    home: {
        newEvent: "Neues Ereignis",
        selectLocation: "Ort auswählen",
        createEvent: "Ereignis erstellen",
        specifyTitle: "Gib einen Titel ein!",
        invalidEventTime: "Darf frühestens in 20 Minuten sein!",
        eventTitle: "Titel",
        eventCreated: "Ereignis erstellt!",
        event: "Ereignis",
        participants: "Teilnehmer",
        invited: "Eingeladen",
        location: "Ort",
        eventStatus: {
            0: "Anstehend",
            1: "Treffen in",
            2: "Verspätung",
            3: "Angekommen"
        },
        inviteUsers: "Freunde einladen",
        changesSaved: "Änderungen gespeichert!",
        eventInvitations: "Einladungen",
        inviteAccepted: "Einladung angenommen!",
        inviteRejected: "Einladung abgelehnt!",
        removeParticipantTitle: "Teilnehmer entfernen",
        removeParticipant: (name) => `${name} aus diesem Ereignis entfernen?`,
        leaveEventTitle: "Ereignis verlassen",
        leaveEvent: "Dieses Ereignis verlassen?"
    },
    hints: {
        currentlyOffline: "Du bist offline!"
    },
    other: {
        copied: "Kopiert!"
    }
};