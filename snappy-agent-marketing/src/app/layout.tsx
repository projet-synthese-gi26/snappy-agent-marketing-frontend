"use client";

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    MessageSquare, CircleDashed, Phone, Bot,
    Settings, Search, Edit, Filter, X, UserPlus
} from 'lucide-react';
import "./globals.css";

// --- TYPES ---
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

    // --- ETATS ---
    const [contacts, setContacts] = useState<Contact[]>([
        { id: 'sarah', name: 'Sarah (Marketing)', lastMsg: 'On peut valider la maquette ?', time: '10:42', unread: 2, online: true },
        { id: 'jean', name: 'Jean Dupont', lastMsg: 'Le rapport est prêt.', time: '09:15', unread: 0, online: false },
        { id: 'equipe-dev', name: 'Equipe Dev', lastMsg: 'Déploiement en cours...', time: 'Hier', unread: 5, online: true },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterUnread, setFilterUnread] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newContactName, setNewContactName] = useState("");

    // --- LOGIQUE DE FILTRE ET RECHERCHE ---
    const filteredContacts = useMemo(() => {
        return contacts.filter(contact => {
            const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterUnread ? contact.unread > 0 : true;
            return matchesSearch && matchesFilter;
        });
    }, [contacts, searchQuery, filterUnread]);

    // --- ACTIONS ---
    const handleAddContact = () => {
        if (!newContactName.trim()) return;

        const newId = newContactName.toLowerCase().replace(/\s+/g, '-');
        const newContact: Contact = {
            id: newId,
            name: newContactName,
            lastMsg: "Nouvelle discussion créée",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: 0,
            online: false
        };

        setContacts([newContact, ...contacts]);
        setNewContactName("");
        setIsModalOpen(false);
    };

    const isAuthPage = pathname === "/" || pathname === "/login" || pathname === "/register";

    return (
        <html lang="fr">
        <body className="antialiased font-sans">
        <div className="flex h-screen w-full bg-[#f0f2f5] overflow-hidden text-[#3b4a54]">
            {!isAuthPage && (
                <>
                    {/* --- SIDEBAR 1 : ICONES (FIGÉE) --- */}
                    <aside className="w-[68px] bg-white border-r border-slate-200 flex flex-col items-center py-4 justify-between shrink-0">
                        <div className="flex flex-col gap-4 items-center w-full">
                            <Link href="/chat/sarah" className={`p-2 ${pathname.includes('/chat') ? 'text-[#f37321]' : 'text-slate-400'}`}>
                                <MessageSquare size={24} />
                            </Link>
                            <Link href="/status" className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><CircleDashed size={24} /></Link>
                            <Link href="/calls" className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Phone size={24} /></Link>
                            <Link href="/settings/ai" className={`p-3 rounded-xl shadow-lg ${pathname.includes('/settings/ai') ? 'bg-[#f37321] text-white shadow-orange-200' : 'bg-slate-100 text-slate-400'}`}>
                                <Bot size={24} />
                            </Link>
                        </div>
                        <div className="flex flex-col gap-4 items-center">
                            <Link href="/settings"><Settings size={24} className="text-slate-400" /></Link>
                            <div className="w-8 h-8 rounded-full bg-orange-200 overflow-hidden border border-slate-200">
                                <img src="https://ui-avatars.com/api/?name=User" alt="profile" />
                            </div>
                        </div>
                    </aside>

                    {/* --- SIDEBAR 2 : DISCUSSIONS (FIGÉE) --- */}
                    <section className="w-[350px] bg-white border-r border-slate-200 flex flex-col shrink-0">
                        <div className="p-4 flex justify-between items-center">
                            <h1 className="text-[22px] font-bold">Discussions {filterUnread && <span className="text-[10px] bg-orange-100 text-[#f37321] px-2 py-0.5 rounded-full ml-2">Filtré</span>}</h1>
                            <div className="flex gap-2">
                                {/* Bouton Nouvelle Discussion */}
                                <button onClick={() => setIsModalOpen(true)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <Edit size={20} className="text-slate-600" />
                                </button>
                                {/* Bouton Filtre (Unread) */}
                                <button
                                    onClick={() => setFilterUnread(!filterUnread)}
                                    className={`p-2 rounded-full transition-colors ${filterUnread ? 'bg-orange-100 text-[#f37321]' : 'hover:bg-slate-100 text-slate-600'}`}
                                >
                                    <Filter size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="px-4 mb-4">
                            <div className="relative flex items-center bg-[#f0f2f5] rounded-lg px-3 py-2">
                                <Search size={16} className="text-slate-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Rechercher"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent outline-none text-sm w-full"
                                />
                                {searchQuery && <X size={14} className="cursor-pointer" onClick={() => setSearchQuery("")} />}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredContacts.length > 0 ? filteredContacts.map((contact) => (
                                <Link key={contact.id} href={`/chat/${contact.id}`}>
                                    <div className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${pathname.includes(contact.id) ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                                        <div className="relative shrink-0">
                                            <img src={`https://ui-avatars.com/api/?name=${contact.name}&background=random`} className="w-12 h-12 rounded-full" alt="" />
                                            {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-[15px] truncate">{contact.name}</span>
                                                <span className={`${contact.unread > 0 ? 'text-[#f37321]' : 'text-slate-400'} text-xs font-semibold`}>{contact.time}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-slate-500 truncate">{contact.lastMsg}</p>
                                                {contact.unread > 0 && (
                                                    <span className="bg-[#f37321] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{contact.unread}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <div className="p-10 text-center text-xs text-slate-400 uppercase tracking-widest">Aucun résultat</div>
                            )}
                        </div>
                    </section>
                </>
            )}

            {/* --- ZONE DE CONTENU VARIABLE --- */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[#f8f9fa]">
                {!isAuthPage && (
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                         style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                )}
                <div className="relative z-10 flex flex-col h-full">
                    {children}
                </div>
            </main>

            {/* --- MODALE : NOUVELLE DISCUSSION --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm p-6 transform animate-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <UserPlus className="text-[#f37321]" /> Nouveau Contact
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nom du contact</label>
                                <input
                                    type="text"
                                    autoFocus
                                    value={newContactName}
                                    onChange={(e) => setNewContactName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddContact()}
                                    placeholder="Ex: Paul Martin"
                                    className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#f37321] outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={handleAddContact}
                                className="w-full bg-[#f37321] text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Démarrer la discussion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </body>
        </html>
    );
}