package com.discussion.forum;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.discussion.forum.restcontroller.Message;
import com.discussion.forum.restcontroller.MessageRepository;
import com.discussion.forum.restcontroller.Topic;
import com.discussion.forum.restcontroller.TopicRepository;

@AutoConfigureMockMvc
@SpringBootTest(classes = ForumApplication.class, webEnvironment = WebEnvironment.MOCK)
@WithMockUser(username = "sannamari", password = "dhakjs", roles = {"admin"})
@ExtendWith(MockitoExtension.class)
public class MessageTest {
    @Autowired
    private MockMvc mockmvc;
    
    @MockBean
    private MessageRepository messageRepository;

    @MockBean
    private TopicRepository topicRepository;

    @TestConfiguration
    static class MessageTestConfiguration {
        @Mock
        MessageRepository messageRepository;
        TopicRepository topicRepository;
    }
    
    @BeforeEach
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void maskMessageWhenCreatingNewMessage () throws Exception {

        Topic topic = new Topic("Test topic");
        Integer topicId = 1;
        topic.setId(topicId);

        Mockito.when(topicRepository.findById(topicId)).thenReturn(Optional.of(topic));
        
        Message newMessage = new Message("Hello from hell", LocalDateTime.now());
        Mockito.when(messageRepository.save(newMessage)).thenReturn(newMessage);

        mockmvc.perform(MockMvcRequestBuilders
                        .post("/topics/{id}/messages",topicId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Hello from hell\"}"))
                    .andExpect(MockMvcResultMatchers.status().isCreated())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("Hello from *"));

    }

    @Test
    public void addingMessageToTopicThatDoesntExist () throws Exception {
        
        Integer topicId = 1000;

        Mockito.when(topicRepository.findById(topicId)).thenReturn(Optional.empty());

        Message newMessage = new Message("Hello cat enthusiasts!", LocalDateTime.now());
        Mockito.when(messageRepository.save(newMessage)).thenReturn(newMessage);

        mockmvc.perform(MockMvcRequestBuilders
                        .post("/topics/{id}/messages", topicId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Hello cat enthusiasts!\"}"))
                    .andExpect(MockMvcResultMatchers.status().isNotFound())
                    .andReturn();

    }

    }