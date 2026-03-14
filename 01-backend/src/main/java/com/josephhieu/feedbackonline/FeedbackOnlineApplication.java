package com.josephhieu.feedbackonline;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FeedbackOnlineApplication {

    public static void main(String[] args) {
        SpringApplication.run(FeedbackOnlineApplication.class, args);
    }

}
