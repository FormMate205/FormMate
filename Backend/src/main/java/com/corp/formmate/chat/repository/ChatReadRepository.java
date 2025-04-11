package com.corp.formmate.chat.repository;

import com.corp.formmate.chat.entity.ChatEntity;
import com.corp.formmate.chat.entity.ChatReadEntity;
import com.corp.formmate.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatReadRepository extends JpaRepository<ChatReadEntity, Integer> {
    Optional<ChatReadEntity> findByChatAndUser(ChatEntity chat, UserEntity user);
    int countByChat_Form_IdAndUser_IdNot(Integer formId, Integer userId); // 안 읽은 메세지 개수 조회용
    List<ChatReadEntity> findByUser(UserEntity user);
}
