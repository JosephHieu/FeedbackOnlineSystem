package com.josephhieu.feedbackonline.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "\"CAUHOI\"")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CauHoi extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "\"MaCauHoi\"", updatable = false, nullable = false)
    private UUID maCauHoi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"MaTemplate\"")
    private Template template;

    @Column(name = "\"TenCauHoi\"", nullable = false, columnDefinition = "TEXT")
    private String tenCauHoi;

    @Column(name = "\"DiemToiThieu\"")
    private Integer diemToiThieu;

    @Column(name = "\"DiemToiDa\"")
    private Integer diemToiDa;
}