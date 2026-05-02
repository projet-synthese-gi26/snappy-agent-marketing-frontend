# 🤖 Snappy Agent Marketing - Frontend

**Plateforme d'IA pour automation marketing et gestion de support client.**

Interface moderne permettant à un agent IA d'assister automatiquement les clients via une messagerie intelligente avec simulation dual-role.

---

## 📋 Vue d'ensemble

**Snappy Agent Marketing** est un frontend React/Next.js qui implémente une **plateforme de messagerie augmentée par l'IA** pour l'automatisation du support client et la gestion marketing. Le système simule un agent IA capable de répondre automatiquement aux messages des clients avec des suggestions intelligentes configurables.

### Points clés du projet :
- ✅ **Agents IA autonomes** : 3 modes (OFF / LISTEN / AUTO) avec machine à état POMDP
- ✅ **Interface multi-rôle** : Simulation dual Agent/Client pour tester les interactions en temps réel
- ✅ **Historique temps réel** : Synchronisation bidirectionnelle avec backend via polling (2 secondes)
- ✅ **Personnalisation de l'IA** : Paramètres configurables (ton, créativité, fenêtre de contexte, persona)
- ✅ **Responsive design** : Adapté mobile/tablette/desktop avec Tailwind CSS
- ✅ **Sessions dynamiques** : ID de session généré et persisté au premier message

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** ≥ 18
- **npm** ou **yarn**
- **Backend** en écoute sur `http://localhost:8000`

### Installation

```bash
cd snappy-agent-marketing
npm install
```

### Configuration

Vérifier le fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

⚠️ La variable doit commencer par `NEXT_PUBLIC_` pour être accessible en frontend.

### Lancer le développement

```bash
npm run dev
```

Le serveur démarre automatiquement sur **http://localhost:3000**

### Accès à l'application

1. **Landing page** → Cliquer "Essai gratuit" ou "Connexion"
2. **Login** → Choisir un rôle :
   - 👔 **Agent** (Marketer) : Accès aux modes IA et paramètres avancés
   - 👤 **Client** (Prospect) : Mode messagerie standard
3. **Chat** → Créer une discussion avec "+" et commencer à converser
4. **Paramètres IA** (Agent uniquement) → Configurer ton, créativité, persona

---

## 🛠️ Stack Technologique

| Couche | Technologie | Version |
|--------|------------|---------|
| **Framework** | Next.js + React | 16.0.10 / 19.2.1 |
| **Langage** | TypeScript | ^5 |
| **Styling** | Tailwind CSS + PostCSS | 3.4.19 / ^8.5.6 |
| **Icônes** | Lucide React | ^0.574.0 |
| **Optimisation** | React Compiler | 1.0.0 |
| **Backend** | Python/FastAPI | http://localhost:8000 |

### Stack détaillé

```
Frontend:
├── Next.js 16.0.10          → Framework React avec SSR et App Router avancé
├── React 19.2.1             → Composants UI avec hooks modernes
├── TypeScript 5             → Typage statique complet
├── Tailwind CSS 3.4.19      → Styles utility-first responsive
├── Lucide React 0.574       → Icônes vectorielles 24x24px
├── React Compiler           → Optimisation automatique des composants
├── PostCSS + Autoprefixer   → Transformations CSS cross-browser
└── ESLint 9                 → Linting et qualité de code

Backend (API):
└── http://localhost:8000    → Serveur Python/FastAPI
                             (Fourni via .env.local)
```

---

## 📁 Structure du Projet

### Architecture générale

