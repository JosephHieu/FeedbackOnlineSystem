package com.josephhieu.feedbackonline.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "\"TRAINER\"")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Trainer extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "\"MaTrainer\"", updatable = false, nullable = false)
    private UUID maTrainer;

    @Column(name = "\"Account\"", nullable = false, unique = true)
    private String account;

    @Column(name = "\"TenTrainer\"", nullable = false)
    private String tenTrainer;

    @Column(name = "\"Status\"")
    private Boolean status = true;
}