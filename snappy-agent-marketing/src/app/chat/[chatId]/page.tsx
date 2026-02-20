"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bot, Send, User, BrainCircuit, EyeOff, Briefcase, ChevronLeft } from 'lucide-react';

interface Message {
    id: string | number;
    text: string;
    sender: 'user' | 'agent'; 
    time: string;
}

export default function ChatPage({ params }: { params: { chatId: string } }) {
    const [mode, setMode] = useState<'OFF' | 'LISTEN' | 'ON'>('OFF');
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [role, setRole] = useState<'user' | 'agent'>('user');
    const [isLoading, setIsLoading] = useState(false);
    
    // Références pour gérer l'état de la machine (évite de trigger l'IA 2 fois sur le même message)
    const lastListenedMsgId = useRef<string | number | null>(null);
    const lastRespondedMsgId = useRef<string | number | null>(null);

    const sessionId = `session_${params.chatId}`;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { scrollToBottom(); }, [messages]);

    // 1. Détection du Rôle
    useEffect(() => {
        const savedRole = localStorage.getItem('chat_role') as 'user' | 'agent';
        if (savedRole) setRole(savedRole);
    }, []);

    // 2. POLLING BDD (Synchronisation)
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${sessionId}/history`);
                if (res.ok) {
                    const history = await res.json();
                    const mapped = history.map((m: any, i: number) => ({
                        id: `hist-${i}`,
                        text: m.content,
                        sender: m.role,
                        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    }));
                    setMessages(mapped);
                }
            } catch (err) {
                console.error("Erreur sync", err);
            }
        };

        fetchHistory(); 
        const interval = setInterval(fetchHistory, 2000);
        return () => clearInterval(interval);
    }, [sessionId]);

    // 3. LOGIQUE POMDP INTELLIGENTE (Gérée par le frontend du Vendeur)
    useEffect(() => {
        if (role !== 'agent' || messages.length === 0) return;

        // On regarde UNIQUEMENT le dernier message
        const lastMsg = messages[messages.length - 1];

        // L'IA ne réagit que si le dernier à avoir parlé est le client ('user')
        if (lastMsg.sender === 'user') {
            
            if (mode === 'LISTEN') {
                // Si on n'a pas encore écouté CE message précis
                if (lastListenedMsgId.current !== lastMsg.id) {
                    lastListenedMsgId.current = lastMsg.id;
                    console.log("👂 [POMDP] Entraînement sur le message...");
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/agent/listen`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ session_id: sessionId, message: lastMsg.text })
                    });
                }
            } 
            
            else if (mode === 'ON') {
                // Si on n'a pas encore répondu à CE message précis
                if (lastRespondedMsgId.current !== lastMsg.id) {
                    lastRespondedMsgId.current = lastMsg.id; // On verrouille immédiatement
                    setIsLoading(true);
                    console.log("🤖 [POMDP] Génération Action Optimale...");
                    
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/agent/respond`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ session_id: sessionId, message: lastMsg.text })
                    }).finally(() => setIsLoading(false));
                }
            }
        }
    }, [messages, mode, role, sessionId]); // Se déclenche quand la liste CHANGER OU le mode CHANGE


    // 4. ENVOI MANUEL DE MESSAGE
    const handleSendMessage = async () => {
        if (!inputText.trim()) return;
        const msgToSend = inputText;
        setInputText('');

        // Optimistic UI pour affichage instantané
        const tempId = Date.now();
        setMessages(prev => [...prev, { id: tempId, text: msgToSend, sender: role, time: 'Main' }]);

        // On verrouille manuellement l'IA pour ne pas qu'elle réponde à notre propre message
        lastRespondedMsgId.current = tempId;

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, role: role, content: msgToSend })
        });
    };

    return (
        <div className="flex flex-col h-full relative">
            <header className="h-16 bg-white border-b px-4 md:px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Bouton Retour Mobile */}
                    <Link href="/chat" className="md:hidden text-slate-500 hover:bg-slate-100 p-2 rounded-full">
                        <ChevronLeft size={24}/>
                    </Link>
                    
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${role === 'agent' ? 'bg-[#121820]' : 'bg-[#f37321]'}`}>
                        {role === 'agent' ? <Briefcase size={20}/> : <User size={20}/>}
                    </div>
                    <div>
                        <h2 className="font-bold text-sm">Discussion {role === 'agent' ? 'Client' : 'Support'}</h2>
                        <span className="text-[10px] text-slate-400">Rôle Actif: <strong className="uppercase">{role}</strong></span>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#f8f9fa]">
                {messages.map((msg) => {
                    const isMe = msg.sender === role;
                    return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-1`}>
                            <div className={`max-w-[85%] md:max-w-[75%] p-4 shadow-sm text-[14px] relative ${
                                isMe 
                                  ? (role === 'user' ? 'bg-[#f37321] text-white' : 'bg-[#121820] text-white') + ' rounded-2xl rounded-tr-none'
                                  : 'bg-white text-slate-700 rounded-2xl rounded-tl-none border border-slate-200'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex items-center gap-2 p-4">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 md:p-6 bg-white border-t">
                <div className="max-w-4xl mx-auto flex flex-col gap-4">
                    
                    {/* PANNEAU IA (Visible uniquement par l'Agent) - Scrollable sur mobile si besoin */}
                    {role === 'agent' && (
                        <div className="flex overflow-x-auto bg-slate-100 rounded-xl p-1 shadow-inner border border-slate-200 w-full md:w-fit items-center gap-1">
                            <button onClick={() => setMode('OFF')}
                                className={`flex-1 md:flex-none px-4 py-2 md:py-1.5 rounded-lg text-[11px] font-bold transition-all flex justify-center items-center gap-2 ${mode === 'OFF' ? 'bg-white text-slate-800 shadow' : 'text-slate-400 hover:text-slate-600'}`}>
                                <EyeOff size={14} /> OFF
                            </button>
                            <button onClick={() => setMode('LISTEN')}
                                className={`flex-1 md:flex-none px-4 py-2 md:py-1.5 rounded-lg text-[11px] font-bold transition-all flex justify-center items-center gap-2 ${mode === 'LISTEN' ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-slate-600'}`}>
                                <BrainCircuit size={14} /> LISTEN
                            </button>
                            <button onClick={() => setMode('ON')}
                                className={`flex-1 md:flex-none px-4 py-2 md:py-1.5 rounded-lg text-[11px] font-bold transition-all flex justify-center items-center gap-2 ${mode === 'ON' ? 'bg-[#f37321] text-white shadow' : 'text-slate-400 hover:text-slate-600'}`}>
                                <Bot size={14} /> AUTO
                            </button>
                        </div>
                    )}

                    <div className="flex items-end gap-3">
                        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl relative pt-4 pb-2 px-4">
                            <textarea
                                rows={1} value={inputText} onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                disabled={role === 'agent' && mode === 'ON'}
                                placeholder={role === 'agent' && mode === 'ON' ? "Snappy contrôle la discussion..." : "Tapez votre message..."}
                                className="w-full bg-transparent outline-none text-[14px] resize-none disabled:opacity-50"
                            />
                        </div>
                        <button onClick={handleSendMessage} disabled={role === 'agent' && mode === 'ON'}
                            className={`p-4 text-white rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 ${role === 'agent' ? 'bg-[#121820]' : 'bg-[#f37321]'}`}>
                            <Send size={22} />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}