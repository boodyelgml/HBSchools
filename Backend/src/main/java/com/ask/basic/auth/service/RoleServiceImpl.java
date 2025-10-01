package com.ask.basic.auth.service;

import com.ask.basic.auth.data.CreateRoleRequest;
import com.ask.basic.auth.data.TreeNodeDTO;
import com.ask.basic.auth.data.UpdateRoleRequest;
import com.ask.basic.auth.domain.Permission;
import com.ask.basic.auth.domain.PermissionRepository;
import com.ask.basic.auth.domain.Role;
import com.ask.basic.auth.domain.RoleRepository;
import com.ask.basic.infrastructure.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public Role createRole(CreateRoleRequest createRoleRequest) {
        Role role = new Role(createRoleRequest.getName(), true);

        if (createRoleRequest.getPermissions() != null) {
            createRoleRequest.getPermissions().forEach(permission -> {
                if (permission != null && permission.getId() != null) {
                    try {
                        Long permissionId = Long.parseLong(permission.getId());
                        Permission permission1 = this.permissionRepository.findById(permissionId)
                                .orElseThrow(() -> new NotFoundException("permission", permissionId));
                        role.getPermissions().add(permission1);
                        permission1.getRoles().add(role);
                        permissionRepository.save(permission1);
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("Invalid permission ID format: " + permission.getId());
                    }
                }
            });
        }

        return this.roleRepository.save(role);
    }

    @Override
    public Role updateRoleName(UpdateRoleRequest updateRoleRequest) {
        Role role = this.roleRepository.findById(updateRoleRequest.getId())
                .orElseThrow(() -> new NotFoundException("role", updateRoleRequest.getId()));
        role.setName(updateRoleRequest.getName());
        return this.roleRepository.save(role);
    }

    @Override
    public Role deleteRole(Long roleId) {
        if (roleId == null) {
            throw new IllegalArgumentException("Role ID cannot be null");
        }

        Role role = this.roleRepository.findById(roleId)
                .orElseThrow(() -> new NotFoundException("role", roleId));
        this.roleRepository.delete(role);
        return role;
    }

    @Override
    public List<TreeNodeDTO> getRolesWithPermissionsTree() {
        List<TreeNodeDTO> result = new ArrayList<>();
        List<Role> roles = this.roleRepository.findAll();

        if (roles == null || roles.isEmpty()) {
            return result;
        }

        for (Role role : roles) {
            if (role == null) continue;

            Set<Permission> permissions = this.permissionRepository.findByRoles(role);
            role.setPermissions(permissions != null ? permissions : new HashSet<>());

            TreeNodeDTO treeNodeDTO = TreeNodeDTO.builder()
                    .id(role.getId() != null ? role.getId().toString() : null)
                    .key(role.getId() != null ? role.getId().toString() + new Random().nextInt() : String.valueOf(new Random().nextInt()))
                    .label(role.getName() != null ? role.getName() : "Unknown Role")
                    .children(new ArrayList<>())
                    .build();

            if (role.getPermissions() != null) {
                for (Permission permission : role.getPermissions()) {
                    if (permission != null) {
                        TreeNodeDTO permissionTreeNodeDTO = TreeNodeDTO.builder()
                                .id(permission.getId() != null ? permission.getId().toString() : null)
                                .key(permission.getId() != null ? permission.getId().toString() + new Random().nextInt() : String.valueOf(new Random().nextInt()))
                                .label(permission.getName() != null ? permission.getName() : "Unknown Permission")
                                .build();
                        treeNodeDTO.getChildren().add(permissionTreeNodeDTO);
                    }
                }
            }
            result.add(treeNodeDTO);
        }

        return result;
    }

    @Override
    public List<TreeNodeDTO> getRolesWithPermissionsGroupedByGroupNameTree() {
        List<TreeNodeDTO> result = new ArrayList<>();
        List<Role> roles = this.roleRepository.findAll();

        if (roles == null || roles.isEmpty()) {
            return result;
        }

        for (Role role : roles) {
            if (role == null) continue;

            Set<Permission> permissions = this.permissionRepository.findByRoles(role);
            role.setPermissions(permissions != null ? permissions : new HashSet<>());
        }

        for (Role role : roles) {
            if (role == null || role.getPermissions() == null) continue;

            TreeNodeDTO treeNodeDTO = TreeNodeDTO.builder()
                    .id(role.getId() != null ? role.getId().toString() : null)
                    .key(role.getId() != null ? role.getId().toString() : String.valueOf(new Random().nextInt()))
                    .label(role.getName() != null ? role.getName() : "Unknown Role")
                    .children(new ArrayList<>())
                    .build();

            role.getPermissions().stream()
                    .filter(permission -> permission != null)
                    .collect(Collectors.groupingBy(permission ->
                        permission.getGroupName() != null ? permission.getGroupName() : "Unknown Group"))
                    .forEach((groupName, permissionList) -> {
                        TreeNodeDTO permissionTreeNodeDTO = TreeNodeDTO.builder()
                                .id(role.getId() != null ? role.getId().toString() : null)
                                .key(groupName + (role.getId() != null ? role.getId().toString() : ""))
                                .label(groupName)
                                .children(new ArrayList<>())
                                .build();

                        for (Permission permission : permissionList) {
                            if (permission != null) {
                                TreeNodeDTO permissionTreeNodeDTO2 = TreeNodeDTO.builder()
                                        .id(permission.getId() != null ? permission.getId().toString() : null)
                                        .key((permission.getId() != null ? permission.getId().toString() : "") +
                                             (role.getId() != null ? role.getId().toString() : ""))
                                        .label(permission.getName() != null ? permission.getName() : "Unknown Permission")
                                        .isPermission(true)
                                        .build();
                                permissionTreeNodeDTO.getChildren().add(permissionTreeNodeDTO2);
                            }
                        }
                        treeNodeDTO.getChildren().add(permissionTreeNodeDTO);
                    });
            result.add(treeNodeDTO);
        }

        return result;
    }
}
