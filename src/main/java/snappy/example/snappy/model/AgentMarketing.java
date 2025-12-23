package snappy.example.snappy.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import lombok.*;

@Table("agent_marketing")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AgentMarketing {
    @Id
    private Long id;
    private String name;
    private String type; // "Human" | "AI" selon ton diagramme
}