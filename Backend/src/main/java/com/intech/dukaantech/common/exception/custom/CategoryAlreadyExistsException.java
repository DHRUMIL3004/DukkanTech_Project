package com.intech.dukaantech.common.exception.custom;

public class CategoryAlreadyExistsException extends RuntimeException {

    public CategoryAlreadyExistsException(String message){
        super(message);
    }
}