"use client";

import { useState, useRef, useEffect } from 'react';
import {
    Search, Phone, Info, Smile, Paperclip, Send, Bot,
    CheckCheck, Plus, Bold, Italic, Sparkles
} from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'other';
    time: string;
    isAI?: boolean;
}

export default function ChatPage({ params }: { params: { chatId: string } }) {
    const [mode, setMode] = useState('ON');
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Salut ! Tu as eu le temps de regarder les nouveaux designs ?", sender: 'other', time: '10:30' },
        { id: 2, text: "Yes, je viens de jeter un oeil. C'est super propre !", sender: 'me', time: '10:32' },
        { id: 3, text: "Top ! Par contre, il faudrait retravailler le call-to-action.", sender: 'other', time: '10:35' },
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { scrollToBottom(); }, [messages]);

    // Fonction pour envoyer un message
    const handleSendMessage = (textOverride?: string) => {
        const messageContent = textOverride || inputText;
        if (!messageContent.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            text: messageContent,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            // Si le mode ON est actif, le message envoyé est marqué comme généré par IA
            isAI: mode === 'ON'
        };

        setMessages([...messages, newMessage]);
        setInputText('');
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* HEADER */}
            <header className="h-16 bg-white/80 backdrop-blur-md border-b px-6 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${params.chatId}`} className="w-10 h-10 rounded-full" />
                    <div>
                        <h2 className="font-bold text-sm capitalize">{params.chatId}</h2>
                        {mode === 'ON' && (
                            <span className="text-[10px] text-[#f37321] flex items-center gap-1 animate-pulse">
                <Sparkles size={10} /> Mode assistance IA actif
              </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-6 text-slate-400">
                    <Search size={20} /> <Phone size={20} /> <Info size={20} />
                </div>
            </header>

            {/* ZONE DE MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8f9fa]">
                // Dans le map des messages de app/chat/[chatId]/page.tsx
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} gap-1`}>
                        <div className={`max-w-[70%] p-4 shadow-sm text-[14px] relative ${
                            msg.sender === 'me'
                                ? 'bg-[#f37321] text-white rounded-2xl rounded-tr-none'
                                : 'bg-white text-slate-700 rounded-2xl rounded-tl-none border border-slate-100'
                        }`}>
                            {msg.text}
                            <div className={`text-[10px] mt-2 flex items-center justify-end gap-1 opacity-70`}>
                                {msg.time} {msg.sender === 'me' && <CheckCheck size={14} />}
                            </div>

                            {/* Badge IA pour l'utilisateur OU pour l'autre personne (Agent IA) */}
                            {msg.isAI && (
                                <div className={`absolute -bottom-6 flex items-center gap-1 font-bold text-[9px] uppercase ${
                                    msg.sender === 'me' ? 'right-0 text-[#f37321]' : 'left-0 text-blue-500'
                                }`}>
                                    <Bot size={10} /> {msg.sender === 'me' ? "Rédigé par mon IA" : "Réponse automatique IA"}
                                </div>
                            )}
                        </div>
                    </div>

                ))}

                {/* Suggestion d'IA qui s'affiche au-dessus de l'input quand on est en mode ON */}
                {mode === 'ON' && (
                    <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4">
                        <button
                            onClick={() => handleSendMessage("Je vois ce que tu veux dire. Je peux te proposer une version plus douce ?")}
                            className="bg-[#eef2ff] border border-blue-100 text-[#4f46e5] px-5 py-2 rounded-full flex items-center gap-2 text-xs shadow-sm hover:bg-blue-100 transition-all group"
                        >
                            <Bot size={14} className="group-hover:rotate-12 transition-transform" />
                            <span className="font-medium text-slate-500 italic">Suggestion :</span>
                            "Je vois ce que tu veux dire. Je peux te proposer..."
                        </button>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* FOOTER */}
            <footer className="p-6">
                <div className="max-w-4xl mx-auto flex flex-col gap-4">

                    {/* RADIO SWITCHER */}
                    <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200 w-fit items-center gap-1">
                        {['OFF', 'LISTEN', 'ON'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 ${
                                    mode === m ? 'bg-[#f37321] text-white' : 'text-slate-400 hover:bg-slate-50'
                                }`}
                            >
                                {m === 'ON' && <Bot size={14} />} {m}
                            </button>
                        ))}
                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                    </div>

                    {/* INPUT AREA */}
                    <div className="flex items-end gap-3">
                        <button className="mb-2 p-2 bg-slate-200/50 text-slate-500 rounded-full hover:bg-slate-200">
                            <Plus size={20} />
                        </button>

                        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm relative pt-6 pb-2 px-4 focus-within:border-[#f37321]">
                            {mode === 'ON' && (
                                <div className="absolute -top-2.5 left-4 bg-[#f37321] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase">
                                    Auto-pilote activé
                                </div>
                            )}

                            <textarea
                                rows={1}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                placeholder={mode === 'ON' ? "L'IA peut vous aider à répondre..." : "Écrivez un message..."}
                                className="w-full bg-transparent outline-none text-[14px] resize-none"
                            />

                            <div className="flex justify-between items-center mt-2 border-t border-slate-50 pt-2 text-slate-400">
                                <div className="flex gap-4"><Bold size={16} /> <Italic size={16} /> <Smile size={18} /></div>
                                <span className="text-[10px]">Appuyer sur Entrée pour envoyer</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleSendMessage()}
                            className="p-4 bg-[#f37321] text-white rounded-2xl shadow-lg shadow-orange-100 active:scale-95 transition-all"
                        >
                            <Send size={22} fill="currentColor" />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}