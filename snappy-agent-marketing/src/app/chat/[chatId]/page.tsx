// src/app/chat/[chatId]/page.tsx
"use client";

import { useState, useRef, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { Bot, Send, User, BrainCircuit, EyeOff, Briefcase, ChevronLeft, Settings2 } from 'lucide-react';
import { chatService } from '@/services/api';

interface Message {
    id: string | number;
    text: string;
    sender: 'user' | 'agent'; 
    time: string;
}

export default function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
    // 0. DÉBALLAGE DES PARAMS (Nouveauté Next.js 15)
    const { chatId } = use(params);

    // --- ÉTATS ---
    const [mode, setMode] = useState<'OFF' | 'LISTEN' | 'ON'>('OFF');
    const [contextWindow, setContextWindow] = useState<number>(6); // Fenêtre de contexte modifiable
    const [showSettings, setShowSettings] = useState(false);
    
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [role, setRole] = useState<'user' | 'agent'>('user');
    const [isLoading, setIsLoading] = useState(false);
    
    // Identifiant de session dynamique
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Suivi machine à état
    const processedCount = useRef<number>(0);
    const lastListenedMsgId = useRef<string | number | null>(null);
    const lastRespondedMsgId = useRef<string | number | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { scrollToBottom(); }, [messages]);

    // --- INITIALISATION ---
    useEffect(() => {
        // Rôle
        const savedRole = localStorage.getItem('chat_role') as 'user' | 'agent';
        if (savedRole) setRole(savedRole);

        // Session ID dynamique
        const storageKey = `snappy_session_${chatId}`;
        const savedSession = localStorage.getItem(storageKey);
        if (savedSession) setSessionId(savedSession);
    }, [chatId]);

    // --- MISE A JOUR DU SESSION ID ---
    const updateSessionId = useCallback((newId: string) => {
        setSessionId(newId);
        localStorage.setItem(`snappy_session_${chatId}`, newId);
    }, [chatId]);

    // --- POLLING ---
    useEffect(() => {
        if (!sessionId) return; // Ne pas poll si la conversation n'a pas commencé

        const fetchHistory = async () => {
            try {
                const history = await chatService.getHistory(sessionId);
                const mapped = history.map((m: any, i: number) => ({
                    id: `hist-${i}`,
                    text: m.content,
                    sender: m.role,
                    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                }));
                
                // On ne met à jour que si on a de nouveaux messages du serveur
                // Cela évite de supprimer le message local optimiste avant qu'il ne soit persisté
                setMessages(prev => {
                    if (mapped.length > prev.filter(m => String(m.id).startsWith('hist-')).length) {
                        return mapped;
                    }
                    return prev;
                });
                
                // Si c'est le premier chargement complet
                if (processedCount.current === 0 && mapped.length > 0) {
                    processedCount.current = mapped.length;
                }
            } catch (err) {
                console.error("Erreur sync", err);
            }
        };

        fetchHistory(); 
        const interval = setInterval(fetchHistory, 2000);
        return () => clearInterval(interval);
    }, [sessionId]);

    // --- LOGIQUE POMDP ---
    useEffect(() => {
        if (role !== 'agent' || messages.length <= processedCount.current) return;

        const newMessages = messages.slice(processedCount.current);
        processedCount.current = messages.length;

        const lastUserMsg = [...newMessages].reverse().find(m => m.sender === 'user');

        if (lastUserMsg) {
            if (mode === 'LISTEN' && lastListenedMsgId.current !== lastUserMsg.id) {
                lastListenedMsgId.current = lastUserMsg.id;
                console.log("👂 [POMDP] Entraînement en tâche de fond...");
                chatService.agentListen(lastUserMsg.text, sessionId).then(res => {
                    if (res.session_id && !sessionId) updateSessionId(res.session_id);
                }).catch(console.error);
            } 
            else if (mode === 'ON' && lastRespondedMsgId.current !== lastUserMsg.id) {
                lastRespondedMsgId.current = lastUserMsg.id;
                setIsLoading(true);
                console.log(`🤖 [POMDP] Génération (Fenêtre: ${contextWindow} msgs)...`);
                chatService.agentRespond(lastUserMsg.text, sessionId, contextWindow).then(res => {
                    if (res.session_id && !sessionId) updateSessionId(res.session_id);
                }).catch(console.error).finally(() => setIsLoading(false));
            }
        }
    }, [messages, mode, role, sessionId, contextWindow, updateSessionId]);


    // --- ENVOI MANUEL ---
    const handleSendMessage = async () => {
        if (!inputText.trim()) return;
        const msgToSend = inputText;
        setInputText('');

        const tempId = Date.now();
        setMessages(prev => [...prev, { id: tempId, text: msgToSend, sender: role, time: 'Main' }]);
        lastRespondedMsgId.current = tempId;

        try {
            const res = await chatService.sendHumanMessage(msgToSend, role, sessionId);
            // On récupère le SessionID si c'était le 1er message du chat !
            if (res.session_id && !sessionId) {
                updateSessionId(res.session_id);
            }
        } catch (e) {
            console.error("Erreur d'envoi", e);
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <header className="h-16 bg-white border-b px-4 md:px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                {messages.length === 0 && (
                    <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                        Envoyez un message pour démarrer la session.
                    </div>
                )}
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
                    
                    {/* PANNEAU IA (Visible uniquement par l'Agent) */}
                    {role === 'agent' && (
                        <div className="flex flex-col gap-2">
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
                                
                                <button onClick={() => setShowSettings(!showSettings)} 
                                    className="px-3 py-1.5 text-slate-400 hover:text-slate-700 ml-auto border-l border-slate-300">
                                    <Settings2 size={16} />
                                </button>
                            </div>

                            {/* Options avancées : Fenêtre de Contexte */}
                            {showSettings && (
                                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center gap-4 text-xs animate-in fade-in slide-in-from-top-2">
                                    <span className="font-bold text-slate-600">Fenêtre de contexte (Historique lu par l'IA) :</span>
                                    <input 
                                        type="range" min="2" max="20" step="2"
                                        value={contextWindow} 
                                        onChange={(e) => setContextWindow(Number(e.target.value))}
                                        className="w-32 accent-[#f37321]"
                                    />
                                    <span className="font-mono bg-white px-2 py-1 rounded border border-slate-200">{contextWindow} msgs</span>
                                </div>
                            )}
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