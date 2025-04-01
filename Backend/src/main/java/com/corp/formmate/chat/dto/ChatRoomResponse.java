package com.corp.formmate.chat.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "채팅방 연결 응답")
public class ChatRoomResponse {
    @Schema(description = "계약서(폼) ID", example = "42")
    private Integer formId;

    @Schema(description = "채권자 이름", example = "홍길동")
    private String creditorName;

    @Schema(description = "채무자 이름", example = "김철수")
    private String debtorName;

    @Schema(description = "마지막 메시지", example = "안녕하세요, 계약과 관련하여 질문이 있습니다.")
    private String lastMessage;

    @Schema(description = "마지막 메시지 시간", example = "2024-03-31T14:30:00")
    private LocalDateTime lastMessageTime;

    @Schema(description = "안읽은 메시지 수", example = "3")
    private Integer unreadCount;
}
