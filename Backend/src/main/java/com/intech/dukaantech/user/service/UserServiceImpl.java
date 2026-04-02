
package com.intech.dukaantech.user.service;

import com.intech.dukaantech.common.exception.custom.DuplicateResourceException;
import com.intech.dukaantech.common.exception.custom.ResourceNotFoundException;
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;
import com.intech.dukaantech.user.mapper.UserMapper;
import com.intech.dukaantech.user.enums.Role;
import com.intech.dukaantech.user.model.UserEntity;
import com.intech.dukaantech.user.repository.UserRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static com.intech.dukaantech.user.model.QUserEntity.userEntity;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final JPAQueryFactory queryFactory;

    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {

        String requestedName = request.getName() == null ? null : request.getName().trim();

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email already exists");
        }

        if (requestedName != null && !requestedName.isBlank() && userRepository.findByNameIgnoreCase(requestedName).isPresent()) {
            throw new DuplicateResourceException("Name already exists");
        }

        UserEntity newUser = userMapper.toEntity(request);

        newUser.setUserId(UUID.randomUUID().toString());
        if (requestedName != null && !requestedName.isBlank()) {
            newUser.setName(requestedName);
        }
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        newUser = userRepository.save(newUser);

        return userMapper.toResponse(newUser);
    }

    @Override
    @Transactional(readOnly = true)
    public String getUserRole(String email) {
        UserEntity getUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

        return getUser.getRole().name();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> readUsers(int page, int size, String search, String roleFilter, String sortBy, String sortDir) {
        BooleanBuilder where = new BooleanBuilder();

        if (search != null && !search.isBlank()) {
            where.and(
                    userEntity.name.containsIgnoreCase(search)
                            .or(userEntity.email.containsIgnoreCase(search))
            );
        }

        if (roleFilter != null && !roleFilter.isBlank() && !"ALL".equalsIgnoreCase(roleFilter)) {
            where.and(userEntity.role.eq(Role.valueOf(roleFilter)));
        }

        List<OrderSpecifier<?>> orderSpecifiers = new ArrayList<>();
        if (sortBy != null && !sortBy.isBlank()) {
            Order direction = "DESC".equalsIgnoreCase(sortDir) ? Order.DESC : Order.ASC;

            if ("email".equalsIgnoreCase(sortBy)) {
                orderSpecifiers.add(new OrderSpecifier<>(direction, userEntity.email));
            } else if ("role".equalsIgnoreCase(sortBy)) {
                orderSpecifiers.add(new OrderSpecifier<>(direction, userEntity.role));
            } else {
                orderSpecifiers.add(new OrderSpecifier<>(direction, userEntity.name));
            }
        }

        List<UserEntity> users = queryFactory
                .selectFrom(userEntity)
                .where(where)
                .orderBy(orderSpecifiers.toArray(new OrderSpecifier[0]))
                .offset((long) page * size)
                .limit(size)
                .fetch();

        Long totalElements = queryFactory
                .select(userEntity.count())
                .from(userEntity)
                .where(where)
                .fetchOne();

        long safeTotal = totalElements == null ? 0L : totalElements;

        return PageResponse.<UserResponse>builder()
                .page(page)
                .size(size)
                .totalPages((int) Math.ceil((double) safeTotal / size))
                .totalElements(safeTotal)
                .data(users.stream().map(userMapper::toResponse).toList())
                .build();
    }

    @Override
    @Transactional
    public void deleteUser(String id) {
        UserEntity getUser = userRepository.findByUserId(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        userRepository.delete(getUser);
    }

    @Override
    @Transactional
    public UserResponse updateUser(String id, UserRequest request){

        log.info("Updating user with ID: {}", id);

        UserEntity updateUser = userRepository.findByUserId(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        String requestedName = request.getName() == null ? null : request.getName().trim();
        if (requestedName != null && !requestedName.isBlank()) {
            UserEntity existingUser = userRepository.findByNameIgnoreCase(requestedName).orElse(null);
            if (existingUser != null && !existingUser.getUserId().equals(updateUser.getUserId())) {
                throw new DuplicateResourceException("Name already exists");
            }
            updateUser.setName(requestedName);
        }


        log.info("User updated successfully: {}", id);

        updateUser = userRepository.save(updateUser);

        return userMapper.toResponse(updateUser);

    }
}
