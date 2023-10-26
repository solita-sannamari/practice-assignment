package com.discussion.forum.restcontroller;

import java.util.List;

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

    @GetMapping("/topics/{id}/messages")
    List<MessageStatistics> findByTopicId(@PathVariable int id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        
        if (principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        } 
        return messageRepository.getMessagesByTopicId(id, userRepository.findByUsername(username).getId());
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/topics/{id}/messages")
    Message createNew(@RequestBody Message newMessage) {
        return messageRepository.save(newMessage);
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
