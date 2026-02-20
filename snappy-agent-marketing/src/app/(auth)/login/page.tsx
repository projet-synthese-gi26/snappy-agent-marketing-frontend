"use client";
import { useRouter } from 'next/navigation';
import { User, Briefcase } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = (role: 'agent' | 'user') => {
        localStorage.setItem('chat_role', role);
        router.push('/chat');
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4 md:p-6">
            <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl p-8 md:p-10 text-center">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold">Portail POC</h2>
                    <p className="text-slate-400 mt-2">Choisissez votre rôle pour la simulation</p>
                </div>

                <div className="space-y-4 mb-8">
                    <button 
                        onClick={() => handleLogin('agent')}
                        className="w-full flex items-center justify-center gap-3 bg-[#121820] text-white py-4 rounded-xl hover:scale-[1.02] transition-all font-medium shadow-lg">
                        <Briefcase size={20} /> Je suis le Vendeur (Marketer)
                    </button>
                    
                    <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <span className="relative bg-white px-4 text-xs text-slate-400 uppercase tracking-widest">OU</span>
                    </div>

                    <button 
                        onClick={() => handleLogin('user')}
                        className="w-full flex items-center justify-center gap-3 bg-[#f37321] text-white py-4 rounded-xl shadow-lg shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all font-medium">
                        <User size={20} /> Je suis le Prospect (Client)
                    </button>
                </div>
            </div>
        </div>
    );
}