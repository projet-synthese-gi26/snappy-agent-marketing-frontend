package snappy.example.snappy.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import lombok.*;
import java.time.LocalDateTime;

@Table("message")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Message {
    @Id
    private Long id;
    private String content;    // Le texte du message
    private LocalDateTime timestamp;
    private String sender;     // "me" ou le nom du contact
    private Long discussionId; // Lien vers la discussion
}