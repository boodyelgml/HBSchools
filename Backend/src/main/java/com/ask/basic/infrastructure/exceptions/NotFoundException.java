package com.ask.basic.infrastructure.exceptions;

import org.springframework.http.HttpStatus;

public class NotFoundException extends BaseCustomException {

    public NotFoundException(String entity, Long id) {
        super(entity + " with id : " + id + " not found");
    }

    public NotFoundException(String entity, String name) {
        super(entity + " with name : " + name + " not found");
    }

    @Override
    public HttpStatus getStatusCode() {
        return HttpStatus.NOT_FOUND;
    }
}
