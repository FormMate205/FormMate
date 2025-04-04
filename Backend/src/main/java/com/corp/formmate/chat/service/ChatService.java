package com.corp.formmate.chat.service;

import com.corp.formmate.chat.dto.*;
import com.corp.formmate.chat.entity.ChatEntity;
import com.corp.formmate.chat.repository.ChatRepository;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.form.service.FormService;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.ChatException;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatRepository chatRepository;
    private final FormService formService;
    private final UserService userService;

    /**
     * 채팅 메세지를 저장하고 응답 DTO 반환
     */
    @Transactional
    public ChatResponse createChat(ChatRequest chatRequest, Integer userId) {
        try {
            // 계약 조회
            FormEntity form = formService.selectById(chatRequest.getFormId());

            // 사용자 조회
            UserEntity user = userService.selectById(userId);

            // 사용자가 해당 폼의 채권자나 채무자인지 확인
            if (!isParticipantInForm(form, userId)) {
                throw new ChatException(ErrorCode.CHAT_ROOM_ACCESS_DENIED);
            }

            // 채팅 엔티티 생성 및 저장
            ChatEntity chat = ChatEntity.builder()
                    .form(form)
                    .writer(user)
                    .content(chatRequest.getContent())
                    .messageType(chatRequest.getMessageType())
                    .isRead(false)
                    .build();

            ChatEntity savedChat = chatRepository.save(chat);

            // 응답 DTO 생성
            return createChatResponseFromEntity(savedChat);
        } catch (ChatException e) {
            log.error("채팅 메세지 저장 중 에러 발생: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("채팅 메세지 저장 중 예상치 못한 에러 발생", e);
            throw new ChatException(ErrorCode.CHAT_SEND_ERROR);
        }
    }

    /**
     * 사용자의 모든 채팅방 목록을 하나의 Slice로 조회
     * 미완료 채팅방을 먼저 보여주고, 각 그룹 내에서는 최신 메세지 순으로 정렬
     */
    @Transactional(readOnly = true)
    public Slice<ChatRoomResponse> selectChatRoomsSlice(Integer userId, int page, int size) {
        try {
            // 사용자가 참여하고 있는 모든 계약서 조회
            List<FormEntity> userForms = formService.selectFormsByUserId(userId);

            // 진행 중인 계약과 종료된 계약으로 분리
            List<FormEntity> activeForms = new ArrayList<>();
            List<FormEntity> completedForms = new ArrayList<>();

            for (FormEntity form : userForms) {
                if (form.getStatus() == FormStatus.COMPLETED) {
                    completedForms.add(form);
                } else {
                    activeForms.add(form);
                }
            }

            // 각 계약별로 채팅방 정보 생성
            List<ChatRoomResponse> activeChatRooms = createChatRoomsFromForms(activeForms, userId, false);
            List<ChatRoomResponse> completedChatRooms = createChatRoomsFromForms(completedForms, userId, true);

            // 각 그룹 내에서 최신 메세지 시간 순으로 정렬
            sortChatRoomsByLastMessageTime(activeChatRooms);
            sortChatRoomsByLastMessageTime(completedChatRooms);

            // 미완료 채팅방 먼저, 그 다음 완료된 채팅방 순으로 합침
            List<ChatRoomResponse> allChatRooms = new ArrayList<>();
            allChatRooms.addAll(activeChatRooms);
            allChatRooms.addAll(completedChatRooms);

            // 페이지네이션 처리
            return createSliceFromList(allChatRooms, page, size);
        } catch (Exception e) {
            log.error("통합 채팅방 목록 조회 중 에러 발생", e);
            throw new ChatException(ErrorCode.CHAT_NOT_FOUND);
        }
    }

    /**
     * 특정 계약의 채팅 내역을 Slice로 조회
     */
    @Transactional(readOnly = true)
    public Slice<ChatResponse> selectChatHistorySlice(Integer formId, Integer userId, int page, int size) {
        try {
            // 계약 조회
            FormEntity form = formService.selectById(formId);

            // 사용자가 해당 계약의 채권자나 채무자인지 확인
            if (!isParticipantInForm(form, userId)) {
                throw new ChatException(ErrorCode.CHAT_ROOM_ACCESS_DENIED);
            }

            // 페이지 요청 객체 생성 (시간 역순으로 정렬하여 최신 메세지부터 가져옴)
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

            // 채팅 내역 조회
            Slice<ChatEntity> chatSlice = chatRepository.findByFormAndIsDeletedFalse(form, pageable);

            // 엔티티를 DTO로 변환하여 Slice 변환
            return chatSlice.map(this::createChatResponseFromEntity);
        } catch (ChatException e) {
            log.error("채팅 내역 Slice 조회 충 에러 발생: [}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("채팅 내역 Slice 조회 중 예상치 못한 에러 발생", e);
            throw new ChatException(ErrorCode.CHAT_NOT_FOUND);
        }
    }

    /**
     * 주어진 계약서 목록으로부터 채팅방 목록 생성
     */
    private List<ChatRoomResponse> createChatRoomsFromForms(List<FormEntity> forms, Integer userId, boolean isCompleted) {
        List<ChatRoomResponse> chatRooms = new ArrayList<>();

        for (FormEntity form : forms) {
            // 가장 최근 채팅 메세지 조회
            ChatEntity lastChat = chatRepository.findTopByFormOrderByCreatedAtDesc(form)
                    .orElse(null);

            // 안 읽은 메세지 수 조회
            Integer unreadCount = chatRepository.countByFormAndIsReadFalseAndWriterIdNot(form, userId);

            ChatRoomResponse room = ChatRoomResponse.builder()
                    .formId(form.getId())
                    .creditorId(form.getCreditor().getId())
                    .creditorName(form.getCreditorName())
                    .debtorId(form.getDebtor().getId())
                    .debtorName(form.getDebtorName())
                    .lastMessage(lastChat != null ? lastChat.getContent() : "")
                    .lastMessageTime(lastChat != null ? lastChat.getCreatedAt() : null)
                    .unreadCount(unreadCount)
                    .isCompleted(isCompleted)
                    .build();

            chatRooms.add(room);
        }
        return chatRooms;
    }

    /**
     * 채팅방 목록을 최신 메세지 시간 순으로 정렬
     */
    private  void sortChatRoomsByLastMessageTime(List<ChatRoomResponse> chatRooms) {
        chatRooms.sort((a, b) -> {
            if (a.getLastMessageTime() == null) return 1;
            if (b.getLastMessageTime() == null) return -1;
            return b.getLastMessageTime().compareTo(a.getLastMessageTime()); // 내림차순 정렬
        });
    }

    /**
     * 목록에서 페이지 기반 Slice 생성
     */
    private <T> Slice<T> createSliceFromList(List<T> list, int page, int size) {
        int start = page * size;
        int end = Math.min(start + size, list.size());

        // 범위 검사
        if (start >= list.size()) {
            return new SliceImpl<>(Collections.emptyList(), PageRequest.of(page, size), false);
        }

        List<T> pageContent = list.subList(start, end);
        boolean hasNext = end < list.size();

        return new SliceImpl<>(pageContent, PageRequest.of(page, size), hasNext);
    }

    /**
     * 메세지 읽음 상태 표시
     */
    @Transactional
    public void markAsRead(Integer formId, Integer userId) {
        try {
            // 계약 조회
            FormEntity form = formService.selectById(formId);

            // 사용자가 해당 계약의 채권자나 채무자인지 조회
            if (!isParticipantInForm(form, userId)) {
                throw new ChatException(ErrorCode.CHAT_ROOM_ACCESS_DENIED);
            }

            // 자신이 보내지 않은 메세지만 읽음 처리
            chatRepository.markAsReadByFormAndWriterIdNot(form.getId(), userId);
        } catch (ChatException e) {
            log.error("메세지 읽음 처리 중 에러 발생: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("메세지 읽음 처리 중 예상치 못한 에러 발생", e);
            throw new ChatException(ErrorCode.CHAT_NOT_FOUND);
        }
    }

    /**
     * 사용자가 해당 계약의 참여자인지 확인
     */
    private boolean isParticipantInForm(FormEntity form, Integer userId) {
        return form.getCreditor().getId().equals(userId) || form.getDebtor().getId().equals(userId);
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
                .build();
    }

}
