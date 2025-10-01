package com.ask.basic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

import com.ask.basic.auth.domain.User;
import com.ask.basic.auth.domain.UserRepository;

@SpringBootApplication
public class SchoolApplication {
    public static void main(String[] args) {
        SpringApplication.run(SchoolApplication.class, args);
    }

    @EventListener(ContextRefreshedEvent.class)
    public void insertDefaultUserAfterDbInit(ContextRefreshedEvent event) {
        UserRepository userRepository = event.getApplicationContext().getBean(UserRepository.class);
        org.springframework.security.crypto.password.PasswordEncoder passwordEncoder = event.getApplicationContext().getBean(org.springframework.security.crypto.password.PasswordEncoder.class);
        String email = "admin@demo.com";
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = User.builder()
                    .firstName("abdelrahman")
                    .lastName("fathy")
                    .email(email)
                    .password(passwordEncoder.encode("12345678"))
                    .isActive(true)
                    .createdAt(java.time.LocalDateTime.now())
                    .updatedAt(java.time.LocalDateTime.now())
                    .build();
            userRepository.save(user);
        }
    }
}
