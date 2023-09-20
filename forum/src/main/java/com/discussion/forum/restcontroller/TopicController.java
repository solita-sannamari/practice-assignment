package com.discussion.forum.restcontroller;

import java.rmi.ServerException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TopicController {

    @Autowired
    TopicRepository topicRepository;

    @GetMapping("/topics")
    List<Topic> all() {
        return topicRepository.findAll();
    }

    @PostMapping("/topics")
    Topic createNew(@RequestBody Topic newTopic) {
        return topicRepository.save(newTopic);
    }

    }
