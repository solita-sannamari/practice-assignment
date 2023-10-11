package com.discussion.forum.restcontroller;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    List<Message> findByTopicIdOrderByTimestamp(int id);
    
}
