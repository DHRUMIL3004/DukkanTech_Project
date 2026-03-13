package com.intech.dukaantech.common.exception;

import com.intech.dukaantech.common.exception.custom.CategoryAlreadyExistsException;
import com.intech.dukaantech.common.exception.custom.CategoryNotFoundException;
import com.intech.dukaantech.common.exception.custom.UserAlreadyExistsException;
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

    // handle errors when username or email already exists
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleUserAlreadyExists(
            UserAlreadyExistsException ex){

        log.warn("User creation failed: {}", ex.getMessage());

        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
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

    // Category already exists
    @ExceptionHandler(CategoryAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleCategoryAlreadyExists(
            CategoryAlreadyExistsException ex){

        log.warn("Category creation failed: {}", ex.getMessage());

        Map<String, String> errors = Map.of("message", ex.getMessage());

        return buildErrorResponse(errors.toString(), HttpStatus.BAD_REQUEST);
    }

    // Category not found
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleCategoryNotFound(
            CategoryNotFoundException ex){

        log.warn("Category not found: {}", ex.getMessage());

        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}