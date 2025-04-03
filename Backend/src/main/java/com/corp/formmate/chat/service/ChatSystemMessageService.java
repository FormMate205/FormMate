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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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

            // 채권자 정보가 있는 경우 치환
            if (request.getCreditorId() != null) {
                UserEntity creditor = userService.selectById(request.getCreditorId());
                finalContent = finalContent.replace("{creditorName}", creditor.getUserName());
            }

            // 채무자 정보가 있는 경우 치환
            if (request.getDebtorId() != null) {
                UserEntity debtor = userService.selectById(request.getDebtorId());
                finalContent = finalContent.replace("{debtorName}", debtor.getUserName());
            }

            // 상대방 정보가 있는 경우 치환
            if (request.getCounterpartyId() != null) {
                UserEntity counterparty = userService.selectById(request.getCounterpartyId());
                finalContent = finalContent.replace("{counterpartyName}", counterparty.getUserName());
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
        Integer requestedByUserId = event.getRequestedByUserId();
        log.info("계약서 생성 이벤트 감지: form Id = {}", form.getId());

        Integer creditorId = form.getCreditor().getId();
        Integer debtorId = form.getDebtor().getId();

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{creditorName}님과 {debtorName}님의 금전 차용증 계약서가 완성되었습니다. 계약 내용을 확인한 후, 서명하고 최종 승인해주세요.\n\n계약서 수정은 생성자인 {userName}님에게 권한이 있습니다.")
                .messageType(MessageType.SYSTEM_NOTIFICATION)
                .requestedByUserId(requestedByUserId)
                .creditorId(creditorId)
                .debtorId(debtorId)
                .build();

        createSystemMessage(request);

        String content = createForm(form);

        SystemMessageRequest secondRequest = SystemMessageRequest.builder()
                .formId(form.getId())
                .content(content)
                .messageType(MessageType.CONTRACT_SHARED)
                .build();

        createSystemMessage(request);

        SystemMessageRequest thirdRequest = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{debtorName}님의 서명을 기다립니다.")
                .messageType(MessageType.SIGNATURE_REQUEST)
                .debtorId(debtorId)
                .build();

        createSystemMessage(thirdRequest);
    }

    /**
     * 계약서 요약본 생성
     */
    private String createForm(FormEntity form) {
        StringBuilder sb = new StringBuilder();

        Integer creditorId = form.getCreditor().getId();
        Integer debtorId = form.getDebtor().getId();

        UserEntity creditor = userService.selectById(creditorId);
        UserEntity debtor = userService.selectById(debtorId);

        String creditorName = creditor.getUserName();
        String debtorName = debtor.getUserName();

        String creditorPhone = creditor.getPhoneNumber();
        String formattedCreditorPhone = creditorPhone.replaceFirst("(\\d{3})(\\d{4})(\\d+)", "$1-$2-$3");
        String debtorPhone = debtor.getPhoneNumber();
        String formattedDebtorPhone = debtorPhone.replaceFirst("(\\d{3})(\\d{4})(\\d+)", "$1-$2-$3");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        LocalDateTime contractDate = form.getContractDate();
        String formattedContractDate = contractDate.format(formatter); // 차용 일자
        Long loanAmount = form.getLoanAmount(); // 차용액
        LocalDateTime maturityDate = form.getMaturityDate();
        String formattedMaturityDate = maturityDate.format(formatter); // 변제일
        BigDecimal interestRate = form.getInterestRate(); // 이자율
        Integer repaymentDay = form.getRepaymentDay(); // 상환방식 날짜

        sb.append("금전 차용 계약서\n\n");
        sb.append("채권자 : ").append(creditorName).append(" (").append(formattedCreditorPhone).append(")\n");
        sb.append("채무자 : ").append(debtorName).append(" (").append(formattedDebtorPhone).append(")\n\n");
        sb.append("차용 일자 : ").append(formattedContractDate).append("\n");
        sb.append("차용액 : ").append(String.format("%,d", loanAmount)).append("원\n");
        sb.append("변제일 : ").append(formattedMaturityDate).append("\n");
        sb.append("이자율 : ").append(interestRate).append("%\n");
        sb.append("매월 ").append(repaymentDay).append("일");

        return sb.toString();
    }

    /**
     * 계약서 수정 이벤트 처리
     */
    @EventListener
    @Transactional
    public void handleFormUpdateEvent(FormUpdatedEvent event) {
        FormEntity form = event.getFormEntity();
        Integer requestedByUserId = event.getRequestedByUserId();
        log.info("계약서 수정 이벤트 감지: form Id = {}", form.getId());

        Integer creditorId = form.getCreditor().getId();
        Integer debtorId = form.getDebtor().getId();

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{creditorName}님과 {debtorName}님의 금전 차용증 계약서가 수정되었습니다. 계약 내용을 확인한 후, 서명하고 최종 승인해주세요.\n\n계약서 수정은 생성자인 {userName}님에게 권한이 있습니다.")
                .messageType(MessageType.CONTRACT_SHARED)
                .requestedByUserId(requestedByUserId)
                .creditorId(creditorId)
                .debtorId(debtorId)
                .build();

        createSystemMessage(request);

        String content = createForm(form);

        SystemMessageRequest secondRequest = SystemMessageRequest.builder()
                .formId(form.getId())
                .content(content)
                .messageType(MessageType.CONTRACT_SHARED)
                .build();

        createSystemMessage(secondRequest);

        SystemMessageRequest thirdRequest = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{debtorName}님의 서명을 기다립니다.")
                .messageType(MessageType.SIGNATURE_REQUEST)
                .debtorId(debtorId)
                .build();

        createSystemMessage(thirdRequest);
    }

    /**
     * 채무자 서명 완료 이벤트 처리
     */
    @EventListener
    @Transactional
    public void handleDebtorSignatureCompletedEvent(DebtorSignatureCompletedEvent event) {
        FormEntity form = event.getFormEntity();
        log.info("채무자 서명 완료 이벤트 감지: form Id={}", form.getId());

        Integer creditorId = form.getCreditor().getId();
        Integer debtorId = form.getDebtor().getId();

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{debtorName}님의 서명이 완료되었습니다.")
                .messageType(MessageType.SYSTEM_NOTIFICATION)
                .creditorId(creditorId)
                .debtorId(debtorId)
                .build();

        createSystemMessage(request);

        SystemMessageRequest secondRequest = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{creditorName}님의 서명을 기다립니다.")
                .messageType(MessageType.SIGNATURE_REQUEST)
                .creditorId(creditorId)
                .build();

        createSystemMessage(secondRequest);
    }

    /**
     * 채권자 서명 완료 이벤트 처리 (계약 체결)
     */
    @EventListener
    @Transactional
    public void handleCreditorSignatureCompletedEvent(CreditorSignatureCompletedEvent event) {
        FormEntity form = event.getFormEntity();
        log.info("채권자 서명 완료 이벤트 감지: form Id={}", form.getId());

        Integer creditorId = form.getCreditor().getId();

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{creditorName}님의 서명이 완료되었습니다. 계약이 체결되었습니다.")
                .messageType(MessageType.SYSTEM_NOTIFICATION)
                .creditorId(creditorId)
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
        Integer counterpartyId;
        log.info("계약 종료 요청 이벤트 감지: form Id={}, 요청자 ID={}", form.getId(), requestedByUserId);

        Integer creditorId = form.getCreditor().getId();
        Integer debtorId = form.getDebtor().getId();

        if (requestedByUserId == creditorId) {
            counterpartyId = debtorId;
        } else {
            counterpartyId = creditorId;
        }

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{userName}님이 계약 종료를 요청했습니다. {counterpartyName}님의 서명을 기다립니다.")
                .messageType(MessageType.SIGNATURE_REQUEST)
                .requestedByUserId(requestedByUserId)
                .counterpartyId(counterpartyId)
                .build();

        createSystemMessage(request);
    }

    /**
     * 계약 종료 요청 취소 이벤트 처리
     */
    @EventListener
    @Transactional
    public void handleFormTerminationCancelledEvent(FormTerminationCancelledEvent event) {
        FormEntity form = event.getFormEntity();
        Integer requestedByUserId = event.getRequestedByUserId();
        log.info("계약 종료 요청 취소 이벤트 감지: form Id={}, 요청자 ID={}", form.getId(), requestedByUserId);

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{userName}님이 계약 종료 과정을 취소하였습니다.")
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
        FormEntity form = event.getFormEntity();
        Integer requestedByUserId = event.getRequestedByUserId();
        Integer counterpartyId;
        log.info("첫 번째 당사자 종료 서명 완료 이벤트 감지: form Id={}, 서명자 ID={}", form.getId(), requestedByUserId);

        Integer creditorId = form.getCreditor().getId();
        Integer debtorId = form.getDebtor().getId();

        if (requestedByUserId == creditorId) {
            counterpartyId = debtorId;
        } else {
            counterpartyId = creditorId;
        }

        SystemMessageRequest request = SystemMessageRequest.builder()
                .formId(form.getId())
                .content("{userName}님이 계약 종료에 서명했습니다. {counterpartyName}님의 서명을 기다립니다.")
                .messageType(MessageType.SIGNATURE_REQUEST)
                .requestedByUserId(requestedByUserId)
                .counterpartyId(counterpartyId)
                .build();
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
