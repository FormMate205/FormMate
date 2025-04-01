package com.corp.formmate.chat.repository;

import com.corp.formmate.chat.entity.ChatEntity;
import com.corp.formmate.form.entity.FormEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<ChatEntity, Integer> {

    // 특정 계약의 삭제되지 않은 채팅 조회
    List<ChatEntity> findByFormAndIsDeletedFalse(FormEntity form, Sort sort);

    // 특정 계약의 삭제되지 않은 채팅 Slice 조회
    Slice<ChatEntity> findByFormAndIsDeletedFalse(FormEntity form, Pageable pageable);

    // 특정 계약의 가장 최근 채팅 메세지 조회
    Optional<ChatEntity> findTopByFormOrderByCreatedAtDesc(FormEntity form);

    // 특정 계약의 특정 사용자가 보내지 않은 읽지 않은 메세지 수 계산
    Integer countByFormAndIsReadFalseAndWriterIdNot(FormEntity form, Integer userId);

    // 특정 계약에서 특정 사용자가 보내지 않은 모든 메세지를 읽음 상태로 변경
    @Modifying
    @Query("UPDATE ChatEntity c SET c.isRead = true WHERE c.form.id = :formId AND c.writer.id != :userId AND c.isRead = false")
    void markAsReadByFormAndWriterIdNot(@Param("formId") Integer formId, @Param("userId") Integer userId);

    // 특정 계약의 모든 채팅 메세지 수 계산
    Long countByForm(FormEntity form);

    // 사용자가 참여하고 있는 모든 계약의 안읽은 메세지 수 계산
    @Query("SELECT COUNT(c) FROM ChatEntity c WHERE (c.form.creditor.id = :userId OR c.form.debtor.id = :userId) AND c.writer.id != :userId AND c.isRead = false")
    Integer countAllUnreadMessagesForUser(@Param("userId") Integer userId);

    // 사용자가 채권자 또는 채무자인 모든 폼 목록을 조회
    @Query("SELECT c.form FROM ChatEntity c WHERE c.form.creditor.id = :userId OR c.form.debtor.id = :userId GROUP BY c.form.id")
    List<FormEntity> findFormsByUserParticipation(@Param("userId") Integer userId);
}
