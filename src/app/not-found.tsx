"use client";
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-bold text-slate-600">Page en construction</h2>
            <p className="text-sm mt-2">Cette fonctionnalité sera disponible prochainement dans le POC.</p>
        </div>
    );
}