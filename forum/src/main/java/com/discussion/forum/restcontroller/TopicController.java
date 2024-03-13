package com.discussion.forum.restcontroller;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TopicController {

    @Autowired
    TopicRepository topicRepository;
    
    @GetMapping("/topics")
    List<TopicStatistics> all() {
        return topicRepository.getTopics();
    }
    
    @GetMapping("/topics/{id}")
    public ResponseEntity<Optional<Topic>> getById(@PathVariable int id) {
        
        Optional<Topic> topic = topicRepository.findById(id);
        if (topic.isEmpty()) {
            System.out.println("Topic id not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(topic);
        }
    }
          
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/topics")
    Topic createNew(@RequestBody Topic newTopic) {
        return topicRepository.save(newTopic);
    }
    
    @DeleteMapping("/topics/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable int id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails)principal).getUsername();
        
        Collection<? extends GrantedAuthority> authorities = ((UserDetails)principal).getAuthorities();
        String authority = new String();
        for (GrantedAuthority a : authorities) {
            authority = a.getAuthority();
        }
        
        Optional<Topic> topic = topicRepository.findById(id);

        if (topic.isPresent()) {
            if(topic.get().getUser().getUsername().equals(username) || authority.equals("admin")) {
                topicRepository.deleteById(id);
                return ResponseEntity.status(HttpStatus.I_AM_A_TEAPOT).build();
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        

    }
    
    @PutMapping("topics/{id}")
    public ResponseEntity<Topic> updateTopic(@PathVariable int id, @RequestBody Topic topic) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails)principal).getUsername();

        Collection<? extends GrantedAuthority> authorities = ((UserDetails)principal).getAuthorities();
        String authority = new String();
        for (GrantedAuthority a : authorities) {
            authority = a.getAuthority();
        }

        if (topic.getUser().getUsername().equals(username) || authority.equals("admin")) {
            System.out.println("User authorized to modify topic");
            Topic updateTopic = topicRepository.getReferenceById(id);
            updateTopic.setName(topic.getName());
            return ResponseEntity.ok(topicRepository.save(updateTopic));
        } else {
            System.out.println("User not authorized to modify topic");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}
