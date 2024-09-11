package com.hb.school.infrastructure.exceptions;

import org.springframework.http.HttpStatus;

public class GeneralRulePlatformException extends BaseCustomException {

    public GeneralRulePlatformException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatusCode() {
        return HttpStatus.BAD_REQUEST;
    }


}
