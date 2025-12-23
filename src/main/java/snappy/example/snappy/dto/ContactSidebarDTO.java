package snappy.example.snappy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactSidebarDTO {
    private Long id;
    private String name;      // ex: "Sarah (Marketing)"
    private String lastMsg;   // ex: "On peut valider la maquette ?"
    private String time;      // Formaté pour le front (ex: "10:42")
    private Integer unread;   // Nombre de messages non-lus (ex: 2)
    private Boolean online;   // État du point vert
    private String avatarUrl; // URL de l'image de profil
}