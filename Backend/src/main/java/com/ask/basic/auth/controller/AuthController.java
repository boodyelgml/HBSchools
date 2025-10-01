package com.ask.basic.auth.controller;

import com.ask.basic.auth.data.AttachRolesToUserRequest;
import com.ask.basic.auth.data.CreateRoleRequest;
import com.ask.basic.auth.data.TreeNodeDTO;
import com.ask.basic.auth.data.UpdateRoleRequest;
import com.ask.basic.auth.data.UpdateUserRequest;
import com.ask.basic.auth.domain.Role;
import com.ask.basic.auth.domain.User;
import com.ask.basic.auth.request.LoginRequest;
import com.ask.basic.auth.request.RegisterRequest;
import com.ask.basic.auth.response.LoginResponse;
import com.ask.basic.auth.service.AuthWritePlatformService;
import com.ask.basic.auth.service.PermissionService;
import com.ask.basic.auth.service.RoleService;
import com.ask.basic.auth.service.UserService;
import com.ask.basic.infrastructure.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthWritePlatformService authWritePlatformService;
    private final RoleService roleService;
    private final UserService userService;
    private final PermissionService permissionService;

    // Register a new user
    @PostMapping("/register")
    public ApiResponse<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = this.authWritePlatformService.register(request);
        return ApiResponse.success(response, "User registered successfully");
    }

    // Authenticate a user
    @PostMapping("/authenticate")
    public ApiResponse<LoginResponse> authenticate(@RequestBody LoginRequest request) throws IOException {
        LoginResponse response = this.authWritePlatformService.authenticate(request);
        return ApiResponse.success(response, "Authentication successful");
    }

    // Create a new role
    @PostMapping("/create_role")
    public ApiResponse<Role> create(@Valid @RequestBody CreateRoleRequest createRoleRequest) {
        Role role = this.roleService.createRole(createRoleRequest);
        return ApiResponse.success(role, "Role created successfully");
    }

    @PostMapping("/update_role_name")
    public ApiResponse<Role> updateRoleName(@Valid @RequestBody UpdateRoleRequest updateRoleRequest) {
        Role role = this.roleService.updateRoleName(updateRoleRequest);
        return ApiResponse.success(role, "Role name updated successfully");
    }

    // Get roles with permissions in a tree structure
    @GetMapping("/roles_with_permissions_tree")
    public ApiResponse<List<TreeNodeDTO>> rolesWithPermissionsTree() {
        List<TreeNodeDTO> result = this.roleService.getRolesWithPermissionsTree();
        return ApiResponse.success(result, "Roles with permissions tree retrieved successfully");
    }

    // Get roles with permissions grouped by group name in a tree structure
    @GetMapping("/roles_with_permissions_grouped_by_group_name_tree")
    public ApiResponse<List<TreeNodeDTO>> rolesWithPermissionsGroupedByGroupNameTree() {
        List<TreeNodeDTO> result = this.roleService.getRolesWithPermissionsGroupedByGroupNameTree();
        return ApiResponse.success(result, "Roles with permissions grouped tree retrieved successfully");
    }

    // Get permissions grouped by group name
    @GetMapping("/permissions_grouped_by_group_name")
    public ApiResponse<List<TreeNodeDTO>> getPermissionsGroupedByGroupName() {
        List<TreeNodeDTO> result = this.permissionService.getPermissionsGroupedByGroupName();
        return ApiResponse.success(result, "Permissions grouped by group name retrieved successfully");
    }

    // Attach roles to a user
    @PostMapping("/attachRolesToUser")
    public ApiResponse<User> attachRolesToUser(@Valid @RequestBody AttachRolesToUserRequest attachRolesToUserRequest) {
        User user = this.userService.attachRolesToUser(attachRolesToUserRequest);
        return ApiResponse.success(user, "Roles attached to user successfully");
    }

    // Delete a role by ID
    @DeleteMapping("/roles/{id}")
    public ApiResponse<Role> deleteRoleById(@PathVariable("id") Long id) {
        Role role = this.roleService.deleteRole(id);
        return ApiResponse.success(role, "Role deleted successfully");
    }

    // Get user by ID
    @GetMapping("/user/{id}")
    public ApiResponse<User> getUserById(@PathVariable("id") Long id) {
        User user = this.userService.getUserById(id);
        return ApiResponse.success(user, "User retrieved successfully");
    }

    // Get all users
    @GetMapping("/users")
    public ApiResponse<List<User>> getUsers() {
        List<User> users = this.userService.getAllUsers();
        return ApiResponse.success(users, "Users retrieved successfully");
    }

    // Update user by ID
    @PutMapping("/user/update")
    public ApiResponse<User> updateUser(@Valid @RequestBody UpdateUserRequest request) {
        User user = this.userService.updateUser(request);
        return ApiResponse.success(user, "User updated successfully");
    }
}
