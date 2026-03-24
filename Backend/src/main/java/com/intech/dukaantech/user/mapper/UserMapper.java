package com.intech.dukaantech.user.mapper;

import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;
import com.intech.dukaantech.user.model.UserEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public UserEntity toEntity(UserRequest request){

        return modelMapper.map(request, UserEntity.class);
    }

    public UserResponse toResponse(UserEntity entity){
        return modelMapper.map(entity, UserResponse.class);
    }
}
