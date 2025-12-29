"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    MessageSquare,
    CircleDashed,
    Phone,
    Bot,
    Settings,
    Search,
    Edit,
    Filter,
    X,
    UserPlus,
} from "lucide-react";
import "./globals.css";

/* ===================== TYPES ===================== */
interface Contact {
    id: string;
    name: string;
    lastMsg: string;
    time: string;
    unread: number;
    online: boolean;
}

/* ===================== ROOT LAYOUT ===================== */
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthPage =
        pathname === "/" || pathname === "/login" || pathname === "/register";
    const isChatOpen = pathname.startsWith("/chat/");

    /* ===================== STATE ===================== */
    const [contacts, setContacts] = useState<Contact[]>([
        {
            id: "Rosa",
            name: "Rosa",
            lastMsg: "Bonjour................",
            time: "10:42",
            unread: 2,
            online: true,
        },
        {
            id: "Olivier",
            name: "Olivier",
            lastMsg: "Le rapport est prêt.",
            time: "09:15",
            unread: 0,
            online: false,
        },
        {
            id: "Anne Rosalie",
            name: "Anne Rosalie",
            lastMsg: "Déploiement en cours...",
            time: "Hier",
            unread: 5,
            online: true,
        },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterUnread, setFilterUnread] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newContactName, setNewContactName] = useState("");

    /* ===================== FILTER ===================== */
    const filteredContacts = useMemo(() => {
        return contacts.filter((c) => {
            const matchSearch = c.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchUnread = filterUnread ? c.unread > 0 : true;
            return matchSearch && matchUnread;
        });
    }, [contacts, searchQuery, filterUnread]);

    /* ===================== ACTIONS ===================== */
    const handleAddContact = () => {
        if (!newContactName.trim()) return;

        const id = newContactName.toLowerCase().replace(/\s+/g, "-");

        setContacts((prev) => [
            {
                id,
                name: newContactName,
                lastMsg: "",
                time: "",
                unread: 0,
                online: false,
            },
            ...prev,
        ]);

        setNewContactName("");
        setIsModalOpen(false);
    };

    /* ===================== RENDER ===================== */
    return (
        <html lang="fr">
        <body className="antialiased font-sans">
        <div className="flex h-screen w-full bg-[#f0f2f5] overflow-hidden text-[#3b4a54]">
            {!isAuthPage && (
                <>
                    {/* ===================== SIDEBAR ICONES ===================== */}
                    <aside className="w-[68px] bg-white border-r border-slate-200 flex flex-col items-center py-4 justify-between shrink-0">
                        <div className="flex flex-col gap-4 items-center">
                            <Link
                                href="/chat"
                                className={`p-2 ${
                                    pathname.startsWith("/chat")
                                        ? "text-[#f37321]"
                                        : "text-slate-400"
                                }`}
                            >
                                <MessageSquare size={24} />
                            </Link>
                            <Link href="/status" className="p-2 text-slate-400">
                                <CircleDashed size={24} />
                            </Link>
                            <Link href="/calls" className="p-2 text-slate-400">
                                <Phone size={24} />
                            </Link>
                            <Link
                                href="/settings/ai"
                                className={`p-3 rounded-xl ${
                                    pathname.includes("/settings/ai")
                                        ? "bg-[#f37321] text-white"
                                        : "bg-slate-100 text-slate-400"
                                }`}
                            >
                                <Bot size={24} />
                            </Link>
                        </div>

                        <div className="flex flex-col gap-4 items-center">
                            <Link href="/settings">
                                <Settings size={22} className="text-slate-400" />
                            </Link>
                            <img
                                src="https://ui-avatars.com/api/?name=User"
                                className="w-8 h-8 rounded-full"
                            />
                        </div>
                    </aside>

                    {/* ===================== SIDEBAR DISCUSSIONS ===================== */}
                    <section className="w-[350px] bg-white border-r border-slate-200 flex flex-col shrink-0">
                        {/* HEADER */}
                        <div className="p-4 flex justify-between items-center">
                            <h1 className="text-[22px] font-bold">
                                Discussions
                                {filterUnread && (
                                    <span className="ml-2 text-[10px] bg-orange-100 text-[#f37321] px-2 py-0.5 rounded-full">
                        Filtré
                      </span>
                                )}
                            </h1>
                            <div className="flex gap-2">
                                <button onClick={() => setIsModalOpen(true)}>
                                    <Edit size={20} />
                                </button>
                                <button
                                    onClick={() => setFilterUnread(!filterUnread)}
                                    className={
                                        filterUnread ? "text-[#f37321]" : "text-slate-400"
                                    }
                                >
                                    <Filter size={20} />
                                </button>
                            </div>
                        </div>

                        {/* SEARCH */}
                        <div className="px-4 mb-4">
                            <div className="flex items-center bg-[#f0f2f5] rounded-lg px-3 py-2">
                                <Search size={16} className="mr-2 text-slate-400" />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher"
                                    className="bg-transparent outline-none text-sm w-full"
                                />
                                {searchQuery && (
                                    <X
                                        size={14}
                                        onClick={() => setSearchQuery("")}
                                        className="cursor-pointer"
                                    />
                                )}
                            </div>
                        </div>

                        {/* LIST */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredContacts.map((contact) => {
                                const active = pathname === `/chat/${contact.id}`;

                                return (
                                    <Link key={contact.id} href={`/chat/${contact.id}`}>
                                        <div
                                            className={`flex items-center gap-3 p-4 transition
                          ${
                                                active
                                                    ? "bg-slate-50 border-l-4 border-[#f37321]"
                                                    : "hover:bg-slate-50"
                                            }`}
                                        >
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${contact.name}`}
                                                className="w-12 h-12 rounded-full"
                                            />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between">
                              <span className="font-bold truncate">
                                {contact.name}
                              </span>
                                                    {active && (
                                                        <span className="text-xs text-slate-400">
                                  {contact.time}
                                </span>
                                                    )}
                                                </div>

                                                {active ? (
                                                    <p className="text-sm text-slate-500 truncate">
                                                        {contact.lastMsg}
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-slate-400 italic">
                                                        Discussion
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                </>
            )}

            {/* ===================== MAIN ===================== */}
            <main className="flex-1 relative overflow-hidden bg-[#f8f9fa]">
                {!isChatOpen && !isAuthPage && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <MessageSquare size={64} />
                        <p className="mt-4 text-sm">
                            Sélectionnez une discussion pour commencer
                        </p>
                    </div>
                )}
                {children}
            </main>

            {/* ===================== MODAL ===================== */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[360px]">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <UserPlus /> Nouveau contact
                            </h3>
                            <X onClick={() => setIsModalOpen(false)} />
                        </div>

                        <input
                            autoFocus
                            value={newContactName}
                            onChange={(e) => setNewContactName(e.target.value)}
                            placeholder="Nom du contact"
                            className="w-full px-4 py-3 bg-slate-100 rounded-lg"
                        />

                        <button
                            onClick={handleAddContact}
                            className="w-full mt-4 bg-[#f37321] text-white py-3 rounded-lg font-bold"
                        >
                            Démarrer
                        </button>
                    </div>
                </div>
            )}
        </div>
        </body>
        </html>
    );
}
