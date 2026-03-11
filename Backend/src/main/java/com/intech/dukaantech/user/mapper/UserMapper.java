package com.intech.dukaantech.user.mapper;

import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;
import com.intech.dukaantech.user.model.UserEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final ModelMapper modelMapper;

    public UserEntity mapToEntity(UserRequest request){
        return modelMapper.map(request, UserEntity.class);
    }

    public UserResponse mapToResponse(UserEntity entity){
        return modelMapper.map(entity, UserResponse.class);
    }
}