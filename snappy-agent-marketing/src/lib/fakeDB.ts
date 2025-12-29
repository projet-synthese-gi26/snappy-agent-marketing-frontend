export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Message {
    id: number;
    text: string;
    sender: 'me' | 'other';
    time: string;
    isAI?: boolean;
}

export interface Chat {
    id: string;
    messages: Message[];
}

const DB_KEY = "nexchat_db";

export function loadDB() {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : { users: [], chats: {} };
}

export function saveDB(db: any) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}
