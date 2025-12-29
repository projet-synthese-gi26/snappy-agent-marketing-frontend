export type ChatMode = 'OFF' | 'LISTEN' | 'ON';

export interface Message {
    id: string;
    sender: 'HUMAN' | 'AI' | 'CUSTOMER';
    text: string;
    isSuggestion?: boolean; // Pour le mode LISTEN
    timestamp: Date;
}

export interface Discussion {
    id: string;
    contactName: string;
    lastMsg: string;
    status: 'ACTIVE' | 'ARCHIVED'; // Correspond à ton diagramme
    messages: Message[];
    mode: ChatMode;
}

export interface User {
    id: string;
    username: string;
    role: 'AGENT';
}