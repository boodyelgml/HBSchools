package com.ask.basic.auth.service;

import com.ask.basic.auth.data.AttachRolesToUserRequest;
import com.ask.basic.auth.data.UpdateUserRequest;
import com.ask.basic.auth.domain.Role;
import com.ask.basic.auth.domain.RoleRepository;
import com.ask.basic.auth.domain.User;
import com.ask.basic.auth.domain.UserRepository;
import com.ask.basic.infrastructure.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public User getUserById(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        return this.userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("user", userId));
    }

    @Override
    public List<User> getAllUsers() {
        List<User> users = this.userRepository.findAll();
        return users != null ? users : new ArrayList<>();
    }

    @Override
    public User updateUser(UpdateUserRequest request) {
        if (request.getId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        User user = this.userRepository.findById(request.getId())
                .orElseThrow(() -> new NotFoundException("user", request.getId()));

        // Only update non-null fields
        if (request.getTitle() != null) {
            user.setTitle(request.getTitle());
        }
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getMiddleName() != null) {
            user.setMiddleName(request.getMiddleName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getMaritalStatus() != null) {
            user.setMaritalStatus(request.getMaritalStatus());
        }
        if (request.getFirstAddress() != null) {
            user.setFirstAddress(request.getFirstAddress());
        }
        if (request.getSecondAddress() != null) {
            user.setSecondAddress(request.getSecondAddress());
        }
        if (request.getPostalCode() != null) {
            user.setPostalCode(request.getPostalCode());
        }
        if (request.getMobileNumber() != null) {
            user.setMobileNumber(request.getMobileNumber());
        }
        if (request.getWorkNumber() != null) {
            user.setWorkNumber(request.getWorkNumber());
        }
        if (request.getHomeNumber() != null) {
            user.setHomeNumber(request.getHomeNumber());
        }
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        user.setUpdatedAt(java.time.LocalDateTime.now());
        return this.userRepository.save(user);
    }

    @Override
    public User attachRolesToUser(AttachRolesToUserRequest attachRolesToUserRequest) {
        if (attachRolesToUserRequest.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        User user = this.userRepository.findById(attachRolesToUserRequest.getUserId())
                .orElseThrow(() -> new NotFoundException("user", attachRolesToUserRequest.getUserId()));

        Set<Role> userRoles = new HashSet<>();

        if (attachRolesToUserRequest.getRolesList() != null) {
            for (Long roleId : attachRolesToUserRequest.getRolesList()) {
                if (roleId != null) {
                    Role role = this.roleRepository.findById(roleId)
                            .orElseThrow(() -> new NotFoundException("role", roleId));
                    userRoles.add(role);
                }
            }
        }

        user.setRoles(userRoles);
        return this.userRepository.save(user);
    }
}
