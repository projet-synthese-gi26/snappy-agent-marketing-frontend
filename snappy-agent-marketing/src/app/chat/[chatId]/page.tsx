"use client";

import { useState, useRef, useEffect } from "react";
import {
    Search,
    Phone,
    Info,
    Smile,
    Send,
    Bot,
    CheckCheck,
    Plus,
    Bold,
    Italic,
    Sparkles,
} from "lucide-react";

/* ================= TYPES ================= */

interface Message {
    id: number;
    text: string;
    sender: "me" | "other";
    time: string;
    isAI?: boolean;
}

type Mode = "OFF" | "LISTEN" | "ON";

type ConversationStage =
    | "INTRO"
    | "PRESENTATION"
    | "PRICE"
    | "NEGOTIATION"
    | "CLOSING";

/* ================= IA DATA ================= */

// Réponses IA AGENT (marketing / vente)
const AGENT_RESPONSES: Record<ConversationStage, string[]> = {
    INTRO: [
        "Bonjour, merci de nous contacter. Pouvez-vous me parler un peu de votre activité ?",
    ],
    PRESENTATION: [
        "Nous aidons les PME camerounaises à mieux gérer leurs clients grâce à des outils simples et accessibles.",
    ],
    PRICE: [
        "Nos tarifs sont flexibles et pensés pour les réalités locales des PME.",
    ],
    NEGOTIATION: [
        "Nous pouvons commencer avec une formule adaptée à votre budget et évoluer progressivement.",
    ],
    CLOSING: [
        "Si cela vous convient, nous pouvons démarrer avec une phase test.",
    ],
};

// Réponses IA CLIENT (PME camerounaise)
const CLIENT_RESPONSES: Record<ConversationStage, string[]> = {
    INTRO: [
        "Nous sommes une petite entreprise et nous cherchons à améliorer notre relation client.",
    ],
    PRESENTATION: [
        "C’est intéressant, mais est-ce que ce n’est pas trop compliqué à utiliser ?",
    ],
    PRICE: [
        "Le prix est important pour nous, on a un budget limité.",
    ],
    NEGOTIATION: [
        "Si on commence petit, est-ce qu’on peut évoluer plus tard ?",
    ],
    CLOSING: [
        "D’accord, on peut essayer cette solution.",
    ],
};

const pick = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

const nextStage = (stage: ConversationStage): ConversationStage => {
    const order: ConversationStage[] = [
        "INTRO",
        "PRESENTATION",
        "PRICE",
        "NEGOTIATION",
        "CLOSING",
    ];
    const index = order.indexOf(stage);
    return order[Math.min(index + 1, order.length - 1)];
};

/* ================= PAGE ================= */

