package com.yaki.cloudshareapp.document;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Document(collection = "profiles")
public class ProfileDocument {
    @Id
    private String id;

    @NotNull
    private String clerkId;

    @NotNull
    @Indexed(unique = true)
    private String email;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;
    @Builder.Default
    private Integer credits = 5;

    @NotNull
    private String photoUrl;

    @NotNull
    @CreatedDate
    private Instant createdAt;
}
