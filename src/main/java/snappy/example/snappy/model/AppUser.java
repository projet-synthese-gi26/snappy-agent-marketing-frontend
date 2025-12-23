package snappy.example.snappy.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import lombok.*;

@Table("app_user")
@Data @Builder @NoArgsConstructor @AllArgsConstructor // Ajoute ces annotations
public class AppUser {
    @Id
    private Long id;
    private String username; // Assure-toi que c'est username et pas name pour être cohérent
    private String password;
    private String avatarUrl;
}