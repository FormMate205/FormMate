package com.corp.formmate.chat.controller;

import com.corp.formmate.chat.dto.*;
import com.corp.formmate.chat.service.ChatService;
import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.user.dto.AuthUser;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.CustomUserDetailsService;
import com.corp.formmate.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Parameter;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Tag(name = "채팅 API", description = "채팅 관련 API")
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    /**
     * 웹소켓을 통한 메세지 전송 처리
     * /app/chat.sendMessage로 메세지를 받아 처리
     */
//    @MessageMapping("/chat.sendMessage")
//    public void sendMessage(@Payload @Valid ChatRequest chatRequest, @CurrentUser AuthUser authUser) {
//        log.info("메세지 수신: [} - 사용자: {}", chatRequest, authUser.getUsername());
//
//        // 메세지 저장 및 응답 생성
//        ChatResponse chatResponse = chatService.createChat(chatRequest, authUser.getId());
//
//        // 특정 계약의 채팅방으로 메세지 브로드캐스트
//        messagingTemplate.convertAndSend("/topic/chat" + chatRequest.getFormId(), chatResponse);
//
//        log.info("메세지 전송 완료: {}", chatResponse.getId());
//    }
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload @Valid ChatRequest chatRequest, SimpMessageHeaderAccessor headerAccessor) {
        // Principal에서 사용자 정보 추출
        Principal principal = headerAccessor.getUser();
        if (principal != null) {
            throw new UserException(ErrorCode.UNAUTHORIZED);
        }

        String username = principal.getName();
        Integer userId = userService.selectByEmail(username).getId();

        log.info("메세지 수신: {} - 사용자: {}", chatRequest, username);

        ChatResponse chatResponse = chatService.createChat(chatRequest, userId);

        messagingTemplate.convertAndSend("/topic/chat" + chatRequest.getFormId(), chatResponse);

        log.info("메세지 전송 완료: {}", chatResponse.getId());
    }

    /**
     * 메세지 전송 (REST API)
     */
    @Operation(summary = "채팅 메시지 전송", description = "계약서에 관련된 메시지를 전송합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "메시지 전송 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ChatResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 입력값",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 400,
                            "message": "잘못된 입력값입니다",
                            "errors": [
                                {
                                    "field": "content",
                                    "value": "",
                                    "reason": "메시지 내용은 필수 입력값입니다."
                                }
                            ]
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "채팅방 접근 권한 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 403,
                            "message": "채팅방 접근 권한이 없습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "계약서(폼)를 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 404,
                            "message": "폼을 찾을 수 없습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "서버 오류",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 500,
                            "message": "채팅 전송 중 오류가 발생했습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            )
    })
    @PostMapping("/messages")
    public ResponseEntity<ChatResponse> sendMessages(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "채팅 메시지 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = ChatRequest.class))
            )
            @Valid @RequestBody ChatRequest chatRequest,
            @CurrentUser AuthUser authUser
    ) {
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
    @Operation(summary = "채팅방 목록 조회", description = "사용자의 모든 채팅방 목록을 조회합니다. 미완료 채팅방이 먼저 표시되고, 각 그룹 내에서는 최신 메시지순으로 정렬됩니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "채팅방 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ChatRoomSliceResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "서버 오류",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 500,
                            "message": "채팅방 목록 조회 중 오류가 발생했습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            )
    })
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
    @Operation(summary = "채팅 내역 조회", description = "특정 계약의 채팅 내역을 조회합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "채팅 내역 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ChatSliceResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "채팅방 접근 권한 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 403,
                            "message": "채팅방 접근 권한이 없습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "계약서(폼)를 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 404,
                            "message": "폼을 찾을 수 없습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "서버 오류",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 500,
                            "message": "채팅 내역 조회 중 오류가 발생했습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            )
    })
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
