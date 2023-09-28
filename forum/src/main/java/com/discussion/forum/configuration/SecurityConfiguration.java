package com.discussion.forum.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
           .cors(cors -> cors.disable())
            .authorizeHttpRequests((requests) -> 
                requests
                    .requestMatchers("/login").permitAll()
                    .anyRequest().permitAll())
                    .formLogin(s -> s
                                .loginPage("http://localhost:5173/")
                            .loginProcessingUrl("/login")
                                .defaultSuccessUrl("http://localhost:5173/")
                                .permitAll());
                            System.out.println("hdjasfhaidhf");
        return http.build();
    }


}
