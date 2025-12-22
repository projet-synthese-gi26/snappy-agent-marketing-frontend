"use client";
import Link from 'next/link';
import { Mail, Lock, User, Chrome, Apple } from 'lucide-react';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl p-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold">Créer un compte</h2>
                    <p className="text-slate-400 mt-2">Rejoignez la révolution NexChat</p>
                </div>

                <div className="space-y-4 mb-8">
                    <button className="w-full flex items-center justify-center gap-3 border border-slate-200 py-3 rounded-xl hover:bg-slate-50 transition-all font-medium">
                        <Chrome size={20} /> Continuer avec Google
                    </button>
                    <button className="w-full flex items-center justify-center gap-3 border border-slate-200 py-3 rounded-xl hover:bg-slate-50 transition-all font-medium">
                        <Apple size={20} /> Continuer avec Apple
                    </button>
                </div>

                <div className="relative mb-8 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <span className="relative bg-white px-4 text-xs text-slate-400 uppercase tracking-widest">Ou par email</span>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Nom complet" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#f37321] outline-none transition-all" />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="email" placeholder="Email" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#f37321] outline-none transition-all" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="password" placeholder="Mot de passe" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#f37321] outline-none transition-all" />
                    </div>

                    <Link href="/chat" className="block w-full text-center bg-[#f37321] text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all mt-6">
                        Créer mon compte
                    </Link>
                </form>

                <p className="text-center mt-8 text-sm text-slate-500">
                    Déjà inscrit ? <Link href="/login" className="text-[#f37321] font-bold">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}