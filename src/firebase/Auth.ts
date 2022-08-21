import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as fbSignOut, getAuth, User, updateProfile} from "firebase/auth";
import {getDatabase, ref, set} from "firebase/database";

export async function signIn({email, password}): Promise<User> {
    return (await signInWithEmailAndPassword(getAuth(), email.trim(), password.trim())).user;
}

export async function signUp({email, password, displayName}): Promise<User> {
    const user = (await createUserWithEmailAndPassword(getAuth(), email.trim(), password.trim())).user;
    await updateProfile(user, {displayName: displayName.trim()});

    await set(ref(getDatabase(), "users/" + user.uid + "/general"), {
        displayName: user.displayName,
        time: 0
    });

    return user;
}

export async function signOut(): Promise<void> {
    await fbSignOut(getAuth());
}