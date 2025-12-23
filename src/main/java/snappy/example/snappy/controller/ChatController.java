package snappy.example.snappy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import snappy.example.snappy.dto.ContactSidebarDTO;
import snappy.example.snappy.model.AppUser;
import snappy.example.snappy.model.Contact;
import snappy.example.snappy.model.Message;
import snappy.example.snappy.service.ChatService;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    // 1. Récupérer le profil de l'utilisateur connecté (pour l'avatar en bas à gauche)
    @GetMapping("/me/{userId}")
    public Mono<AppUser> getMyProfile(@PathVariable Long userId) {
        return chatService.getUserById(userId);
    }

    // 2. Charger toutes les discussions de l'utilisateur (Sidebar)
    // On remplace les données statiques de Sarah
    @GetMapping("/discussions/user/{userId}")
    public Flux<ContactSidebarDTO> getUserDiscussions(@PathVariable Long userId) {
        return chatService.getConversationsForUser(userId);
    }

    // 3. Charger les messages d'une discussion spécifique
    @GetMapping("/messages/{discussionId}")
    public Flux<Message> getChatHistory(@PathVariable Long discussionId) {
        return chatService.getMessagesByDiscussion(discussionId);
    }

    // 4. Envoyer un message (Mode OFF simple)
    @PostMapping("/messages/send")
    public Mono<Message> postMessage(@RequestBody Message msg) {
        return chatService.processNewMessage(msg);
    }
}