package com.intech.dukaantech.common.exception;

public class CategoryAlreadyExistsException extends RuntimeException {

    public CategoryAlreadyExistsException(String message){
        super(message);
    }
}