```
snappy-agent-marketing/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── page.tsx            # Landing page avec hero section
│   │   ├── layout.tsx          # Layout global (3 sidebars)
│   │   ├── globals.css         # Styles globaux
│   │   ├── not-found.tsx       # Placeholder 404
│   │   │
│   │   ├── (auth)/             # Groupe de routes sans layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Sélection du rôle (Agent/Client)
│   │   │   └── register/
│   │   │       └── page.tsx    # Formulaire d'inscription
│   │   │
│   │   ├── chat/               # Zone de chat principal
│   │   │   ├── page.tsx        # Index (message d'accueil)
│   │   │   └── [chatId]/
│   │   │       └── page.tsx    # Page de chat dynamique
│   │   │                       # (Logique POMDP + polling)
│   │   │
│   │   └── settings/           # Paramètres de l'agent
│   │       ├── page.tsx        # Placeholder vide
│   │       └── ai/
│   │           └── page.tsx    # Configuration avancée IA
│   │                          # (Modes, persona, créativité)
│   │
│   └── services/
│       └── api.ts              # Couche d'abstraction API
│                              # (4 endpoints REST)
│
├── .env.local                  # Variables d'environnement
├── .gitignore                  # Exclusions git
├── package.json                # Dépendances npm
├── package-lock.json           # Lock file
├── tsconfig.json               # Configuration TypeScript
├── next.config.ts              # Configuration Next.js
├── tailwind.config.js          # Configuration Tailwind
├── postcss.config.js           # Configuration PostCSS
├── eslint.config.mjs           # Configuration ESLint
└── README.md                   # Documentation complète
```

---

## 🏗️ Architecture et Flux de Données

### 1️⃣ **Authentification / Sélection du Rôle**

```
LOGIN PAGE (/login)
├─ Affiche 2 boutons : Agent (noir #121820) vs Client (orange #f37321)
├─ onClick → localStorage.setItem('chat_role', 'agent' | 'user')
├─ Redirection vers /chat
└─ Session initialisée
```

### 2️⃣ **Initiation de Chat**

```
CHAT PAGE (/chat/[chatId])
├─ Récupère le rôle depuis localStorage
├─ Génère sessionId unique → localStorage: snappy_session_{chatId}
├─ Affiche interface de chat avec historique vide
├─ État React : messages[], mode, contextWindow, etc.
└─ Prêt à recevoir les premiers messages
```

### 3️⃣ **Logique de Messaging**

#### Envoi manuel de message (Agent ou Client)
```javascript
handleSendMessage()
├─ Valide le texte est non-vide
├─ Crée message local avec ID temporaire (Date.now())
├─ Affiche immédiatement dans l'UI (optimistic update)
├─ Appelle: POST /agent/simulate-human
│  Payload: { session_id, role, content }
├─ Récupère sessionId du serveur si premier message
└─ Message synchronisé au prochain polling
```

#### Polling continu (toutes les 2 secondes)
```javascript
useEffect() → setInterval(fetchHistory, 2000)
├─ Appelle: GET /chat/{sessionId}/history
├─ Parse réponse en objets Message[]
├─ Merge avec état local (évite suppression optimiste)
├─ Scrolle automatiquement vers le dernier message
└─ Gère les erreurs silencieusement
```

### 4️⃣ **Logique POMDP (Mode Agent Autonome)**

Le système utilise une **machine à état simple** pour gérer l'IA :

```
┌─────────────────────────────────────────────┐
│              Mode Machine IA                │
└─────────────────────────────────────────────┘

Mode OFF
├─ L'agent ne fait rien
├─ Panel IA visible avec 3 boutons
└─ Input accessible à l'utilisateur

        ↓ (utilisateur clique LISTEN)

Mode LISTEN 
├─ agentListen(lastUserMsg) appelé automatiquement
├─ Prépare des brouillons en tâche de fond
├─ AUCUNE réponse n'est envoyée au client
├─ Entraînement silencieux de l'IA
├─ Input reste accessible
└─ Changement de mode immédiat possible

        ↓ (utilisateur clique AUTO)

Mode ON
├─ agentRespond(lastUserMsg, contextWindow) appelé
├─ Génère et envoie réponse AUTOMATIQUEMENT
├─ Input DÉSACTIVÉ (design intentionnel)
├─ Agent répond à chaque nouveau message client
├─ Fenêtre de contexte configurable (2-20 msgs)
└─ Changement de mode stoppe les réponses auto
```

