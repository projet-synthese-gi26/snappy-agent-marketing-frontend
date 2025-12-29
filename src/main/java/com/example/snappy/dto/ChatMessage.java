package com.example.snappy.websocket.dto;

public class ChatMessage {

    private String chatId;
    private String sender;
    private String content;
    private boolean fromAI;

    public ChatMessage() {}

    public String getChatId() { return chatId; }
    public void setChatId(String chatId) { this.chatId = chatId; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isFromAI() { return fromAI; }
    public void setFromAI(boolean fromAI) { this.fromAI = fromAI; }
}
