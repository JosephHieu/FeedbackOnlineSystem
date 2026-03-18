package com.josephhieu.feedbackonline.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import java.util.List;

@Entity
@Table(name = "\"TEMPLATE\"")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Template extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "\"MaTemplate\"", updatable = false, nullable = false)
    private UUID maTemplate;

    @Column(name = "\"TenTemplate\"", nullable = false)
    private String tenTemplate;

    @Column(name = "\"Status\"")
    private Boolean status = true;

    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CauHoi> danhSachCauHoi;
}