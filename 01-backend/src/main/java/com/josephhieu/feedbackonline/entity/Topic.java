package com.josephhieu.feedbackonline.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "\"TOPIC\"")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Topic extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "\"MaTopic\"", updatable = false, nullable = false)
    private UUID maTopic;

    @Column(name = "\"TenTopic\"", nullable = false)
    private String tenTopic;

    @Column(name = "\"Status\"")
    private Boolean status = true;
}