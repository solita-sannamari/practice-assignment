package com.discussion.forum.restcontroller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    UserRepository userRepository;

    @GetMapping("/users/id/{id}")
    Optional<User> findById(@PathVariable int id) {
        return userRepository.findById(id);
    }

    @GetMapping("/users/username/{username}")
    User findByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username);
    }

    @GetMapping("/users")
    List<User> all() {
        return userRepository.findAll();
    }

    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestBody LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(new 
        UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new ResponseEntity<>("User login successful", HttpStatus.OK);
    }
}



/*
@RestController
public class UserController {



    @PostMapping("/login")
    public ResponseEntity<User> getUsername(@RequestParam String username) {
        System.out.println(' ');
        System.out.println(' ');
        System.out.println("Find username from userRepository (User)");
        System.out.println(' ');
        System.out.println(' ');
        User user = userRepository.findByUsername(username);
        if(user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } 
        return new ResponseEntity<User>(user, HttpStatus.OK);
    }
    
}
*/
