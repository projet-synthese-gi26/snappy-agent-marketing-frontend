package com.example.snappy.websocket;

import com.example.snappy.websocket.dto.ChatMessage;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessage message) {

        // Diffusion temps réel vers la discussion
        messagingTemplate.convertAndSend(
                "/topic/chat." + message.getChatId(),
                message
        );
    }
}
