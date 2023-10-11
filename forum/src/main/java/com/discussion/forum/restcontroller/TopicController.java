package com.discussion.forum.restcontroller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TopicController {

    @Autowired
    TopicRepository topicRepository;

    @GetMapping("/topics")
    List<Topic> all() {
        return topicRepository.findAll();
    }

    @GetMapping("/topics/{id}")
    Optional<Topic> getById(@PathVariable int id) {
        return topicRepository.findById(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/topics")
    Topic createNew(@RequestBody Topic newTopic) {
        return topicRepository.save(newTopic);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/topics/{id}")
    public void deleteById(@PathVariable int id) {
        topicRepository.deleteById(id);
    }

    }
