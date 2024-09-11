package com.hb.school.auth.data;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;


import java.util.List;

@Data
public class AttachRolesToUserRequest {

    Long userId;
    @NotEmpty
    @Size(min = 1, max = 10)
    List<Long> rolesList;
}
