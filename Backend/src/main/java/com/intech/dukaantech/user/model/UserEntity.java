package com.intech.dukaantech.user.model;

import com.intech.dukaantech.user.enums.Role;
import jakarta.persistence.*;
<<<<<<< HEAD
=======
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
>>>>>>> user-manage
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "tbl_users")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String userId;

<<<<<<< HEAD
=======
    @Column(unique = true)
>>>>>>> user-manage
    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @CreationTimestamp
<<<<<<< HEAD
    @Column(updatable = false)
=======
>>>>>>> user-manage
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updatedAt;
<<<<<<< HEAD

}
=======
}
>>>>>>> user-manage
