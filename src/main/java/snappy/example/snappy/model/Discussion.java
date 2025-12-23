package snappy.example.snappy.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import lombok.*;
import java.time.LocalDateTime;

@Table("discussion")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Discussion {
    @Id
    private Long id;
    private String status;      // ex: "ACTIVE", "ARCHIVED"
    private LocalDateTime createdAt;
    private Long contactId;     // La discussion concerne un Contact
}