**État persistant** (useRef) : 
- `processedCount` : Nombre de messages traités par la logique POMDP
- `lastListenedMsgId` : ID du dernier message écouté
- `lastRespondedMsgId` : ID du dernier message auquel répondu

**Stratégie** :
- Détecte les NOUVEAUX messages via comparaison d'ID
- Évite de traiter deux fois le même message
- Gère les switchs de mode sans relancer les effets

### 5️⃣ **Interface Utilisateur**

#### **Sidebar 1 (Icônes de navigation - Caché sur mobile)**
```
Width: 68px | BG: white | Border-right: slate-200

├─ 💬 Chat (lien vers /chat)
├─ 🤖 Settings IA (visible uniquement si role === 'agent')
│  └─ Styling special : bg-orange-100/shadow
└─ 🚪 Logout (bottom, hover → red)
```

#### **Sidebar 2 (Liste de discussions)**
```
Width: 350px | Pleine largeur sur mobile

├─ Header
│  ├─ "Discussions" (titre)
│  └─ Bouton + (modal nouveau contact)
│
├─ Search bar (temps réel)
│  └─ Filter par contact.name.includes(query)
│
└─ Contact List
   ├─ Avatar (ui-avatars.com + badge online)
   ├─ Nom + dernier message
   ├─ Heure + badge unread
   └─ Hover effect + active state
```

#### **Zone Principale (Chat)**
```
├─ HEADER
│  ├─ Rôle actuel (Agent/Client)
│  ├─ Icône rôle colorée
│  └─ Bouton retour (mobile)
│
├─ MESSAGE STREAM
│  ├─ Messages avec styling différent
│  │  ├─ Self (agent): bg-#121820, text-white, right
│  │  └─ Other (client): bg-white, border, left
│  ├─ Loading animation (3 dots bouncing)
│  └─ Auto scroll vers último mensaje
│
├─ AGENT IA PANEL (visible si role === 'agent')
│  ├─ 3 Mode buttons : OFF / LISTEN / ON
│  ├─ Settings button (chevron)
│  └─ Context window slider (2-20, si showSettings)
│
└─ INPUT ZONE
   ├─ Textarea (multi-ligne, Shift+Enter)
   ├─ Send button
   ├─ État: disabled si mode === 'ON'
   └─ Placeholder adapté au mode
```

---

## 📄 Structure Détaillée des Fichiers

### **`layout.tsx`** (3 sidebars responsives)

**440 lignes** - Layout global côté client

```typescript
export default function RootLayout({ children })
├─ "use client" (composant client)
├─
├─ Détection page actuelle
│  ├─ usePathname() → détecte /login, /register, /chat, etc.
│  ├─ isAuthPage = pathname === "/" || "/login" || "/register"
│  └─ isChatPage = pathname.startsWith('/chat/')
│
├─ État global
│  ├─ contacts[] (liste de discussions)
│  ├─ searchQuery (filtre temps réel)
│  ├─ isModalOpen (nouveau contact)
│  ├─ role (localStorage)
│  └─ filteredContacts (useMemo)
│
├─ Handlers
│  ├─ useEffect → sync role depuis localStorage
│  ├─ handleAddContact() → crée contact
│  └─ filteredContacts = useMemo()
│
└─ Render (3 secteurs)
   ├─ Sidebar 1 (icônes)
   ├─ Sidebar 2 (discussions)
   ├─ Main (contenu)
   └─ Modal (nouveau contact)
```

**Points clés** :
- Responsive : sidebars cachées sur mobile sauf en chat
- Modal pour créer contact
- Réutilisable sur toutes les pages sauf (auth)

### **`page.tsx` (Landing Page)**

