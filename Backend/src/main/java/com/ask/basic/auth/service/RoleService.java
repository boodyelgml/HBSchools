package com.ask.basic.auth.service;

import com.ask.basic.auth.data.CreateRoleRequest;
import com.ask.basic.auth.data.TreeNodeDTO;
import com.ask.basic.auth.data.UpdateRoleRequest;
import com.ask.basic.auth.domain.Role;

import java.util.List;

public interface RoleService {
    Role createRole(CreateRoleRequest request);
    Role updateRoleName(UpdateRoleRequest request);
    Role deleteRole(Long roleId);
    List<TreeNodeDTO> getRolesWithPermissionsTree();
    List<TreeNodeDTO> getRolesWithPermissionsGroupedByGroupNameTree();
}
