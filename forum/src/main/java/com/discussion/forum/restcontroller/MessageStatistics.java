package com.discussion.forum.restcontroller;

import java.io.Serializable;

public class MessageStatistics implements Serializable {
    private Long upvoteCount;
    private Message message;
    private boolean is_liked;

    public MessageStatistics(Long upvoteCount, Message message, boolean is_liked){
        this.upvoteCount = upvoteCount;
        this.message = message;
        this.is_liked = is_liked;
    }

    protected MessageStatistics() {}

    public Message getMessage() {
        return message;
    }

    public void setMessage(Message message) {
        this.message = message;
    }

    public Long getUpvoteCount() {
        return upvoteCount;
    }

    public void setUpvoteCount(Long upvoteCount) {
        this.upvoteCount = upvoteCount;
    }

    public boolean getIsLiked() {
        return is_liked;
    }

    public void setIsLiked(boolean is_liked) {
        this.is_liked = is_liked;
    }
}
