package com.hb.school.infrastructure.exceptions;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class ErrorMessageModel {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
}

