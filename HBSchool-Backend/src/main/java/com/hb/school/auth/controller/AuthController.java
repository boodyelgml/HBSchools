package com.hb.school.auth.controller;

import com.hb.school.auth.data.AttachRolesToUserRequest;
import com.hb.school.auth.data.CreateRoleRequest;
import com.hb.school.auth.data.TreeNodeDTO;
import com.hb.school.auth.data.UpdateRoleRequest;
import com.hb.school.auth.domain.Permission;
import com.hb.school.auth.domain.PermissionRepository;
import com.hb.school.auth.domain.Role;
import com.hb.school.auth.domain.RoleRepository;
import com.hb.school.auth.domain.User;
import com.hb.school.auth.domain.UserRepository;
import com.hb.school.auth.request.LoginRequest;
import com.hb.school.auth.request.RegisterRequest;
import com.hb.school.auth.response.LoginResponse;
import com.hb.school.auth.service.AuthWritePlatformService;
import com.hb.school.infrastructure.exceptions.NotFoundException;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthWritePlatformService authWritePlatformService;
    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    // Register a new user
    @PostMapping("/register")
    public LoginResponse register(@Valid @RequestBody RegisterRequest request) {
        return this.authWritePlatformService.register(request);
    }

    // Authenticate a user
    @PostMapping("/authenticate")
    public LoginResponse authenticate(@RequestBody LoginRequest request) throws IOException {
        return this.authWritePlatformService.authenticate(request);
    }

    // Create a new role
    @PostMapping("/create_role")
    public Role create(@Valid @RequestBody CreateRoleRequest createRoleRequest) {
        // TODO handle Duplicate entry 'ssss' for key 'role_name_unique Exception
        Role role = new Role(createRoleRequest.getName(), true);

        createRoleRequest.getPermissions().forEach(permission -> {
            Permission permission1 = this.permissionRepository.findById(Long.parseLong(permission.getId()))
                    .orElseThrow(() -> new NotFoundException("permission", Long.parseLong(permission.getKey())));
            role.getPermissions().add(permission1);
            permission1.getRoles().add(role);
            permissionRepository.save(permission1);
        });

        return this.roleRepository.save(role);
    }

    @PostMapping("/update_role_name")
    public Role updateRoleName(@Valid @RequestBody UpdateRoleRequest createRoleRequest) {
        Role role = this.roleRepository.findById(createRoleRequest.getId())
                .orElseThrow(() -> new NotFoundException("role", createRoleRequest.getId()));
        role.setName(createRoleRequest.getName());
        return this.roleRepository.save(role);
    }

    // Get roles with permissions in a tree structure
    @GetMapping("/roles_with_permissions_tree")
    public List<TreeNodeDTO> rolesWithPermissionsTree() {
        List<TreeNodeDTO> result = new ArrayList<>();
        var roles = this.roleRepository.findAll();

        for (Role role : roles) {
            role.setPermissions(this.permissionRepository.findByRoles(role));
            TreeNodeDTO treeNodeDTO = TreeNodeDTO.builder()
                    .id(role.getId().toString())
                    .key(role.getId().toString() + new Random().nextInt())
                    .label(role.getName())
                    .build();

            for (Permission permission : role.getPermissions()) {
                TreeNodeDTO permissionTreeNodeDTO = TreeNodeDTO.builder()
                        .id(permission.getId().toString())
                        .key(permission.getId().toString() + new Random().nextInt())
                        .label(permission.getName())
                        .build();
                treeNodeDTO.getChildren().add(permissionTreeNodeDTO);
            }
            result.add(treeNodeDTO);
        }

        return result;
    }

    // Get roles with permissions grouped by group name in a tree structure
    @GetMapping("/roles_with_permissions_grouped_by_group_name_tree")
    public List<TreeNodeDTO> rolesWithPermissionsGroupedByGroupNameTree() {
        List<TreeNodeDTO> result = new ArrayList<>();
        var roles = this.roleRepository.findAll();

        for (Role role : roles) {
            role.setPermissions(this.permissionRepository.findByRoles(role));
        }

        for (Role role : roles) {
            TreeNodeDTO treeNodeDTO = TreeNodeDTO.builder()
                    .id(role.getId().toString())
                    .key(role.getId().toString())
                    .label(role.getName())
                    .children(new ArrayList<>())
                    .build();

            role.getPermissions().stream().collect(Collectors.groupingBy(Permission::getGroupName))
                    .forEach((groupName, permissionList) -> {
                        TreeNodeDTO permissionTreeNodeDTO = TreeNodeDTO.builder()
                                .id(role.getId().toString())
                                .key(groupName + role.getId().toString())
                                .label(groupName)
                                .children(new ArrayList<>())
                                .build();

                        for (Permission permission : permissionList) {
                            TreeNodeDTO permissionTreeNodeDTO2 = TreeNodeDTO.builder()
                                    .id(permission.getId().toString())
                                    .key(permission.getId().toString() + role.getId().toString())
                                    .label(permission.getName())
                                    .isPermission(true)
                                    .build();
                            permissionTreeNodeDTO.getChildren().add(permissionTreeNodeDTO2);
                        }
                        treeNodeDTO.getChildren().add(permissionTreeNodeDTO);
                    });
            result.add(treeNodeDTO);
        }

        return result;
    }

    // Get permissions grouped by group name
    @GetMapping("/permissions_grouped_by_group_name")
    public List<TreeNodeDTO> getPermissionsGroupedByGroupName() {
        List<TreeNodeDTO> result = new ArrayList<>();

        List<Permission> permissions = this.permissionRepository.findAll();

        permissions.stream().collect(Collectors.groupingBy(Permission::getGroupName))
                .forEach((groupName, permissionList) -> {
                    TreeNodeDTO treeNodeDTO = TreeNodeDTO.builder()
                            .key(groupName + new Random().nextInt())
                            .label(groupName)
                            .children(new ArrayList<>())
                            .build();

                    for (Permission permission : permissionList) {
                        TreeNodeDTO permissionTreeNodeDTO = TreeNodeDTO.builder()
                                .id(permission.getId().toString())
                                .key(permission.getId().toString() + new Random().nextInt())
                                .label(permission.getName())
                                .isPermission(true)
                                .build();
                        treeNodeDTO.getChildren().add(permissionTreeNodeDTO);
                    }
                    result.add(treeNodeDTO);
                });

        return result;
    }

    // Attach roles to a user
    @PostMapping("/attachRolesToUser")
    public User attachRolesToUser(@Valid @RequestBody AttachRolesToUserRequest attachRolesToUserRequest) {
        Set<Role> userRoles = new HashSet<>();

        User user = this.userRepository.findById(attachRolesToUserRequest.getUserId())
                .orElseThrow(() -> new NotFoundException("user", attachRolesToUserRequest.getUserId()));

        for (Long roleId : attachRolesToUserRequest.getRolesList()) {
            Role role = this.roleRepository.findById(roleId)
                    .orElseThrow(() -> new NotFoundException("role", roleId));
            userRoles.add(role);
        }

        user.setRoles(userRoles);
        return this.userRepository.save(user);
    }

    // Delete a role by ID
    @DeleteMapping("/roles/{id}")
    public Role deleteRoleById(@PathParam("id") Long id) {
        Role role = this.roleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("role", id));
        this.roleRepository.delete(role);
        return role;
    }

    // Get user by ID
    @GetMapping("/user/{id}")
    public User getUserById(@PathParam("id") Long id) {
        return this.userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("user", id));
    }

    // Get all users
    @GetMapping("/users")
    public List<User> getUsers() {
        return this.userRepository.findAll();
    }
}