```typescript
export default function LandingPage()
├─ Navigation bar
│  ├─ Logo "NexChat AI" avec icône
│  ├─ Liens login/register
│  └─ Logo color: orange #f37321
│
├─ Hero Section
│  ├─ Titre 6xl "La messagerie augmentée par l'IA"
│  ├─ Sous-titre + CTA "Démarrer maintenant"
│  └─ Shadow orange
│
└─ 3 Feature Cards
   ├─ ⚡ Réponses Instantanées
   ├─ 🔒 Sécurisé & Privé
   └─ 💬 Multi-Canal
```

### **`(auth)/login/page.tsx`**

```typescript
export default function LoginPage()
├─ Card arrondie (rounded-[32px])
├─ 2 Boutons Role
│  ├─ Agent (noir #121820) + Briefcase icon
│  ├─ Client (orange #f37321) + User icon
│  └─ onClick: handleLogin(role)
│      ├─ localStorage.setItem('chat_role', role)
│      └─ router.push('/chat')
└─ Divider "OU"
```

### **`(auth)/register/page.tsx`**

```typescript
export default function RegisterPage()
├─ SSO buttons (Google, Apple)
├─ Form inputs
│  ├─ Full name
│  ├─ Email
│  └─ Password
└─ Link vers /chat ou /login
```

### **`chat/page.tsx` (Chat Index)**

```typescript
export default function ChatIndexPage()
└─ Placeholder
   ├─ Emoji 💬
   └─ "Sélectionnez une discussion pour commencer à messager"
```

### **`chat/[chatId]/page.tsx`** (Cœur du système)

**430+ lignes** - Logique la plus complexe

```typescript
export default function ChatPage({ params })
├─ "use client" (composant client)
├─
├─ 1. Déballage des params (Next.js 15)
│  └─ const { chatId } = use(params)
│
├─ 2. États
│  ├─ mode: 'OFF' | 'LISTEN' | 'ON'
│  ├─ contextWindow: 2-20
│  ├─ messages: Message[]
│  ├─ sessionId: string | null
│  ├─ role: 'user' | 'agent'
│  ├─ isLoading: boolean
│  └─ showSettings: boolean
│
├─ 3. References (useRef - persistantes)
│  ├─ processedCount
│  ├─ lastListenedMsgId
│  ├─ lastRespondedMsgId
│  └─ messagesEndRef (scroll)
│
├─ 4. Effects
│  ├─ Initialisation localStorage
│  ├─ Polling GET /chat/{sessionId}/history (2s)
│  └─ POMDP Logic
│
├─ 5. Handlers
│  └─ handleSendMessage()
│      ├─ POST /agent/simulate-human
│      └─ Update sessionId si besoin
│
└─ 6. Render
   ├─ Header (rôle + info)
   ├─ Messages stream
   ├─ Agent IA panel (si agent)
   └─ Input zone
```

**Détail de la logique POMDP** :

```typescript
// Effect que se déclenche quand messages changent
useEffect(() => {
  if (role !== 'agent' || messages.length <= processedCount.current) return;
  
  const newMessages = messages.slice(processedCount.current);
  processedCount.current = messages.length;
  
  // Cherche le dernier message utilisateur
  const lastUserMsg = [...newMessages].reverse().find(m => m.sender === 'user');
  
  if (lastUserMsg) {
    if (mode === 'LISTEN' && lastListenedMsgId.current !== lastUserMsg.id) {
      // → IA écoute
      lastListenedMsgId.current = lastUserMsg.id;
      agentListen(lastUserMsg.text, sessionId);
    }
    else if (mode === 'ON' && lastRespondedMsgId.current !== lastUserMsg.id) {
      // → IA répond
      lastRespondedMsgId.current = lastUserMsg.id;
      setIsLoading(true);
      agentRespond(lastUserMsg.text, sessionId, contextWindow)
        .finally(() => setIsLoading(false));
    }
  }
}, [messages, mode, role, sessionId, contextWindow]);
```

### **`settings/ai/page.tsx`**

**150+ lignes** - Configuration IA

