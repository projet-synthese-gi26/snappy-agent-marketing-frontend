"use client";
import { useState } from 'react';
import { Settings, Brain, Palette, Shield, Save, X, Sparkles } from 'lucide-react';

export default function AISettingsPage() {
    const [tone, setTone] = useState('Amical');

    return (
        <div className="flex-1 bg-[#121820] text-slate-300 flex flex-col overflow-hidden">
            {/* Header Paramètres */}
            <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#121820]">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        Paramètres de l'Agent IA
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Configurez le comportement, la personnalité et l'automatisation de votre assistant.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-700 transition-colors">Annuler</button>
                    <button className="px-4 py-2 rounded-lg bg-[#f37321] text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-900/20">
                        <Save size={16} /> Sauvegarder
                    </button>
                </div>
            </header>

            {/* Tabs Menu */}
            <nav className="flex px-6 border-b border-slate-800 bg-[#121820]">
                {[
                    { id: 'Général', icon: <Settings size={14}/> },
                    { id: 'Comportement', icon: <Brain size={14}/> },
                    { id: 'Apparence', icon: <Palette size={14}/> },
                    { id: 'Confidentialité', icon: <Shield size={14}/> }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                            tab.id === 'Général' ? 'border-[#f37321] text-[#f37321]' : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        {tab.icon} {tab.id}
                    </button>
                ))}
            </nav>

            {/* Formulaire de configuration */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 max-w-5xl">

                {/* Section Modes */}
                <section>
                    <div className="flex items-center gap-2 text-white font-bold mb-6">
                        <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center"><Sparkles size={12}/></div>
                        Modes de fonctionnement
                    </div>

                    <div className="bg-[#1a212a] rounded-xl border border-slate-800 p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-white">Mode Écoute (Listen Mode)</span>
                                    <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">Recommandé</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 max-w-md">L'IA analyse les messages entrants et prépare des brouillons de réponse. Aucune réponse n'est envoyée sans votre validation manuelle.</p>
                            </div>
                            <div className="w-12 h-6 bg-[#f37321] rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                        </div>

                        <div className="h-[1px] bg-slate-800" />

                        <div className="flex justify-between items-center">
                            <div>
                                <span className="font-bold text-white">Réponse Automatique</span>
                                <p className="text-xs text-slate-500 mt-1">Permet à l'agent de répondre de manière autonome aux questions fréquentes lorsque vous êtes hors ligne.</p>
                            </div>
                            <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-pointer transition-colors hover:bg-slate-600"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                        </div>
                    </div>
                </section>

                {/* Section Personnalité */}
                <section>
                    <div className="flex items-center gap-2 text-white font-bold mb-6">
                        <div className="w-5 h-5 bg-teal-500 rounded flex items-center justify-center">🧠</div>
                        Personnalité & Style
                    </div>

                    <div className="bg-[#1a212a] rounded-xl border border-slate-200/5 p-8 space-y-8">
                        <div>
                            <label className="block text-sm font-bold text-white mb-4">Ton de réponse</label>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'Formel', icon: '👔' },
                                    { id: 'Amical', icon: '👋' },
                                    { id: 'Dynamique', icon: '⚡' }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTone(t.id)}
                                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                                            tone === t.id ? 'border-[#f37321] bg-[#f37321]/5 text-[#f37321]' : 'border-slate-800 bg-[#121820] text-slate-500 hover:border-slate-700'
                                        }`}
                                    >
                                        <span className="text-2xl">{t.icon}</span>
                                        <span className="text-sm font-bold">{t.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Slider Créativité */}
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-sm font-bold text-white">Créativité (Température)</label>
                                <span className="text-[10px] text-[#f37321] font-bold">Ajusté sur "Équilibré"</span>
                            </div>
                            <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#f37321]" />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-widest">
                                <span>Précis</span>
                                <span>Créatif</span>
                            </div>
                        </div>

                        {/* Persona Box */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-bold text-white">Instructions Système (Persona)</label>
                                <button className="text-[10px] text-blue-400 font-bold flex items-center gap-1 hover:text-blue-300">
                                    <Sparkles size={12}/> Générer avec l'IA
                                </button>
                            </div>
                            <textarea
                                className="w-full bg-[#121820] border border-slate-800 rounded-xl p-4 text-sm text-slate-400 focus:border-[#f37321] outline-none min-h-[120px]"
                                defaultValue="Tu es un assistant utile et concis. Tu aides à gérer le support client..."
                            />
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-[10px] text-slate-600 italic">💡 Conseil : Décrivez le rôle exact de l'IA pour obtenir de meilleurs résultats.</p>
                                <span className="text-[10px] text-slate-600 font-mono">124/2000</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}