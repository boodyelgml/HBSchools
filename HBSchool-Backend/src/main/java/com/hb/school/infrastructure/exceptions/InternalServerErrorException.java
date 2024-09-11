package com.hb.school.infrastructure.exceptions;

import org.springframework.http.HttpStatus;

public class InternalServerErrorException extends BaseCustomException{

    public InternalServerErrorException(String message) {
        super(message);
    }

    public InternalServerErrorException(String message, Throwable cause) {
        super(message, cause);
    }

    @Override
    public HttpStatus getStatusCode() {
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
