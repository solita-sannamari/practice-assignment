package com.discussion.forum.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UpvoteController {

    @Autowired
    UpvoteRepository upvoteRepository;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/upvotes")
    Upvote createNew(@RequestBody Upvote newUpvote) {
        return upvoteRepository.save(newUpvote);
    }

}
