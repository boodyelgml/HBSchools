package com.ask.basic.auth.data;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


@JsonSerialize
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
@Data
@AllArgsConstructor
public class PermissionDto {
    private Long id;
    private String group;
    private String name;
    private Boolean isActive;
}
