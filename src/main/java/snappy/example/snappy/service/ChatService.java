package snappy.example.snappy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import snappy.example.snappy.dto.ContactSidebarDTO;
import snappy.example.snappy.model.*;
import snappy.example.snappy.repository.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ContactRepository contactRepo;
    private final MessageRepository messageRepo;
    private final DiscussionRepository discussionRepo;
    private final AgentMarketingRepository agentRepo;

    public Flux<Contact> getSidebarContacts() {
        return contactRepo.findAll();
    }

    public Mono<Message> sendMessage(Message msg) {
        msg.setTimestamp(LocalDateTime.now());
        return messageRepo.save(msg);
    }

    public Mono<AppUser> getUserById(Long userId) {
        // Simulation d'une récupération en base pour l'utilisateur connecté
        return Mono.just(AppUser.builder()
                .id(userId)
                .username("Admin PME")
                .avatarUrl("https://ui-avatars.com/api/?name=Admin")
                .build());
    }

    public Flux<ContactSidebarDTO> getConversationsForUser(Long userId) {
        // On récupère les discussions puis on enrichit avec les infos du contact
        return discussionRepo.findAll() // Idéalement filtré par utilisateur plus tard
                .flatMap(discussion -> contactRepo.findById(discussion.getContactId())
                        .map(contact -> ContactSidebarDTO.builder()
                                .id(contact.getId())
                                .name(contact.getName())
                                .lastMsg(contact.getLastMsg()) // Source: image_59e7c5.png
                                .online(contact.getOnline())   // Source: image_59e7c5.png
                                .time(discussion.getCreatedAt().format(DateTimeFormatter.ofPattern("HH:mm")))
                                .build()));
    }

    public Flux<Message> getMessagesByDiscussion(Long discussionId) {
        return messageRepo.findAllByDiscussionIdOrderByTimestampAsc(discussionId);
    }

    public Mono<Message> processNewMessage(Message msg) {
        msg.setTimestamp(LocalDateTime.now());
        return messageRepo.save(msg);
    }
}