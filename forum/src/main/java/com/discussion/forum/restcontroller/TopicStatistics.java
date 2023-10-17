package com.discussion.forum.restcontroller;

import java.io.Serializable;
import java.time.LocalDateTime;

public class TopicStatistics implements Serializable {
    private LocalDateTime latestMsgTime;
    private Long msgCount;
    private Topic topic;

    public TopicStatistics(LocalDateTime latestMsgTime, Long msgCount, Topic topic) {
        this.latestMsgTime = latestMsgTime;
        this.msgCount = msgCount;
        this.topic = topic;
    }

    protected TopicStatistics() {}

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }

    public Long getMsgCount() {
        return msgCount;
    }

    public void setMsgCount(Long msgCount) {
        this.msgCount = msgCount;
    }

    public LocalDateTime getLatestMsgTime() {
        return latestMsgTime;
    }

    public void setLatestMsgTime(LocalDateTime latestMsgTime) {
        this.latestMsgTime = latestMsgTime;
    }


}
