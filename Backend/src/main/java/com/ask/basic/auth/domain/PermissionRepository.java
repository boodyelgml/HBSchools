package com.ask.basic.auth.domain;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Set<Permission> findByRoles(Role role);
}