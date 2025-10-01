package com.ask.basic.auth.data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    @NotNull
    private Long id;
    private String title;
    private String firstName;
    private String middleName;
    private String lastName;
    private String displayName;
    private LocalDateTime dateOfBirth;
    private String maritalStatus;
    private String firstAddress;
    private String secondAddress;
    private String postalCode;
    private String mobileNumber;
    private String workNumber;
    private String homeNumber;
    private String username;
    @Email
    private String email;
    private Boolean isActive;
}
