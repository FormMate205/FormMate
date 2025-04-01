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
     * 사용자의 모든 채팅방 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ChatRoomResponse> selectChatRoomsByUserId(Integer userId) {
        try {
            // 사용자가 직접 참여하고 있는 모든 계약 조회
            // 직접 데이터에 접근하는 로직으로 우선 구현
            List<FormEntity> userForms = formService.selectFormsByUserId(userId);

            // 각 계약 별로 채팅방 정보 생성
            return userForms.stream()
                    .map(form -> {
                        // 가장 최근 채팅 메세지 조회
                        ChatEntity lastChat = chatRepository.findTopByFormOrderByCreatedAtDesc(form)
                                .orElse(null);

                        // 안읽은 메세지 수 조회
                        Integer unreadCount = chatRepository.countByFormAndIsReadFalseAndWriterIdNot(form, userId);

                        return ChatRoomResponse.builder()
                                .formId(form.getId())
                                .creditorName(form.getCreditorName())
                                .debtorName(form.getDebtorName())
                                .lastMessage(lastChat != null ? lastChat.getContent() : "")
                                .lastMessageTime(lastChat != null ? lastChat.getCreatedAt() : null)
                                .unreadCount(unreadCount)
                                .build();
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("채팅방 목록 조회 중 에러 발생", e);
            throw new ChatException(ErrorCode.CHAT_NOT_FOUND);
        }
    }

    /**
     * 사용자의 모든 채팅방 목록을 최신 메세지 날짜 순으로 정렬하여 Slice로 조회
     */
    @Transactional(readOnly = true)
    public Slice<ChatRoomResponse> selectChatRoomsSlice(Integer userId, int page, int size) {
        try {
            // 사용자가 참여하고 있는 모든 꼐약 조회
            List<FormEntity> userForms = formService.selectFormsByUserId(userId);

            // 각 계약별로 채팅방 정보 생성
            List<ChatRoomResponse> chatRooms = new ArrayList<>();

            for (FormEntity form : userForms) {
                // 가장 최근 채팅 메세지 조회
                ChatEntity lastChat = chatRepository.findTopByFormOrderByCreatedAtDesc(form)
                        .orElse(null);

                // 안읽은 메세지 수 조회
                Integer unreadCount = chatRepository.countByFormAndIsReadFalseAndWriterIdNot(form, userId);

                ChatRoomResponse room = ChatRoomResponse.builder()
                        .formId(form.getId())
                        .creditorName(form.getCreditorName())
                        .debtorName(form.getDebtorName())
                        .lastMessage(lastChat != null ? lastChat.getContent() : "")
                        .lastMessageTime(lastChat != null ? lastChat.getCreatedAt() : null)
                        .unreadCount(unreadCount)
                        .build();

                chatRooms.add(room);
            }

            // 최신 메세지 시간을 기준으로 정렬 (null 값은 가장 오래된 것으로 처리)
            chatRooms.sort((a, b) -> {
                if (a.getLastMessageTime() == null) return 1;
                if (b.getLastMessageTime() == null) return -1;
                return b.getLastMessageTime().compareTo(a.getLastMessageTime()); // 내림차순 정렬
            });

            // 페이지네이션 처리
            int start = page * size;
            int end = Math.min(start + size, chatRooms.size());

            // 범위 검사
            if (start >= chatRooms.size()) {
                return new SliceImpl<>(Collections.emptyList(),
                        PageRequest.of(page, size), false);
            }

            List<ChatRoomResponse> pageContent = chatRooms.subList(start, end);
            boolean hasNext = end < chatRooms.size();

            return new SliceImpl<>(pageContent, PageRequest.of(page, size), hasNext);

        } catch (Exception e) {
            log.error("채팅방 목록 조회 중 에러 발생", e);
            throw new ChatException(ErrorCode.CHAT_NOT_FOUND);
        }
    }

    /**
     * 사용자의 채팅방 목록을 계약 상태(진행중/종료)에 따라 그룹화하여 조회
     * 각 그룹 내에서는 최신 메세지 날짜 순으로 정렬
     */
    @Transactional(readOnly = true)
    public GroupedChatRoomsResponse selectGroupedChatRooms(Integer userId, int activePage, int completedPage, int size) {
        try {
            // 사용자가 참여하고 있는 모든 폼(계약서) 조회
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

            // 진행 중인 채팅방 목록 생성 및 정렬
            Slice<ChatRoomResponse> activeChatRoomsSlice = createChatRoomsSlice(activeForms, userId, activePage, size);

            // 종료된 채팅방 목록 생성 및 정렬
            Slice<ChatRoomResponse> completedChatRoomsSlice = createChatRoomsSlice(completedForms, userId, completedPage, size);

            // 응답 객체 생성
            return GroupedChatRoomsResponse.builder()
                    .activeChatRooms(ChatRoomSliceResponse.fromSlice(activeChatRoomsSlice))
                    .completedChatRooms(ChatRoomSliceResponse.fromSlice(completedChatRoomsSlice))
                    .build();

        } catch (Exception e) {
            log.error("그룹화된 채팅방 목록 조회 중 에러 발생", e);
            throw new ChatException(ErrorCode.CHAT_NOT_FOUND);
        }
    }

    /**
     * 주어진 계약 목록에서 채팅방 목록 생성, 최신 메세지 날짜 순으로 정렬하여 Slice로 반환
     */
    private Slice<ChatRoomResponse> createChatRoomsSlice(List<FormEntity> forms, Integer userId, Integer page, Integer size) {
        // 각 계약 별로 채팅방 정보 생성
        List<ChatRoomResponse> chatRooms = new ArrayList<>();

        for (FormEntity form : forms) {
            // 가장 최근 채팅 메시지 조회
            ChatEntity lastChat = chatRepository.findTopByFormOrderByCreatedAtDesc(form)
                    .orElse(null);

            // 안 읽은 메시지 수 조회
            Integer unreadCount = chatRepository.countByFormAndIsReadFalseAndWriterIdNot(form, userId);

            // formTitle은 프론트엔드에서 생성할 것임
            ChatRoomResponse room = ChatRoomResponse.builder()
                    .formId(form.getId())
                    .creditorName(form.getCreditor().getUserName())
                    .debtorName(form.getDebtor().getUserName())
                    .lastMessage(lastChat != null ? lastChat.getContent() : "")
                    .lastMessageTime(lastChat != null ? lastChat.getCreatedAt() : null)
                    .unreadCount(unreadCount)
                    .build();

            chatRooms.add(room);
        }

        // 최신 메시지 시간을 기준으로 정렬 (null 값은 가장 오래된 것으로 처리)
        chatRooms.sort((a, b) -> {
            if (a.getLastMessageTime() == null) return 1;
            if (b.getLastMessageTime() == null) return -1;
            return b.getLastMessageTime().compareTo(a.getLastMessageTime()); // 내림차순 정렬
        });

        // 페이지네이션 처리
        int start = page * size;
        int end = Math.min(start + size, chatRooms.size());

        // 범위 검사
        if (start >= chatRooms.size()) {
            return new SliceImpl<>(Collections.emptyList(),
                    PageRequest.of(page, size), false);
        }

        List<ChatRoomResponse> pageContent = chatRooms.subList(start, end);
        boolean hasNext = end < chatRooms.size();

        return new SliceImpl<>(pageContent, PageRequest.of(page, size), hasNext);
    }

    /**
     * 특정 계약의 채팅 내역 조회
     */
    @Transactional(readOnly = true)
    public List<ChatResponse> selectChatsByUserId(Integer formId, Integer userId) {
        try {
            // 계약 조회
            FormEntity form = formService.selectById(formId);

            // 사용자가 해당 계약의 채권자인지 채무자인지 확인
            if (!isParticipantInForm(form, userId)) {
                throw new ChatException(ErrorCode.CHAT_ROOM_ACCESS_DENIED);
            }

            // 채팅 내역 조회 (시간 순으로 정렬)
            List<ChatEntity> chattings = chatRepository.findByFormAndIsDeletedFalse(
                    form,
                    Sort.by(Sort.Direction.ASC, "createdAt")
            );

            // 엔티티를 DTO로 반환
            return chattings.stream()
                    .map(this::createChatResponseFromEntity)
                    .collect(Collectors.toList());

        } catch (ChatException e) {
            log.error("채팅 내역 조회 중 에러 발생: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("채팅 내역 조회 중 예상치 못한 에러 발생", e);
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
                .isCreditorMessage(chatEntity.isCreditorMessage())
                .isDebtorMessage(chatEntity.isDebtorMessage())
                .build();
    }

}
