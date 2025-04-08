package com.corp.formmate.chat.dto;

import com.corp.formmate.form.dto.FormInformation;
import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.form.entity.TerminationProcess;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Slice;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "채팅 메시지 페이지 응답")
public class ChatSliceResponse {

    @Schema(description = "채팅 메시지 목록")
    private List<ChatResponse> content;

    @Schema(description = "현재 페이지 번호", example = "0")
    private int pageNumber;

    @Schema(description = "페이지 크기", example = "20")
    private int pageSize;

    @Schema(description = "첫 페이지 여부", example = "true")
    private boolean first;

    @Schema(description = "마지막 페이지 여부", example = "false")
    private boolean last;

    @Schema(description = "현재 페이지의 요소 개수", example = "15")
    private int numberOfElements;

    @Schema(description = "비어있는지 여부", example = "false")
    private boolean empty;

    @Schema(description = "계약 정보")
    private FormInformation formInformation;

    /**
     * Spring Data의 Slice 객체로부터 간소화된 응답 객체를 생성합니다.
     */
    public static <T> ChatSliceResponse fromSlice(Slice<ChatResponse> slice,
                                                  Integer creditorId, Integer debtorId,
                                                  FormStatus formStatus, TerminationProcess terminationStatus,
                                                  Integer terminationRequestedId) {
        return ChatSliceResponse.builder()
                .content(slice.getContent())
                .pageNumber(slice.getNumber())
                .pageSize(slice.getSize())
                .first(slice.isFirst())
                .last(slice.isLast())
                .numberOfElements(slice.getNumberOfElements())
                .empty(slice.isEmpty())
                .formInformation(FormInformation.builder()
                        .creditorId(creditorId)
                        .debtorId(debtorId)
                        .formStatus(formStatus)
                        .terminationStatus(terminationStatus)
                        .terminationRequestedId(terminationRequestedId)
                        .build())
                .build();
    }
}