export default function ChatPage({ params }: { params: { chatId: string } }) {
    const [mode, setMode] = useState<Mode>("OFF");
    const [stage, setStage] = useState<ConversationStage>("INTRO");
    const [inputText, setInputText] = useState("");

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Bonjour, je souhaite avoir des informations sur vos services.",
            sender: "other",
            time: "10:30",
            isAI: true,
        },
    ]);

    const endRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const addMessage = (
        text: string,
        sender: "me" | "other",
        isAI = false
    ) => {
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                text,
                sender,
                isAI,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },
        ]);
    };

    /* ================= ENVOI HUMAIN ================= */

    const handleSend = () => {
        if (!inputText.trim()) return;

        addMessage(inputText, "me");
        const last = inputText;
        setInputText("");

        // MODE OFF → client IA répond
        if (mode === "OFF") {
            setTimeout(() => {
                addMessage(
                    pick(CLIENT_RESPONSES[stage]),
                    "other",
                    true
                );
                setStage((s) => nextStage(s));
            }, 1200);
        }
    };

    /* ================= MODE ON : IA ↔ IA ================= */

    useEffect(() => {
        if (mode !== "ON") return;

        const last = messages[messages.length - 1];
        if (!last) return;

        // Agent IA → Client IA
        if (last.sender === "me") {
            const t = setTimeout(() => {
                addMessage(
                    pick(CLIENT_RESPONSES[stage]),
                    "other",
                    true
                );
                setStage((s) => nextStage(s));
            }, 1200);
            return () => clearTimeout(t);
        }

        // Client IA → Agent IA
        if (last.sender === "other") {
            const t = setTimeout(() => {
                addMessage(
                    pick(AGENT_RESPONSES[stage]),
                    "me",
                    true
                );
            }, 1200);
            return () => clearTimeout(t);
        }
    }, [mode, messages, stage]);

    /* ================= LISTEN : suggestion IA ================= */

    const aiSuggestion =
        mode === "LISTEN" && inputText
            ? pick(AGENT_RESPONSES[stage])
            : null;

    /* ================= RENDER ================= */

    return (
        <div className="flex flex-col h-full relative">

            {/* HEADER */}
            <header className="h-16 bg-white/80 backdrop-blur-md border-b px-6 flex items-center justify-between">
                <div>
                    <h2 className="font-bold capitalize">{params.chatId}</h2>
                    {mode === "ON" && (
                        <span className="text-[10px] text-[#f37321] flex items-center gap-1">
              <Sparkles size={10} /> Mode IA autonome
            </span>
                    )}
                    {mode === "LISTEN" && (
                        <span className="text-[10px] text-blue-500 flex items-center gap-1">
              <Bot size={10} /> IA en écoute
            </span>
                    )}
                </div>
                <div className="flex gap-6 text-slate-400">
                    <Search size={20} />
                    <Phone size={20} />
                    <Info size={20} />
                </div>
            </header>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8f9fa]">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${
                            msg.sender === "me" ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[70%] p-4 shadow-sm text-[14px] relative ${
                                msg.sender === "me"
                                    ? "bg-[#f37321] text-white rounded-2xl rounded-tr-none"
                                    : "bg-white text-slate-700 rounded-2xl rounded-tl-none border"
                            }`}
                        >
                            {msg.text}
                            <div className="text-[10px] mt-2 flex justify-end gap-1 opacity-70">
                                {msg.time}
                                {msg.sender === "me" && <CheckCheck size={14} />}
                            </div>

                            {msg.isAI && (
                                <div className="absolute -bottom-5 left-0 text-[9px] text-blue-500 flex items-center gap-1">
                                    <Bot size={10} /> IA
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {aiSuggestion && (
                    <div className="flex justify-center">
                        <div className="bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-xs italic flex items-center gap-2">
                            <Bot size={14} />
                            Suggestion IA : “{aiSuggestion}”
                        </div>
                    </div>
                )}

                <div ref={endRef} />
            </div>

            {/* FOOTER */}
            <footer className="p-6">
                <div className="max-w-4xl mx-auto flex flex-col gap-4">

                    {/* MODES */}
                    <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200 w-fit">
                        {(["OFF", "LISTEN", "ON"] as Mode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 ${
                                    mode === m
                                        ? "bg-[#f37321] text-white"
                                        : "text-slate-400 hover:bg-slate-50"
                                }`}
                            >
                                {m === "ON" && <Bot size={14} />}
                                {m}
                            </button>
                        ))}
                    </div>

                    {/* INPUT */}
                    <div className="flex items-end gap-3">
                        <button className="mb-2 p-2 bg-slate-200/50 text-slate-500 rounded-full">
                            <Plus size={20} />
                        </button>

                        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm relative pt-6 pb-2 px-4">
              <textarea
                  rows={1}
                  value={inputText}
                  disabled={mode === "ON"}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                      }
                  }}
                  placeholder={
                      mode === "ON"
                          ? "Deux IA discutent automatiquement…"
                          : "Écrivez un message…"
                  }
                  className="w-full bg-transparent outline-none text-[14px] resize-none disabled:opacity-50"
              />

                            <div className="flex justify-between items-center mt-2 border-t border-slate-50 pt-2 text-slate-400">
                                <div className="flex gap-4">
                                    <Bold size={16} />
                                    <Italic size={16} />
                                    <Smile size={18} />
                                </div>
                                <span className="text-[10px]">Entrée pour envoyer</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSend}
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
