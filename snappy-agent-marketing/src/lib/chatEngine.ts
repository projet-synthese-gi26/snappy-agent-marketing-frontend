import { loadDB, saveDB } from "./fakeDB";
import { generateAIReply } from "./fakeAI";

export function sendMessage(chatId: string, text: string, mode: string) {
    const db = loadDB();
    if (!db.chats[chatId]) db.chats[chatId] = { messages: [] };

    db.chats[chatId].messages.push({
        id: Date.now(),
        text,
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isAI: mode === "ON"
    });

    if (mode === "ON") {
        const aiText = generateAIReply(text);
        db.chats[chatId].messages.push({
            id: Date.now() + 1,
            text: aiText,
            sender: "other",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isAI: true
        });
    }

    saveDB(db);
}
