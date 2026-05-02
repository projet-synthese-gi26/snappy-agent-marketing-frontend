"use client";

import { useState, useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Bot, Edit, X, LogOut, UserPlus } from 'lucide-react';
import "./globals.css";

interface Contact {
    id: string;
    name: string;
    lastMsg: string;
    time: string;
    unread: number;
    online: boolean;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [role, setRole] = useState<string>('user');

    useEffect(() => {
        setRole(localStorage.getItem('chat_role') || 'user');
    }, [pathname]);

    const [contacts, setContacts] = useState<Contact[]>([
        { id: 'client-01', name: 'Client POC 01', lastMsg: 'Démarrer la discussion...', time: '10:00', unread: 0, online: true },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newContactName, setNewContactName] = useState("");

    const filteredContacts = useMemo(() => {
        return contacts.filter(contact => 
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [contacts, searchQuery]);

    const handleAddContact = () => {
        if (!newContactName.trim()) return;
        const newId = newContactName.toLowerCase().replace(/\s+/g, '-');
        setContacts([{ id: newId, name: newContactName, lastMsg: "Nouvelle discussion", time: "Main", unread: 0, online: true }, ...contacts]);
        setNewContactName("");
        setIsModalOpen(false);
    };

    const isAuthPage = pathname === "/" || pathname === "/login" || pathname === "/register";
    
    // Logique Responsive : Est-ce qu'on est sur la page d'un chat spécifique ?
    const isChatPage = pathname.startsWith('/chat/');

    return (
        <html lang="fr">
        <body className="antialiased font-sans">
        <div className="flex h-screen w-full bg-[#f0f2f5] overflow-hidden text-[#3b4a54]">
            {!isAuthPage && (
                <>
                    {/* --- SIDEBAR 1 : ICONES (Cachée sur mobile) --- */}
                    <aside className="hidden md:flex w-[68px] bg-white border-r border-slate-200 flex-col items-center py-4 justify-between shrink-0">
                        <div className="flex flex-col gap-4 items-center w-full">
                            <Link href="/chat" className={`p-2 ${pathname.includes('/chat') ? 'text-[#f37321]' : 'text-slate-400'}`}>
                                <MessageSquare size={24} />
                            </Link>
                            
                            {/* Paramètres IA visibles uniquement pour l'Agent */}
                            {role === 'agent' && (
                                <Link href="/settings/ai" className={`p-3 rounded-xl shadow-lg mt-4 ${pathname.includes('/settings/ai') ? 'bg-[#f37321] text-white shadow-orange-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                                    <Bot size={24} />
                                </Link>
                            )}
                        </div>
                        <div className="flex flex-col gap-4 items-center">
                            <Link href="/login" onClick={() => localStorage.clear()} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                <LogOut size={20} />
                            </Link>
                        </div>
                    </aside>

                    {/* --- SIDEBAR 2 : DISCUSSIONS (Pleine largeur sur mobile si on n'est pas dans un chat) --- */}
                    <section className={`${isChatPage ? 'hidden md:flex' : 'flex w-full'} md:w-[350px] bg-white border-r border-slate-200 flex-col shrink-0`}>
                        <div className="p-4 flex justify-between items-center border-b md:border-none">
                            <h1 className="text-[22px] font-bold">Discussions</h1>
                            <div className="flex gap-2">
                                <button onClick={() => setIsModalOpen(true)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <Edit size={20} className="text-slate-600" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredContacts.map((contact) => (
                                <Link key={contact.id} href={`/chat/${contact.id}`}>
                                    <div className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${pathname === `/chat/${contact.id}` ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                                        <div className="relative shrink-0">
                                            <img src={`https://ui-avatars.com/api/?name=${contact.name}&background=random`} className="w-12 h-12 rounded-full" alt="" />
                                            {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-[15px] truncate">{contact.name}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 truncate">{contact.lastMsg}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </>
            )}

            {/* --- ZONE PRINCIPALE (Cachée sur mobile si on n'est pas dans un chat) --- */}
            <main className={`${!isChatPage && !isAuthPage ? 'hidden md:flex' : 'flex'} flex-1 flex-col relative overflow-hidden bg-[#f8f9fa]`}>
                <div className="relative z-10 flex flex-col h-full">{children}</div>
            </main>

            {/* Modal Nouveau Contact */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2"><UserPlus size={20}/> Nouveau Contact</h3>
                            <button onClick={() => setIsModalOpen(false)}><X /></button>
                        </div>
                        <input
                            type="text" autoFocus value={newContactName} onChange={(e) => setNewContactName(e.target.value)}
                            placeholder="Nom complet" className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none mb-4"
                        />
                        <button onClick={handleAddContact} className="w-full bg-[#f37321] text-white py-3 rounded-xl font-bold">Démarrer la discussion</button>
                    </div>
                </div>
            )}
        </div>
        </body>
        </html>
    );
}