package com.corp.formmate.chat.dto;

import com.corp.formmate.chat.entity.MessageType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "채팅 메세지 응답")
public class ChatResponse {
    @Schema(description = "메시지 ID", example = "123")
    private Integer id;

    @Schema(description = "관련 계약서(폼) ID", example = "42")
    private Integer formId;

    @Schema(description = "작성자 ID", example = "15")
    private Integer writerId;

    @Schema(description = "작성자 이름", example = "홍길동")
    private String writerName;

    @Schema(description = "메시지 내용", example = "안녕하세요, 계약과 관련하여 질문이 있습니다.")
    private String content;

    @Schema(description = "작성 시간", example = "2024-03-31T14:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "메시지 유형", example = "CHAT")
    private MessageType messageType;

    @Schema(description = "서명 요청을 받을 사람", example = "1")
    private Integer targetUserId;
}
