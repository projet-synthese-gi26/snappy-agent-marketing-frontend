export function generateAIReply(context: string) {
    const msg = context.toLowerCase();

    if (msg.includes("prix") || msg.includes("devis")) {
        return "Merci pour votre message. Je vous prépare un devis détaillé et je reviens vers vous rapidement.";
    }

    if (msg.includes("bonjour") || msg.includes("salut")) {
        return "Bonjour 😊 j’espère que vous allez bien. Comment puis-je vous aider ?";
    }

    if (msg.includes("retard") || msg.includes("problème")) {
        return "Je comprends la situation et je suis désolé pour ce désagrément. Nous allons trouver une solution ensemble.";
    }

    return "Merci pour votre retour. Je prends note et je reviens vers vous très rapidement.";
}
