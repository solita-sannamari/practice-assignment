package com.discussion.forum.restcontroller;

import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;

import org.apache.commons.lang3.StringUtils;
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

    @GetMapping("/topics/{id}/messages")
    List<MessageStatistics> findByTopicId(@PathVariable int id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;

        
        if (principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        } 
        List<MessageStatistics> messages = messageRepository.getMessagesByTopicId(id, userRepository.findByUsername(username).getId());
        for (MessageStatistics message : messages) {
            String maskedMessage = message.getMessage().getMessage();
            
            for (String bannedWord : bannedWords) {
                maskedMessage = maskedMessage.replaceAll("(?i)\\b" + bannedWord + "\\b", replacement);
            }
            
            message.getMessage().setMessage(maskedMessage);

            /* 
            String.join(" ", Arrays.asList(message.getMessage().getMessage().split(" ")).stream().map(s -> {
                                                            if (Arrays.asList(bannedWords).contains(s)) {
                                                                return replacement;
                                                            } else {
                                                                return s;
                                                            }
                                                        }).toList()); 
            */

            /* 
            for (String bannedWord : bannedWords) {
                ArrayList<String> maskedMessage = new ArrayList<String>();
                for (String word : message.getMessage().getMessage().split("\\s+")) {
                    System.out.println(word);
                    // System.out.println(message.getMessage().getMessage());
                    maskedMessage.add(StringUtils.replaceIgnoreCase(
                                                            word, 
                                                            bannedWord, 
                                                            replacement
                                                        ));
                }
                message.getMessage().setMessage(String.join(" ", maskedMessage));
            } 
            */
        }
        return messages;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/topics/{id}/messages")
    Message createNew(@RequestBody Message newMessage) {
        messageRepository.save(newMessage);
        String maskedMessage = newMessage.getMessage();
            
            for (String bannedWord : bannedWords) {
                maskedMessage = maskedMessage.replaceAll("(?i)\\b" + bannedWord + "\\b", replacement);
            }
            
        newMessage.setMessage(maskedMessage);

        return newMessage;
    }

    @PutMapping("topics/{id}/messages/{msg_id}")
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
