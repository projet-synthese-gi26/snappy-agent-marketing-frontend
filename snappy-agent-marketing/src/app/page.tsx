import Link from 'next/link';
import { MessageSquare, Shield, Zap, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Nav */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 font-bold text-2xl">
                    <div className="bg-[#f37321] p-1.5 rounded-lg text-white">
                        <MessageSquare size={24} />
                    </div>
                    <span>NexChat <span className="text-[#f37321]">AI</span></span>
                </div>
                <div className="flex gap-4">
                    <Link href="/login" className="px-4 py-2 font-medium hover:text-[#f37321] transition-colors">Connexion</Link>
                    <Link href="/register" className="bg-slate-900 text-white px-6 py-2 rounded-full font-medium hover:bg-slate-800 transition-all">Essai gratuit</Link>
                </div>
            </nav>

            {/* Hero */}
            <main className="max-w-5xl mx-auto pt-20 px-6 text-center">
                <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
                    La messagerie augmentée par <span className="text-[#f37321]">l'Intelligence Artificielle.</span>
                </h1>
                <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
                    Communiquez plus vite, gérez vos clients sans effort et laissez notre IA rédiger vos réponses complexes.
                </p>
                <Link href="/register" className="inline-flex items-center gap-2 bg-[#f37321] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-200 hover:scale-105 transition-all">
                    Démarrer maintenant <ArrowRight size={20} />
                </Link>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="p-6 border border-slate-100 rounded-3xl bg-slate-50/50">
                        <div className="w-12 h-12 bg-orange-100 text-[#f37321] rounded-2xl flex items-center justify-center mb-4"><Zap /></div>
                        <h3 className="font-bold mb-2">Réponses Instantanées</h3>
                        <p className="text-sm text-slate-500">L'IA suggère des réponses basées sur le contexte de la conversation.</p>
                    </div>
                    <div className="p-6 border border-slate-100 rounded-3xl bg-slate-50/50">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><Shield /></div>
                        <h3 className="font-bold mb-2">Sécurisé & Privé</h3>
                        <p className="text-sm text-slate-500">Vos données sont encryptées de bout en bout avec un contrôle total sur l'IA.</p>
                    </div>
                    <div className="p-6 border border-slate-100 rounded-3xl bg-slate-50/50">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4"><MessageSquare /></div>
                        <h3 className="font-bold mb-2">Multi-Canal</h3>
                        <p className="text-sm text-slate-500">Centralisez tous vos échanges au même endroit avec une interface fluide.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}