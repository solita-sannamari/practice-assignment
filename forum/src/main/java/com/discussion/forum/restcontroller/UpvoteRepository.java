package com.discussion.forum.restcontroller;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UpvoteRepository extends JpaRepository<Upvote, Integer> {
    
}
