package com.ask.basic.infrastructure.exceptions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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