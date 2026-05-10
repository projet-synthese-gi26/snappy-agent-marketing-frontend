// src/services/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const chatService = {
    async getHistory(sessionId: string | null) {
        if (!sessionId) return [];
        const res = await fetch(`${API_BASE}/chat/${sessionId}/history`);
        if (!res.ok) throw new Error("Failed to fetch history");
        return res.json();
    },

    async sendHumanMessage(content: string, role: string, sessionId: string | null) {
        const res = await fetch(`${API_BASE}/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, role, content })
        });
        if (!res.ok) throw new Error("Failed to send message");
        return res.json(); // Retourne { status: 'ok', session_id: '...' }
    },

    async agentListen(message: string, sessionId: string | null) {
        const res = await fetch(`${API_BASE}/agent/listen`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, message })
        });
        if (!res.ok) throw new Error("Failed to listen");
        return res.json();
    },

    async agentRespond(message: string, sessionId: string | null, contextWindow: number) {
        const res = await fetch(`${API_BASE}/agent/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, message, context_window: contextWindow })
        });
        if (!res.ok) throw new Error("Agent failed to respond");
        return res.json();
    }
};