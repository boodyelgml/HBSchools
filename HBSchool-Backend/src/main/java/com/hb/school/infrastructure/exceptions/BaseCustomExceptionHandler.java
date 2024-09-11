package com.hb.school.infrastructure.exceptions;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpHeaders;
 import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
@Log4j2
public class BaseCustomExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(BaseCustomException.class)
    public ResponseEntity<BaseCustomExceptionModel> handleExceptions(BaseCustomException ex, WebRequest request) {
        BaseCustomExceptionModel details = new BaseCustomExceptionModel(request.getDescription(false), ex.getStatusCode(), ex.getMessage());
        return new ResponseEntity<>(details, ex.getStatusCode());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        List<String> errorMessages = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());

        ErrorMessageModel errorResponse = new ErrorMessageModel();
        errorResponse.setTimestamp(LocalDateTime.now());
        errorResponse.setStatus(status.value());
        errorResponse.setMessage(String.join(",", errorMessages));
        errorResponse.setPath(((ServletWebRequest) request).getRequest().getRequestURI());

        return ResponseEntity.badRequest().body(errorResponse);
    }
}