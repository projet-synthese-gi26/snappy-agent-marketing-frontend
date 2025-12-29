package com.example.snappy.controller;

import com.example.snappy.dto.MessageRequest;
import com.example.snappy.service.ConversationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService service;

    public ConversationController(ConversationService service) {
        this.service = service;
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<?> sendMessage(
            @PathVariable UUID id,
            @RequestBody MessageRequest request
    ) {
        return ResponseEntity.ok(
                service.sendAgentMessage(id, request.getContent())
        );
    }
}
