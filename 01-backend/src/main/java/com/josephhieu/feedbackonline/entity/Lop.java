package com.josephhieu.feedbackonline.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "LOP")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Lop extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MaLop", updatable = false, nullable = false)
    private UUID maLop;

    @Column(name = "TenLop", nullable = false)
    private String tenLop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaTemplate")
    private Template template;

    @Column(name = "Status")
    private Boolean status = true;
}