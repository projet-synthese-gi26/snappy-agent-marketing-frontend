import { redirect } from 'next/navigation';

export default function SettingsPage() {
    // Redirige vers les paramètres IA par défaut
    redirect('/settings/ai');
}
