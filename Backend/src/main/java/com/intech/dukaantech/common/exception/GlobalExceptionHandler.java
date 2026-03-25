package com.intech.dukaantech.common.exception;

import com.intech.dukaantech.common.exception.ApiErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // helper method to generate to create ApiErrorResponse
    private ResponseEntity<ApiErrorResponse> buildErrorResponse(
            String message, HttpStatus status) {

        Map<String, String> errors = new HashMap<>();
        errors.put("message", message);

        ApiErrorResponse response = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .errors(errors)
                .build();

        return new ResponseEntity<>(response, status);
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiException(ApiException ex){

        log.warn("Application error: {}", ex.getMessage());

        return buildErrorResponse(ex.getMessage(), ex.getStatus());
    }

    // handle fields validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {

        log.error("Validation failed", ex);

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return buildErrorResponse(errors.toString(), HttpStatus.BAD_REQUEST);
    }
}

