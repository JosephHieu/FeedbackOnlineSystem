package com.josephhieu.feedbackonline.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "HOCVIEN")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class HocVien extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MaHocVien", updatable = false, nullable = false)
    private UUID maHocVien;

    @Column(name = "Username", unique = true, nullable = false)
    private String username;

    @Column(name = "TenHocVien", nullable = false)
    private String tenHocVien;

    @Column(name = "Password", nullable = false)
    private String password;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaLop")
    private Lop lop;

    @Column(name = "Status", nullable = false)
    private Boolean status = true;
}