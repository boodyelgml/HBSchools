package com.ask.basic.auth.service;

import com.ask.basic.auth.data.TreeNodeDTO;
import com.ask.basic.auth.domain.Permission;
import com.ask.basic.auth.domain.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    public List<TreeNodeDTO> getPermissionsGroupedByGroupName() {
        List<TreeNodeDTO> result = new ArrayList<>();
        List<Permission> permissions = this.permissionRepository.findAll();

        if (permissions.isEmpty()) {
            return result;
        }

        permissions.stream()
                .filter(permission -> permission != null)
                .collect(Collectors.groupingBy(permission ->
                    permission.getGroupName() != null ? permission.getGroupName() : "Unknown Group"))
                .forEach((groupName, permissionList) -> {
                    TreeNodeDTO treeNodeDTO = TreeNodeDTO.builder()
                            .key(groupName + new Random().nextInt())
                            .label(groupName)
                            .children(new ArrayList<>())
                            .build();

                    for (Permission permission : permissionList) {
                        if (permission != null) {
                            TreeNodeDTO permissionTreeNodeDTO = TreeNodeDTO.builder()
                                    .id(permission.getId() != null ? permission.getId().toString() : null)
                                    .key((permission.getId() != null ? permission.getId().toString() : "") + new Random().nextInt())
                                    .label(permission.getName() != null ? permission.getName() : "Unknown Permission")
                                    .isPermission(true)
                                    .build();
                            treeNodeDTO.getChildren().add(permissionTreeNodeDTO);
                        }
                    }
                    result.add(treeNodeDTO);
                });

        return result;
    }
}
