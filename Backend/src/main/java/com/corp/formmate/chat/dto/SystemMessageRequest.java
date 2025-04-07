package com.corp.formmate.chat.dto;

import com.corp.formmate.chat.entity.MessageType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "시스템 메시지 생성 요청")
public class SystemMessageRequest {

    @Schema(description = "계약서(폼) ID", example = "42", required = true)
    private Integer formId;

    @Schema(description = "메시지 내용 (요청자 이름 치환을 위해 {userName} 템플릿 변수 사용 가능)", example = "{userName}님이 서명을 요청했습니다.", required = true)
    private String content;

    @Schema(description = "메시지 유형", example = "SYSTEM_NOTIFICATION", required = true)
    private MessageType messageType;

    @Schema(description = "요청자 ID (필요한 경우, 예: '{userName}님이 요청했습니다' 같은 메시지에 사용)", example = "15", required = false)
    private Integer requestedByUserId;

    @Schema(description = "채권자 ID", example = "20", required = false)
    private Integer creditorId;

    @Schema(description = "채무자 ID", example = "25", required = false)
    private Integer debtorId;

    @Schema(description = "상대방 ID (거래 상대방)", example = "30", required = false)
    private Integer counterpartyId;

    /**
     * 기본 시스템 메시지 생성
     */
    public static SystemMessageRequest create(Integer formId, String content, MessageType messageType) {
        return SystemMessageRequest.builder()
                .formId(formId)
                .content(content)
                .messageType(messageType)
                .build();
    }

    /**
     * 요청자 정보가 포함된 시스템 메시지 생성
     */
    public static SystemMessageRequest createWithRequester(Integer formId, String content,
                                                           MessageType messageType, Integer requestedByUserId) {
        return SystemMessageRequest.builder()
                .formId(formId)
                .content(content)
                .messageType(messageType)
                .requestedByUserId(requestedByUserId)
                .build();
    }

    /**
     * 요청자, 채권자, 채무자 정보가 모두 포함된 시스템 메시지 생성
     */
    public static SystemMessageRequest createWithAllParties(Integer formId, String content,
                                                            MessageType messageType, Integer requestedByUserId,
                                                            Integer creditorId, Integer debtorId) {
        return SystemMessageRequest.builder()
                .formId(formId)
                .content(content)
                .messageType(messageType)
                .requestedByUserId(requestedByUserId)
                .creditorId(creditorId)
                .debtorId(debtorId)
                .build();
    }

    /**
     * 요청자와 상대방 정보가 포함된 시스템 메시지 생성
     */
    public static SystemMessageRequest createWithRequesterAndCounterparty(Integer formId, String content,
                                                                          MessageType messageType,
                                                                          Integer requestedByUserId,
                                                                          Integer counterpartyId) {
        return SystemMessageRequest.builder()
                .formId(formId)
                .content(content)
                .messageType(messageType)
                .requestedByUserId(requestedByUserId)
                .counterpartyId(counterpartyId)
                .build();
    }
}
