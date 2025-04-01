package com.corp.formmate.chat.dto;

import com.corp.formmate.chat.entity.MessageType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "채팅 메시지 요청")
public class ChatRequest {
    @Schema(description = "관련 계약서(폼) ID", example = "42", required = true)
    private Integer formId;

    @Schema(description = "메시지 내용", example = "안녕하세요, 계약과 관련하여 질문이 있습니다.", required = true)
    private String content;

    @Schema(description = "메시지 유형", example = "CHAT", required = false)
    private MessageType messageType = MessageType.CHAT;
}
