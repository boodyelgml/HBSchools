package com.ask.basic.auth.service;

import com.ask.basic.auth.data.TreeNodeDTO;

import java.util.List;

public interface PermissionService {
    List<TreeNodeDTO> getPermissionsGroupedByGroupName();
}
