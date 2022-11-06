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
    community: {
        friends: "Freunde",
        leaderboard: "Rangliste",
        friendWillBeDeleted: (name) => `${name} wird aus deiner Freundesliste entfernt!`,
        thisUser: "Dieser Nutzer",
        search: "Suche",
        searchUser: "Nutzer suchen",
        uid: "Nutzer-ID",
        uidOrName: "Nutzer-ID oder Name",
        requestSent: "Anfrage gesendet!",
        friendRequests: "Offene Anfragen",
        friendRequest: "Freundschaftsanfrage",
        friendRequestDialogMsg: (name) => `Freundschaftsanfrage von ${name} annehmen?`,
        accept: "Annehmen",
        reject: "Ablehnen",
        itsYou: "Das bist du!"
    },
    home: {
        newEvent: "Neues Ereignis",
        selectLocation: "Ort auswählen",
        createEvent: "Ereignis erstellen",
        specifyTitle: "Gib einen Titel ein!",
        invalidEventTime: "Darf frühestens in 15 Minuten sein!",
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
        leaveEvent: "Dieses Ereignis verlassen?",
        closed: "Abgeschlossen",
        deleteEventTitle: "Ereignis löschen",
        deleteEvent: "Dieses Ereignis löschen?",
        closeEventTitle: "Event abschließen",
        closeEvent: "Dieses Event abschließen?"
    },
    other: {
        copied: "In Zwischenablage gespeichert!",
        error: "Aktion fehlgeschlagen",
        offline: "Stelle eine Internetverbindung her!",
        upcomingEvent: "Anstehendes Event",
        late: "Du bist zu spät!"
    }
};