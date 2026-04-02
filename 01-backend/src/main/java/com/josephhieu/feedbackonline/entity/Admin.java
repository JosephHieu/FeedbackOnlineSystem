package com.josephhieu.feedbackonline.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "ADMIN")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin extends BaseEntity {

    @Id
    @Column(name = "Username", length = 50)
    private String username;

    @Column(name = "Password", nullable = false)
    private String password;
}