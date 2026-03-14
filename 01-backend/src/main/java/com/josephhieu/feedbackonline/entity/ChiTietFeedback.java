package com.josephhieu.feedbackonline.entity;

import com.josephhieu.feedbackonline.entity.id.ChiTietFeedbackId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"CHITIETFEEDBACK\"")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ChiTietFeedback {

    @EmbeddedId
    private ChiTietFeedbackId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("maFeedback")
    @JoinColumn(name = "\"MaFeedback\"")
    private Feedback feedback;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("maCauHoi")
    @JoinColumn(name = "\"MaCauHoi\"")
    private CauHoi cauHoi;

    @Column(name = "\"Diem\"")
    private Integer diem;

    @Column(name = "\"GhiChu\"")
    private String ghiChu;
}