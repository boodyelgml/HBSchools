package com.ask.basic.auth.service;

import com.ask.basic.auth.data.AttachRolesToUserRequest;
import com.ask.basic.auth.data.UpdateUserRequest;
import com.ask.basic.auth.domain.User;

import java.util.List;

public interface UserService {
    User getUserById(Long userId);
    List<User> getAllUsers();
    User updateUser(UpdateUserRequest request);
    User attachRolesToUser(AttachRolesToUserRequest request);
}
