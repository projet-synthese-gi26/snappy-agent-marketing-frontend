import { loadDB, saveDB, User } from "./fakeDB";

const AUTH_KEY = "nexchat_user";

export function register(name: string, email: string) {
    const db = loadDB();
    const user: User = { id: Date.now().toString(), name, email };
    db.users.push(user);
    saveDB(db);
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
}

export function login(email: string) {
    const db = loadDB();
    const user = db.users.find((u: User) => u.email === email);
    if (!user) throw new Error("Utilisateur non trouvé");
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
}

export function getCurrentUser(): User | null {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
}
