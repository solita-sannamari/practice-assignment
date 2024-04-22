package com.discussion.forum.restcontroller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    TopicRepository topicRepository;

    @Autowired
    UserRepository userRepository;

    String[] bannedWords = {
                            "ass",
                            "asshole",
                            "bastard",
                            "bitch",
                            "bloody",
                            "bollocks",
                            "bugger",
                            "bullshit",
                            "cock",
                            "crap",
                            "cunt",
                            "damn",
                            "dick",
                            "fuck",
                            "hell",
                            "nigga",
                            "piss",
                            "prick",
                            "pussy",
                            "shit",
                            "slut",
                            "spastic",
                            "turd",
                            "twat",
                            "wanker"
    };
    String replacement = "*";

    @GetMapping("/api/topics/{id}/messages")
    public ResponseEntity<List<MessageStatistics>> findByTopicId(@PathVariable int id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;

        if (principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        } 

        Optional<Topic> topic = topicRepository.findById(id);
        if (topic.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            List<MessageStatistics> messages = messageRepository.getMessagesByTopicId(id, userRepository.findByUsername(username).getId());
            for (MessageStatistics message : messages) {
                String maskedMessage = message.getMessage().getMessage();
                
                for (String bannedWord : bannedWords) {
                    maskedMessage = maskedMessage.replaceAll("(?i)\\b" + bannedWord + "\\b", replacement);
                }
                
                message.getMessage().setMessage(maskedMessage);
            }
            return ResponseEntity.status(HttpStatus.OK).body(messages);
        }
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/api/topics/{id}/messages")
    ResponseEntity<Object> createNew(@RequestBody Message newMessage, @PathVariable int id) {

        Optional<Topic> topic = topicRepository.findById(id);
        if (topic.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            messageRepository.save(newMessage);
            String maskedMessage = newMessage.getMessage();
                
                for (String bannedWord : bannedWords) {
                    maskedMessage = maskedMessage.replaceAll("(?i)\\b" + bannedWord + "\\b", replacement);
                }
                
            newMessage.setMessage(maskedMessage);
    
            return ResponseEntity.status(HttpStatus.CREATED).body(newMessage);
        }
    }

    @PutMapping("/api/topics/{id}/messages/{msg_id}")
    public ResponseEntity<Message> updateMessage(@PathVariable int id,@PathVariable int msg_id,@RequestBody Message message) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails)principal).getUsername();

        if (message.getUser().getUsername().equals(username)) {
            System.out.println("User authorized to modify message");
            
            Message updateMessage = messageRepository.getReferenceById(msg_id);
            updateMessage.setMessage(message.getMessage());
            return ResponseEntity.ok(messageRepository.save(updateMessage));
        } else {
            System.out.println("User not authorized to modify message");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}
