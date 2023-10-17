package com.discussion.forum.restcontroller;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TopicRepository extends JpaRepository<Topic, Integer>{
// select t.*, count(m.*), max(m."timestamp")  
// from topics t left join messages m on t.id = m.topic_id 
// group by t.id 
    @Query("SELECT " + "new com.discussion.forum.restcontroller.TopicStatistics(max(m.timestamp), count(m), t) "
    + "FROM " + "Topic t " + "LEFT JOIN " + "Message m "
    + "ON " + "t.id = m.topic.id "
    + "GROUP BY " + "t.id "
    + "ORDER BY " + "max(m.timestamp) " + "DESC")
    List<TopicStatistics> getTopics();

}
