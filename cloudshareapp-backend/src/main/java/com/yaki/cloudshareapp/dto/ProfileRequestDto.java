package com.yaki.cloudshareapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileRequestDto {

    @NotBlank(message = "clerkId is required")
    private String clerkId;

    @NotBlank(message = "Email is required !")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Name is required !")
    @Size(max = 100 , message = "The name cannot contain more than 100 characters.")
    private String firstName;

    @NotBlank(message = "Last Name is required")
    private String lastName;

    @NotBlank(message = "photoURL is required")
    private String photoUrl;

}
