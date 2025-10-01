package com.ask.basic.auth.data;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttachRolesToUserRequest {

    Long userId;
    @NotEmpty
    @Size(min = 1, max = 10)
    List<Long> rolesList;
}
