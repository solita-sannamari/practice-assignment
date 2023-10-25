package com.discussion.forum.restcontroller;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    List<Message> findByTopicIdOrderByTimestamp(int id);

    /*
     * select m.* , count(u.*) as upvotes,
     * exists (select 1 from upvotes u2 where u2.message_id = m.id and u2.user_id = 3) as is_liked
     * from messages m 
     * left join upvotes u 
     * on m.id = u.message_id 
     * where m.topic_id = 202 
     * group by m.id 
     * order by m."timestamp"
     */
    @Query("SELECT new com.discussion.forum.restcontroller.MessageStatistics("
            + "count(u), "
            + "m, "
            + "exists (select 1 from Upvote u2 where u2.message.id = m.id and u2.user.id = :uid)"
        + ") FROM Message m LEFT JOIN Upvote u "
        + "ON m.id = u.message.id "
        + "WHERE m.topic.id = :id "
        + "GROUP BY m.id "
        + "ORDER BY m.timestamp" )
    List<MessageStatistics> getMessagesByTopicId(@Param("id") int id, @Param("uid") int uid);
    
}
