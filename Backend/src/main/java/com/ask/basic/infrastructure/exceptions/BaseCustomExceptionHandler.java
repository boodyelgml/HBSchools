package com.ask.basic.infrastructure.exceptions;

import com.ask.basic.infrastructure.response.ApiResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
@Log4j2
public class BaseCustomExceptionHandler extends ResponseEntityExceptionHandler {

    // Handle custom business exceptions
    @ExceptionHandler(BaseCustomException.class)
    public ResponseEntity<ApiResponse<Object>> handleBaseCustomException(BaseCustomException ex, WebRequest request) {
        log.error("BaseCustomException: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        ApiResponse<Object> response = ApiResponse.error(ex.getMessage(), "BUSINESS_ERROR", path);
        return new ResponseEntity<>(response, ex.getStatusCode());
    }

    // Handle not found exceptions
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFoundException(NotFoundException ex, WebRequest request) {
        log.error("NotFoundException: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        ApiResponse<Object> response = ApiResponse.error(ex.getMessage(), "NOT_FOUND", path);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // Handle duplicate resource exceptions
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Object>> handleDuplicateResourceException(DuplicateResourceException ex, WebRequest request) {
        log.error("DuplicateResourceException: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        ApiResponse<Object> response = ApiResponse.error(ex.getMessage(), "DUPLICATE_RESOURCE", path);
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    // Handle validation exceptions
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(ValidationException ex, WebRequest request) {
        log.error("ValidationException: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        ApiResponse<Object> response = ApiResponse.error(ex.getMessage(), ex.getErrorCode(), path);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Handle unauthorized exceptions
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Object>> handleUnauthorizedException(UnauthorizedException ex, WebRequest request) {
        log.error("UnauthorizedException: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        ApiResponse<Object> response = ApiResponse.error(ex.getMessage(), ex.getErrorCode(), path);
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    // Handle authentication exceptions
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        log.error("AuthenticationException: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        ApiResponse<Object> response = ApiResponse.error("Authentication failed", "AUTHENTICATION_ERROR", path);
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    // Handle access denied exceptions
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        log.error("AccessDeniedException: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        ApiResponse<Object> response = ApiResponse.error("Access denied", "ACCESS_DENIED", path);
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    // Handle illegal argument exceptions
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        log.error("IllegalArgumentException: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        ApiResponse<Object> response = ApiResponse.error(ex.getMessage(), "INVALID_ARGUMENT", path);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Handle request validation exceptions
    @ExceptionHandler(RequestValidationException.class)
    public ResponseEntity<ApiResponse<Object>> handleRequestValidationException(RequestValidationException ex, WebRequest request) {
        log.error("RequestValidationException: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        ApiResponse<Object> response = ApiResponse.error(ex.getMessage(), "REQUEST_VALIDATION_ERROR", path);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Handle general rule platform exceptions
    @ExceptionHandler(GeneralRulePlatformException.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneralRulePlatformException(GeneralRulePlatformException ex, WebRequest request) {
        log.error("GeneralRulePlatformException: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        ApiResponse<Object> response = ApiResponse.error(ex.getMessage(), "GENERAL_RULE_ERROR", path);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Handle internal server error exceptions
    @ExceptionHandler(InternalServerErrorException.class)
    public ResponseEntity<ApiResponse<Object>> handleInternalServerErrorException(InternalServerErrorException ex, WebRequest request) {
        log.error("InternalServerErrorException: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        ApiResponse<Object> response = ApiResponse.error(ex.getMessage(), "INTERNAL_SERVER_ERROR", path);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Handle method argument validation errors
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        log.error("MethodArgumentNotValidException: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        List<String> errorMessages = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());

        String message = String.join(", ", errorMessages);
        ApiResponse<Object> response = ApiResponse.error(message, "VALIDATION_ERROR", path);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Handle all other unexpected exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex, WebRequest request) {
        log.error("Unexpected exception: {}", ex.getMessage(), ex);
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();

        ApiResponse<Object> response = ApiResponse.error("An unexpected error occurred", "INTERNAL_ERROR", path);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}