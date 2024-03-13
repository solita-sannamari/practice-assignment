package com.discussion.forum;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;


@AutoConfigureMockMvc
@SpringBootTest(classes = ForumApplication.class, webEnvironment = WebEnvironment.MOCK)
@WithMockUser(username = "sannamari", password = "dhakjs", roles = {"admin"})
public class GreetingTest {

    @Autowired
    private MockMvc mockmvc;

    @Test
    public void greetingShouldReturnDefaultValue() throws Exception {
        mockmvc.perform(MockMvcRequestBuilders
                        .get("/greeting")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content").value("Hello, World!"));
    }

    @Test
    public void greetingShouldReturnCustomValue() throws Exception {
        mockmvc.perform(MockMvcRequestBuilders
                        .get("/greeting?name=sannamari")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content").value("Hello, sannamari!"));   
    }
}
