package com.corp.formmate.chat.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "그룹화된 채팅방 목록 응답")
public class GroupedChatRoomsResponse {
    @Schema(description = "진행 중인 계약의 채팅방 목록")
    private ChatRoomSliceResponse activeChatRooms;

    @Schema(description = "종료된 계약의 채팅방 목록")
    private ChatRoomSliceResponse completedChatRooms;
}
