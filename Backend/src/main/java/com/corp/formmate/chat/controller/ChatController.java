package com.corp.formmate.chat.controller;

import com.corp.formmate.chat.dto.*;
import com.corp.formmate.chat.service.ChatService;
import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.user.dto.AuthUser;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Parameter;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Tag(name = "채팅 API", description = "채팅 관련 API")
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 웹소켓을 통한 메세지 전송 처리
     * /app/chat.sendMessage로 메세지를 받아 처리
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload @Valid ChatRequest chatRequest, @CurrentUser AuthUser authUser) {
        log.info("메세지 수신: [} - 사용자: {}", chatRequest, authUser.getUsername());

        // 메세지 저장 및 응답 생성
        ChatResponse chatResponse = chatService.createChat(chatRequest, authUser.getId());

        // 특정 계약의 채팅방으로 메세지 브로드캐스트
        messagingTemplate.convertAndSend("/topic/chat" + chatRequest.getFormId(), chatResponse);

        log.info("메세지 전송 완료: {}", chatResponse.getId());
    }

    /**
     * 메세지 전송 (REST API)
     */
    @PostMapping("/messages")
    public ResponseEntity<ChatResponse> sendMessages(@Valid @RequestBody ChatRequest chatRequest, @CurrentUser AuthUser authUser) {
        log.info("REST API를 통한 메시지 전송: {} - 사용자: {}", chatRequest, authUser.getUsername());

        // 메세지 저장
        ChatResponse chatResponse = chatService.createChat(chatRequest, authUser.getId());

        // WebSocket을 통해 메세지 브로드캐스트 (실시간 업데이트를 위해)
        messagingTemplate.convertAndSend("/topic/chat" + chatRequest.getFormId(), chatResponse);

        return ResponseEntity.status(HttpStatus.OK).body(chatResponse);
    }

    /**
     * 사용자의 모든 채팅방 목록 조회
     */
    @GetMapping("/rooms")
    public ResponseEntity<ChatRoomSliceResponse> selectChatRooms(
            @Parameter(description = "페이지 번호(0부터 시작)", required = true)
            @RequestParam(defaultValue = "0") Integer page,
            @Parameter(description = "페이지 크기", required = true)
            @RequestParam(defaultValue = "10") Integer size,
            @CurrentUser AuthUser authUser
    ) {
        log.info("채팅방 목록 조회 요청: 사용자 ID={}, 페이지={}, 크기={}", authUser.getId(), page, size);

        Slice<ChatRoomResponse> chatRooms = chatService.selectChatRoomsSlice(authUser.getId(), page, size);

        // Slice 객체를 응답 형식에 맞게 변환
        ChatRoomSliceResponse response = ChatRoomSliceResponse.fromSlice(chatRooms);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * 특정 계약의 채팅 내역 SLice 조회
     */
    @GetMapping("/rooms/{formId}")
    public ResponseEntity<ChatSliceResponse> selectChatHistorySlice(
            @Parameter(description = "계약서(폼) ID", required = true)
            @PathVariable Integer formId,
            @Parameter(description = "페이지 번호(0부터 시작)", required = true)
            @RequestParam(defaultValue = "0") Integer page,
            @Parameter(description = "페이지 크기", required = true)
            @RequestParam(defaultValue = "20") Integer size,
            @CurrentUser AuthUser authUser
    ) {
        log.info("채팅 내역 Slice 조회 요청: 폼 ID={}, 사용자 ID={}, 페이지={}, 크기={}", formId, authUser.getId(), page, size);

        Slice<ChatResponse> chatSlice  = chatService.selectChatHistorySlice(formId, authUser.getId(), page, size);

        // 메세지 읽음 처리
        chatService.markAsRead(formId, authUser.getId());

        // Slice 객체를 간소화된 응답 객체로 변환
        ChatSliceResponse response = ChatSliceResponse.fromSlice(chatSlice);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
