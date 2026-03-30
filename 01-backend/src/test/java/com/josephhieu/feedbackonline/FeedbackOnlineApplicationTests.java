package com.josephhieu.feedbackonline;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=update",
        "spring.mail.host=localhost"
})
class FeedbackOnlineApplicationTests {

    @Test
    void contextLoads() {
        
    }

}