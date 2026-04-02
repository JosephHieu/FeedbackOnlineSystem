package com.josephhieu.feedbackonline.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "FEEDBACK")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Feedback extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MaFeedback", updatable = false, nullable = false)
    private UUID maFeedback;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaLop")
    private Lop lop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaTemplate")
    private Template template;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaHocVien")
    private HocVien hocVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaTopic")
    private Topic topic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaTrainer")
    private Trainer trainer;

    @OneToMany(mappedBy = "feedback", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietFeedback> chiTietFeedbacks;
}