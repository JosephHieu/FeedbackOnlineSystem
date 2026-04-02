package com.josephhieu.feedbackonline.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "GANTOPIC")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class GanTopic extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MaGanTopic", updatable = false, nullable = false)
    private UUID maGanTopic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaLop")
    private Lop lop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaTrainer")
    private Trainer trainer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaTopic")
    private Topic topic;
}