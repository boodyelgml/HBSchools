package com.ask.basic.infrastructure.exceptions;

import org.springframework.http.HttpStatus;

public abstract class BaseCustomException extends RuntimeException {

    protected BaseCustomException(String message) {
        super(message);
    }

    protected BaseCustomException(String message, Throwable cause) {
        super(message, cause);
    }

    public abstract HttpStatus getStatusCode();
}
