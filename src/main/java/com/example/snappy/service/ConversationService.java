package com.example.snappy.service;

import com.example.snappy.entity.*;
import com.example.snappy.repository.*;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepo;
    private final MessageRepository messageRepo;
    private final AIEngineService aiService;

    public ConversationService(
            ConversationRepository conversationRepo,
            MessageRepository messageRepo,
            AIEngineService aiService
    ) {
        this.conversationRepo = conversationRepo;
        this.messageRepo = messageRepo;
        this.aiService = aiService;
    }

    public Message sendAgentMessage(UUID conversationId, String content) {

        Conversation convo = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message agentMsg = new Message();
        agentMsg.setConversation(convo);
        agentMsg.setSender(SenderType.AGENT_HUMAN);
        agentMsg.setContent(content);
        messageRepo.save(agentMsg);

        if (convo.getMode() == Mode.ON) {

            Message aiMsg = new Message();
            aiMsg.setConversation(convo);
            aiMsg.setSender(SenderType.CLIENT_AI);
            aiMsg.setContent(
                    aiService.generateClientReply(convo.getStage())
            );

            messageRepo.save(aiMsg);
        }

        return agentMsg;
    }
}