```typescript
export default function AISettingsPage()
├─ Dark theme (#121820)
├─ Tabs menu (4 tabs)
│  ├─ Général
│  ├─ Comportement
│  ├─ Apparence
│  └─ Confidentialité
│
└─ Content area (only "Général" implémenté)
   ├─ Section "Modes de fonctionnement"
   │  ├─ Listen Mode toggle (ON par défaut)
   │  └─ Réponse Automatique toggle (OFF)
   │
   ├─ Section "Personnalité & Style"
   │  ├─ Sélecteur ton : Formel / Amical / Dynamique
   │  ├─ Slider créativité (Précis ↔ Créatif)
   │  └─ Textarea instructions système (Persona)
   │
   └─ Buttons
      ├─ Annuler
      └─ Sauvegarder (orange)
```

### **`services/api.ts`**

**50 lignes** - Couche d'abstraction API

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const chatService = {
  
  async getHistory(sessionId: string | null) {
    // GET /chat/{sessionId}/history
    // Retourne: Message[]
    
  async sendHumanMessage(content: string, role: string, sessionId: string | null) {
    // POST /agent/simulate-human
    // Payload: { session_id, role, content }
    // Retourne: { status, session_id }
    
  async agentListen(message: string, sessionId: string | null) {
    // POST /agent/listen
    // Contexte: Entraînement silencieux
    
  async agentRespond(message: string, sessionId: string | null, contextWindow: number) {
    // POST /agent/respond
    // Payload: { session_id, message, context_window }
}
```

### **`globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

[data-theme='dark'] {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

---

## 🎨 Design System Complet

### Couleurs

```
Brand Orange:     #f37321 (CTA, active state, branding)
Dark Agent:       #121820 (Agent mode, dark theme)
Light Background: #f0f2f5 (Fond de page)
White:            #ffffff (Cards, inputs)
Text Primary:     #3b4a54 (Slate-600)
Text Secondary:   #64748b (Slate-500)
Border Light:     #e2e8f0 (Slate-200)
Border Medium:    #cbd5e1 (Slate-300)
```

### Typographie

```
Font Family:   System font (Arial, Helvetica)
Headlines:     font-bold, font-extrabold
Subheads:      font-bold
Body:          font-medium, font-normal
Font-weight:   300 / 400 / 500 / 600 / 700 / 800
```

### Spacing

```
Responsive padding:
├─ Mobile:  p-4
├─ Tablet:  md:p-6
└─ Desktop: lg:p-8

Gaps:
├─ Compact:  gap-1, gap-2
├─ Normal:   gap-3, gap-4
└─ Large:    gap-6, gap-8

Border radius:
├─ Buttons:  rounded-xl (16px)
├─ Cards:    rounded-2xl (24px)
├─ Large:    rounded-[32px]
└─ Full:     rounded-full
```

### Shadows

```
Shadow-sm:  Subtle (borders)
Shadow:     Normal (cards)
Shadow-lg:  Prominent (modals)
Shadow-2xl: Heavy (modals importants)
```

---

## 🔌 API Endpoints Détaillés

### 1. **POST /agent/simulate-human**

Envoyer un message depuis Agent ou Client

```json
Request:
{
  "session_id": "uuid-or-null",
  "role": "agent" | "user",
  "content": "Bonjour, comment allez-vous?"
}

Response:
{
  "status": "ok",
  "session_id": "uuid-generated"
}
```

**Notes** :
- `session_id` peut être `null` au premier message
- Le serveur crée une nouvelle session si `null`
- Retourne le `session_id` pour le stocker en localStorage

### 2. **GET /chat/{sessionId}/history**

Récupérer l'historique complet

```json
Response:
[
  {
    "role": "user" | "agent",
    "content": "Message text",
    "timestamp": "2025-04-26T10:30:00Z"
  },
  ...
]
```

**Notes** :
- Appelé toutes les 2 secondes (polling)
- Retourne TOUS les messages de la session
- Utilisé pour synchroniser l'interface

### 3. **POST /agent/listen**

Entraîner l'IA (mode LISTEN)

```json
Request:
{
  "session_id": "uuid",
  "message": "Bonjour, quel est votre prix?"
}

Response:
{
  "status": "ok",
  "session_id": "uuid"
}
```

**Notes** :
- Aucune réponse n'est générée
- Préparation en tâche de fond
- Peut être ignorée côté client si mode change

### 4. **POST /agent/respond**

Générer une réponse (mode AUTO)

```json
Request:
{
  "session_id": "uuid",
  "message": "Bonjour, quel est votre prix?",
  "context_window": 6
}

Response:
{
  "status": "ok" | "error",
  "response": "Merci de votre intérêt...",
  "session_id": "uuid"
}
```

**Notes** :
- `context_window` : Nombre de messages à analyser (2-20)
- La réponse est ajoutée à l'historique
- Affect la qualité/vitesse des réponses

---

## 📦 Dépendances Principales

### Production

| Package | Version | Usage |
|---------|---------|-------|
| `next` | 16.0.10 | Framework principal |
| `react` | 19.2.1 | Composants UI |
| `react-dom` | 19.2.1 | DOM rendering |
| `typescript` | ^5 | Typage statique |
| `tailwindcss` | ^3.4.19 | Styles CSS-in-utility |
| `lucide-react` | ^0.574.0 | Icônes SVG |

### Development

| Package | Version | Usage |
|---------|---------|-------|
| `@tailwindcss/postcss` | ^4 | PostCSS plugin |
| `@types/node` | ^20 | Types Node.js |
| `@types/react` | ^19 | Types React |
| `autocorrect-postcss` | ^10.4.23 | Autoprefixer |
| `babel-plugin-react-compiler` | 1.0.0 | Optimisation React |
| `eslint` | ^9 | Linting |
| `postcss` | ^8.5.6 | CSS processing |

---

## 📝 Scripts Disponibles

```bash
npm run dev      # Développement avec hot reload
                 # Port: 3000
                 # Auto-restart on file change

npm run build    # Compilation production
                 # Output: .next/
                 # Optimisation: Minification, tree-shaking

npm start        # Lancer app en production
                 # Port: 3000 (ou $PORT)
                 # Utilise build/.next/

npm run lint     # Vérifier le code
                 # ESLint check sur src/
                 # Pas de fix automatique
```

---

## 🧪 Guide de Développement

### Ajouter une nouvelle page

```typescript
// src/app/new-page/page.tsx
"use client";

import Link from 'next/link';

export default function NewPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold">
        Contenu de la nouvelle page
      </h1>
    </div>
  );
}
```

Automatiquement routable sur `/new-page`

### Appeler l'API backend

```typescript
// src/services/api.ts
// Ajouter une nouvelle méthode

async myNewEndpoint(params: string) {
  const res = await fetch(`${API_BASE}/my-endpoint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ params })
  });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

// Utilisation dans un composant
import { chatService } from '@/services/api';

const result = await chatService.myNewEndpoint('value');
```

### Persister des données utilisateur

```typescript
// localStorage (avec namespace)
const key = `snappy_sessionId_${chatId}`;
localStorage.setItem(key, value);
const value = localStorage.getItem(key);
localStorage.removeItem(key);
localStorage.clear(); // ⚠️ Logout
```

**Clés utilisées** :
- `chat_role` : 'agent' | 'user'
- `snappy_session_{chatId}` : UUID de session

### Styling personnalisé

```typescript
// Utiliser Tailwind classes directement
className="px-4 py-2 bg-[#f37321] text-white 
           rounded-xl shadow-lg hover:shadow-xl 
           transition-all active:scale-95"

// Responsive
className="p-4 md:p-6 lg:p-8 w-full md:w-1/2"

// Conditional
className={`${isActive ? 'bg-orange-500' : 'bg-gray-200'}`}
```

### Debugger

```typescript
// Console
console.log('Message:', data);

// DevTools
// F12 → Onglet "Sources" → Breakpoints
// F12 → Onglet "Console" → Évaluation

// React DevTools
// Extension Chrome/Firefox pour inspecter state/props
```

---

## 🎯 Fonctionnalités Avancées

### 1. **Mode Agent Autonome (POMDP)**
- **OFF** : Inactif, pas d'action
- **LISTEN** : Analyse en background, suggestions (non envoyées)
- **ON** : Réponses automatiques à chaque message client

### 2. **Gestion de Contexte Dynamique**
- Fenêtre de contexte variable : 2-20 messages
- Configuration en temps réel via slider
- Peut être changée sans relancer le chat
- Affecte la latence et qualité des réponses IA

### 3. **Simulation Dual-Role**
- Testez comme Agent ET Client dans le même chat
- Changement rapide via logout/login
- Historique partagé en temps réel
- Permets de tester les réponses IA

### 4. **Customisation IA Complète**
- **Ton** : Formel / Amical / Dynamique
- **Créativité** : Slider Précis ↔ Créatif
- **Persona** : Instructions système custom (textarea)
- **Fenêtre contexte** : 2-20 messages

### 5. **Responsive Design Avancé**
- Sidebar cache sur mobile (<md)
- Chat fullscreen en mobile si isChatPage
- Layout adapté tablet/desktop
- Touch-friendly buttons (48x48px min)

---

## 🚨 Points d'Attention Importants

1. **Session ID dynamique**
   - Généré au premier message
   - Stocké en localStorage avec clé `snappy_session_{chatId}`
   - Utilisé pour tous les appels API suivants

2. **Polling toutes les 2 secondes**
   - Peut être augmenté pour réduire charge CPU/API
   - Change la latence de synchronisation
   - Considérer WebSocket pour production

3. **Responsive Layout**
   - Testez bien sur mobile (sidebars complexes)
   - iPhone 5S minimale (320px)
   - iPad (768px)
   - Desktop (1024px+)

4. **Mode AUTO désactive input**
   - Design intentionnel pour autonomie IA
   - Users ne doivent pas taper pendant réponse auto
   - Changement de mode réactive input

5. **CORS Backend**
   - Assurez-vous que backend accepte:
     - Headers: `Content-Type: application/json`
     - Origin: `http://localhost:3000`
   - Tester avec curl en cas d'erreur

6. **localStorage Limits**
   - Max ~5-10MB par domaine
   - Attention aux gros historiques
   - Implémenter cleanup si nécessaire

---

## 📚 Ressources Externes

- **[Next.js Documentation](https://nextjs.org/docs)** - Complet + exemples
- **[React 19 Hooks](https://react.dev)** - useState, useEffect, useRef, etc.
- **[Tailwind CSS](https://tailwindcss.com)** - Classes utilities
- **[TypeScript Handbook](https://www.typescriptlang.org/docs)** - Types & interfaces
- **[Lucide Icons](https://lucide.dev)** - 574 icônes disponibles

---

## 🔄 Cycle de Développement

### Hot Reload (npm run dev)
- Fichiers `.tsx`/`.ts` se rechargent automatiquement
- État React préservé (Fast Refresh)
- CSS se recompile en temps réel
- Les erreurs s'affichent dans navigateur (Error Overlay)

### Build Production
```bash
npm run build      # Compile TypeScript + bundle
npm start          # Démarre serveur optimisé
```

---

## 💡 Conseils & Bonnes Pratiques

1. **Optimisation Performance**
   - Utiliser `useMemo()` pour calculs lourds
   - Utiliser `useCallback()` pour handlers
   - Images optimisées avec `next/image`
   - Code splitting automatique par route

2. **Qualité de Code**
   - TypeScript strict mode activé
   - ESLint vérife le code côté dev
   - Maintenir des conventions de naming
   - Commenter le code complexe

3. **Sécurité**
   - Variables sensibles dans `.env.local` (jamais en git)
   - HTTPS obligatoire en production
   - Validations côté client + backend
   - CSRF protection

4. **Testing**
   - Tester les modes IA (OFF/LISTEN/ON)
   - Tester les roles (Agent/Client)
   - Tester responsiveness (mobile/tablet/desktop)
   - Tester le polling (arrêt/redémarrage)

---

## 📝 Notes Supplémentaires

- **Dark theme** : Implémenté pour `/settings/ai` uniquement
- **Mobile first** : Design responsive dès le départ
- **État global** : Utilise localStorage (pas Redux/Context)
- **Avatars** : Générés dynamiquement via `ui-avatars.com`
- **React Compiler** : Activé automatiquement dans `next.config.ts`
- **Notifications** : Aucune intégrée (peut être ajoutée)
- **Authentication** : Simulation locale seulement (pas JWT)

---

## 📊 Informations du Projet

| Clé | Valeur |
|-----|--------|
| **Nom** | snappy-agent-marketing |
| **Version** | 0.1.0 |
| **Type** | POC (Proof of Concept) |
| **Status** | En développement |
| **Usage** | Automation marketing + Support client via IA |
| **Framework** | Next.js 16 |
| **Langage** | TypeScript |
| **Styling** | Tailwind CSS |
| **Déploiement** | Vercel recommandé |

---

## 🎓 Résumé Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SNAPPY AGENT FRONTEND                │
│                   (Next.js 16 + React 19)               │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                         routing                          │
│  ├─ / → Landing                                         │
│  ├─ /login → Sélection rôle                             │
│  ├─ /register → Inscription                             │
│  ├─ /chat → Index (placeholder)                         │
│  ├─ /chat/[chatId] → Chat dynamique (POMDP)            │
│  └─ /settings/ai → Config IA                            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT                    │
│  ├─ React hooks (useState, useRef, useEffect)           │
│  ├─ localStorage (chat_role, snappy_session_*)         │
│  └─ Polling API (2s interval)                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                       API INTEGRATION                    │
│  ├─ src/services/api.ts (abstraction layer)            │
│  ├─ Base: process.env.NEXT_PUBLIC_API_URL              │
│  ├─ 4 endpoints: simulate-human, history, listen, respond
│  └─ Gestion d'erreur basic (console.error)             │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                       STYLING LAYER                      │
│  ├─ Tailwind CSS (utility-first)                        │
│  ├─ Dark theme support                                  │
│  ├─ Responsive design (mobile-first)                    │
│  └─ Custom colors (#f37321, #121820, etc.)             │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    BACKEND (Python/FastAPI)             │
│            http://localhost:8000 (via .env.local)       │
│  ├─ Session management                                  │
│  ├─ IA logic (LISTEN, RESPOND)                          │
│  └─ Message history storage                             │
└──────────────────────────────────────────────────────────┘
```

---

## 🜆 Erreurs Courantes & Solutions

| Erreur | Cause | Solution |
|--------|-------|----------|
| Cannot find module '@/' | Paths alias mal configuré | Vérifier `tsconfig.json` |
| 404 sur API | Backend non lancé | `python app.py` sur port 8000 |
| Styles ne s'appliquent pas | Tailwind cache | `rm -rf .next && npm run dev` |
| localStorage vide | Domaine différent | Vérifier `document.domain` |
| Polling ne sync pas | Session expirée | Rafraîchir page, login de nouveau |

---

## ✅ Checklist Avant Livraison

- [ ] Backend lancé sur http://localhost:8000
- [ ] `.env.local` contains `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [ ] `npm install` ran successfully
- [ ] `npm run dev` sans erreurs
- [ ] Pages chargent correctement
- [ ] Login fonctionne (agent + client)
- [ ] Chat peut envoyer messages
- [ ] Polling sync l'historique
- [ ] Modes IA switch correctement (OFF/LISTEN/ON)
- [ ] Responsive sur mobile
- [ ] Dark theme charges (`/settings/ai`)
- [ ] `npm run build` sans erreurs

---

**Créé avec ❤️ pour l'automatisation intelligente du support client 🚀**

**Last Updated**: 2026-04-26
