package com.corp.formmate.chat.dto;

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
@Schema(description = "채팅방 목록 페이지 응답")
public class ChatRoomSliceResponse {
    @Schema(description = "채팅방 목록")
    private List<ChatRoomResponse> content;

    @Schema(description = "현재 페이지 번호", example = "0")
    private int pageNumber;

    @Schema(description = "페이지 크기", example = "10")
    private int pageSize;

    @Schema(description = "첫 페이지 여부", example = "true")
    private boolean first;

    @Schema(description = "마지막 페이지 여부", example = "false")
    private boolean last;

    @Schema(description = "현재 페이지의 요소 개수", example = "10")
    private int numberOfElements;

    @Schema(description = "비어있는지 여부", example = "false")
    private boolean empty;

    /**
     * Spring Data의 Slice 객체로부터 간소화된 응답 객체를 생성합니다.
     */
    public static ChatRoomSliceResponse fromSlice(Slice<ChatRoomResponse> slice) {
        return ChatRoomSliceResponse.builder()
                .content(slice.getContent())
                .pageNumber(slice.getNumber())
                .pageSize(slice.getSize())
                .first(slice.isFirst())
                .last(slice.isLast())
                .numberOfElements(slice.getNumberOfElements())
                .empty(slice.isEmpty())
                .build();
    }
}
