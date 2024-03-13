package com.discussion.forum;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.bind.annotation.PathVariable;

import com.discussion.forum.restcontroller.Topic;
import com.discussion.forum.restcontroller.TopicRepository;
import com.discussion.forum.restcontroller.TopicStatistics;
import com.discussion.forum.restcontroller.User;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@AutoConfigureMockMvc
@SpringBootTest(classes = ForumApplication.class, webEnvironment = WebEnvironment.MOCK)
@WithMockUser(username = "sannamari", password = "dhakjs", roles = {"admin"})
@ExtendWith(MockitoExtension.class)
public class TopicTest {
    @Autowired
    private MockMvc mockmvc;
    
    @MockBean
    private TopicRepository topicRepository;

    @TestConfiguration
    static class TopicTestConfiguration {
        @Mock
        TopicRepository topicRepository;
    }
    
    @BeforeEach
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void topicsShouldReturnListOfTopics() throws Exception {
        ArrayList<TopicStatistics> topics = new ArrayList<TopicStatistics>();
        TopicStatistics topic = new TopicStatistics(LocalDateTime.now(), 0l, null);
        topics.add(topic);

        Mockito.when(topicRepository.getTopics()).thenReturn(topics);
        MvcResult result = mockmvc.perform(MockMvcRequestBuilders
                        .get("/topics")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("[{}]"))
                .andReturn();
        
        String content = result.getResponse().getContentAsString();
        System.out.println(content);
    }

    @Test
    public void returnTopicWithId() throws Exception {

        Topic expectedTopic = new Topic("Test topic");
        Integer topicId = 1;
        expectedTopic.setId(topicId);

        Mockito.when(topicRepository.findById(topicId)).thenReturn(Optional.of(expectedTopic));
        mockmvc.perform(MockMvcRequestBuilders
                        .get("/topics/{id}", topicId))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(topicId))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Test topic"));
    }

    @Test
    public void findTopicByIdNotFound() throws Exception {

        Integer topicId = 1000;

        Mockito.when(topicRepository.findById(topicId)).thenReturn(Optional.empty());

        mockmvc.perform(MockMvcRequestBuilders
                        .get("/topics/{id}", topicId))
                    .andExpect(MockMvcResultMatchers.status().isNotFound())
                    .andReturn();
    }
    @SuppressWarnings("null")
    @Test
    public void createNewTopic () throws Exception {

        Topic newTopic = new Topic("New topic");
        Topic newTopic2 = new Topic("New topic");
        User user = new User("username", "123", "user");
        newTopic.setUser(user);
        Mockito.when(topicRepository.save(Mockito.argThat(s -> s.getName().equals(newTopic.getName())))).thenReturn(newTopic);

        ObjectMapper mapper = new ObjectMapper();
        System.out.println(mapper.writeValueAsString(newTopic));

        MvcResult result = mockmvc.perform(MockMvcRequestBuilders
                        .post("/topics")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":0,\"name\":\"New topic\",\"user\":{\"id\":0,\"username\":\"username\",\"password\":\"123\",\"role\":\"user\"}}"))
                    .andExpect(MockMvcResultMatchers.status().isCreated())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("New topic"))
                    .andReturn();
        
        String content = result.getResponse().getContentAsString();
        System.out.println(content);
    }

    @Test
    public void deleteTopic () throws Exception {

        Topic expectedTopic = new Topic("Test topic");
        Integer topicId = 1;
        expectedTopic.setId(topicId);
        User user = new User("sannamari", "123", "user");
        expectedTopic.setUser(user);

        Mockito.when(topicRepository.findById(topicId)).thenReturn(Optional.of(expectedTopic));

        Mockito.doNothing().when(topicRepository).deleteById(1);

        mockmvc.perform(MockMvcRequestBuilders
                        .delete("/topics/{id}", 1))
                    .andExpect(MockMvcResultMatchers.status().isIAmATeapot());

    }

}