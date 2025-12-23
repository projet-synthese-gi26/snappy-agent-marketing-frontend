package snappy.example.snappy.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Table("contact") // Nom de la table dans PostgreSQL
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contact {
    @Id
    private Long id;

    private String name;    // "Sarah (Marketing)"
    private String channel; // "Human" ou "AI" (selon ton diagramme)

    // Champs pour la cohérence Frontend
    private String lastMsg; // "On peut valider la maquette ?"
    private Boolean online; // Statut vert dans ta sidebar
}