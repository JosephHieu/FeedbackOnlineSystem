package com.josephhieu.feedbackonline.entity.id;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode
public class ChiTietFeedbackId implements Serializable {
    @Column(name = "\"MaFeedback\"")
    private UUID maFeedback;

    @Column(name = "\"MaCauHoi\"")
    private UUID maCauHoi;
}
