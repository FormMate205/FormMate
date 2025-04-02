package com.corp.formmate.chat.service;

import com.corp.formmate.chat.dto.ChatResponse;
import com.corp.formmate.chat.dto.SystemMessageRequest;
import com.corp.formmate.chat.entity.ChatEntity;
import com.corp.formmate.chat.entity.MessageType;
import com.corp.formmate.chat.event.*;
import com.corp.formmate.chat.repository.ChatRepository;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.service.FormService;
import com.corp.formmate.global.constants.SystemConstants;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.ChatException;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatSystemMessageService {

    private final ChatRepository chatRepository;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;
    private final FormService formService;

    /**
     * 시스템 메세지 생성 메서드
     */
    @Transactional
    public ChatResponse createSystemMessage(SystemMessageRequest request) {
        try {
            // 시스템 사용자 조회
            UserEntity systemUser = userService.selectById(SystemConstants.SYSTEM_USER_ID);

            // 계약 엔티티 조회
            FormEntity form = formService.selectById(request.getFormId());

            // 요청자 정보가 있는 경우 메세지 내용 가공
            String finalContent = request.getContent();
            if (request.getRequestedByUserId() != null) {
                UserEntity requester = userService.selectById(request.getRequestedByUserId());
                finalContent = finalContent.replace("{userName}", requester.getUserName());
            }

            // 시스템 메세지 생성 및 저장
            ChatEntity chat = ChatEntity.builder()
                    .form(form)
                    .writer(systemUser)
                    .content(finalContent)
                    .messageType(request.getMessageType())
                    .isRead(false)
                    .build();

            ChatEntity savedChat = chatRepository.save(chat);

            // 채팅 응답 DTO 생성
            ChatResponse response = createChatResponseFromEntity(savedChat);

            // 채팅방에 실시간 전송
            messagingTemplate.convertAndSend("/topic/chat/" + savedChat.getId(), response);

            return response;
        } catch (Exception e) {
            log.error("시스템 메시지 생성 중 오류 발생", e);
            throw new ChatException(ErrorCode.CHAT_SEND_ERROR);
        }
    }

    /**
     * 계약서 생성 이벤트 처리
     */
    @EventListener
    @Transactional
    public void handleFormCreateEvent(FormCreatedEvent event) {
        FormEntity form = event.getFormEntity();
        log.info("계약서 생성 이벤트 감지: form Id = {}", form.getId());

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("새로운 계약서 초안이 생성되었습니다.")
                .messageType(MessageType.CONTRACT_SHARED)
                .build();

        createSystemMessage(request);
    }

    /**
     * 계약서 수정 이벤트 처리
     */
    @EventListener
    @Transactional
    public void handleFormUpdateEvent(FormUpdatedEvent event) {
        FormEntity form = event.getFormEntity();
        log.info("계약서 수정 이벤트 감지: form Id = {}", form.getId());

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("계약서 내용이 수정되었습니다.")
                .messageType(MessageType.CONTRACT_SHARED)
                .build();

        createSystemMessage(request);
    }

    /**
     * 채무자 서명 요청 이벤트 처리
     */
    @EventListener
    @Transactional
    public void handleDebtorSignatureRequestedEvent(DebtorSignatureRequestedEvent event) {
        FormEntity form = event.getFormEntity();
        Integer requestedByUserId = event.getRequestedByUserId();
        log.info("채무자 서명 요청 이벤트 감지: form Id={}, 요청자 ID={}", form.getId(), requestedByUserId);

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{userName}님이 채무자에게 서명을 요청했습니다.")
                .messageType(MessageType.SIGNATURE_REQUEST)
                .requestedByUserId(requestedByUserId)
                .build();

        createSystemMessage(request);
    }

    /**
     * 채무자 서명 완료 이벤트 처리
     */
    @EventListener
    @Transactional
    public void handleDebtorSignatureCompletedEvent(DebtorSignatureCompletedEvent event) {
        FormEntity form = event.getFormEntity();
        log.info("채무자 서명 완료 이벤트 감지: form Id = {}", form.getId());

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("채무자의 서명이 완료되었습니다. 채권자님의 서명을 기다립니다.")
                .messageType(MessageType.SYSTEM_NOTIFICATION)
                .build();

        createSystemMessage(request);
    }

    /**
     * 채권자 서명 요청 이벤트 처리
     */
    @EventListener
    @Transactional
    public void handleCreditorSignatureRequestedEvent(CreditorSignatureRequestedEvent event) {
        FormEntity form = event.getFormEntity();
        Integer requestedByUserId = event.getRequestedByUserId();
        log.info("채권자 서명 요청 이벤트 감지: form Id={}, 요청자 ID={}", form.getId(), requestedByUserId);

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{userName}님이 채권자에게 서명을 요청했습니다.")
                .messageType(MessageType.SIGNATURE_REQUEST)
                .requestedByUserId(requestedByUserId)
                .build();

        createSystemMessage(request);
    }

    /**
     * 채권자 서명 완료 이벤트 처리 (계약 체결)
     */
    @EventListener
    @Transactional
    public void handleCreditorSignatureCompletedEvent(CreditorSignatureCompletedEvent event) {
        FormEntity form = event.getFormEntity();
        log.info("채권자 서명 완료 이벤트 감지: form Id = {}", form.getId());

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("채권자의 서명이 완료되었습니다. 계약이 체결되었습니다.")
                .messageType(MessageType.SYSTEM_NOTIFICATION)
                .build();

        createSystemMessage(request);
    }

    /**
     * 계약 종료 요청 이벤트 처리
     */
    @EventListener
    @Transactional
    public void handleFormTerminationRequestedEvent(FormTerminationRequestedEvent event) {
        FormEntity form = event.getFormEntity();
        Integer requestedByUserId = event.getRequestedByUserId();
        log.info("계약 종료 요청 이벤트 감지: form Id={}, 요청자 ID={}", form.getId(), requestedByUserId);

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{userName}님이 계약 종료를 요청했습니다.")
                .messageType(MessageType.SYSTEM_NOTIFICATION)
                .requestedByUserId(requestedByUserId)
                .build();

        createSystemMessage(request);
    }

    /**
     * 첫 번째 당사자 종료 서명 완료 이벤트 처리
     */
    @EventListener
    @Transactional
    public void handleFirstPartyTerminationSignedEvent(FirstPartyTerminationSignedEvent event) {
        FormEntity form = event.getForm();
        Integer signedByUserId = event.getSignedByUserId();
        log.info("첫 번째 당사자 종료 서명 완료 이벤트 감지: form Id={}, 서명자 ID={}", form.getId(), signedByUserId);

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{userName}님이 계약 종료에 서명했습니다. 상대방의 서명을 기다립니다.")
                .messageType(MessageType.SYSTEM_NOTIFICATION)
                .requestedByUserId(signedByUserId)
                .build();

        createSystemMessage(request);
    }

    /**
     * 계약 종료 완료 이벤트 처리
     */
    @EventListener
    @Transactional
    public void handleFormTerminationCompletedEvent(FormTerminationCompletedEvent event) {
        FormEntity form = event.getFormEntity();
        log.info("계약 종료 완료 이벤트 감지: form Id={}", form.getId());

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("모든 당사자의 서명이 완료되었습니다. 계약이 종료되었습니다.")
                .messageType(MessageType.SYSTEM_NOTIFICATION)
                .build();

        createSystemMessage(request);
    }

    /**
     * 채팅 엔티티를 응답 DTO로 변환
     */
    private ChatResponse createChatResponseFromEntity(ChatEntity chatEntity) {
        return ChatResponse.builder()
                .id(chatEntity.getId())
                .formId(chatEntity.getForm().getId())
                .writerId(chatEntity.getWriter().getId())
                .writerName(chatEntity.getWriter().getUserName())
                .content(chatEntity.getContent())
                .isRead(chatEntity.getIsRead())
                .createdAt(chatEntity.getCreatedAt())
                .messageType(chatEntity.getMessageType())
                .isCreditorMessage(chatEntity.isCreditorMessage())
                .isDebtorMessage(chatEntity.isDebtorMessage())
                .build();
    }

    /**
     * 특정 계약에 시스템 메세지를 전송하는 공용 메서드
     * 다른 서비스에서도 호출할 수 있도록 public으로 선언
     */
    @Transactional
    public ChatResponse sendSystemMessage(SystemMessageRequest request) {
        return createSystemMessage(request);
    }
}
