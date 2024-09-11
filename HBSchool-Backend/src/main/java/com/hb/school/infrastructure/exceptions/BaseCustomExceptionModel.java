package com.hb.school.infrastructure.exceptions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;

@Data
public class BaseCustomExceptionModel {

    private HttpStatus status;
    private String messages;
    private LocalDate timeStamp;

    @JsonIgnore
    private String uri;


    public BaseCustomExceptionModel(String uri, HttpStatus status, String messages) {
        this.timeStamp = LocalDate.now();
        this.uri = uri;
        this.status = status;
        this.messages = messages;
    }

}