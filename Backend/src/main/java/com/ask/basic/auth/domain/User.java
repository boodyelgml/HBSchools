package com.ask.basic.auth.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import com.ask.basic.auth.data.PermissionDto;
import com.ask.basic.auth.data.RoleDto;
import jakarta.persistence.*;
import lombok.*;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@JsonSerialize
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "p_app_user")
@Table(name = "p_app_user", uniqueConstraints = {@UniqueConstraint(name = "user_email_unique", columnNames = "email")})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // Personal Information
    @Column(name = "title")
    private String title;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "date_of_birth")
    private LocalDateTime dateOfBirth;

    @Column(name = "marital_status")
    private String maritalStatus;

    // Contact Information
    @Column(name = "first_address")
    private String firstAddress;

    @Column(name = "second_address")
    private String secondAddress;

    @Column(name = "postal_code")
    private String postalCode; // changed to String (instead of Long)

    @Column(name = "mobile_number")
    private String mobileNumber; // changed to String

    @Column(name = "work_number")
    private String workNumber; // changed to String

    @Column(name = "home_number")
    private String homeNumber; // changed to String

    // Credentials
    @Column(name = "username", unique = true)
    private String username; // NEW (was missing)

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(name = "password")
    private String password;

    // System Information
    @Column(name = "account_status")
    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus; // NEW (enum ACTIVE/INACTIVE)

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private Boolean isActive;

    // Roles
    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER, cascade = {
            CascadeType.DETACH,
            CascadeType.MERGE,
            CascadeType.PERSIST,
            CascadeType.REFRESH})
    @JoinTable(name = "p_user_role",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private Set<Role> roles = new HashSet<>();

    public HashSet<RoleDto> getRolesAndPermissions() {
        HashSet<RoleDto> roles = new HashSet<>();
        for (Role role : this.getRoles()) {
            RoleDto roleDto = new RoleDto();
            List<PermissionDto> permissions = new ArrayList<>();

            for (Permission permission : role.getPermissions()) {
                permissions.add(
                        PermissionDto.builder()
                                .id(permission.getId())
                                .name(permission.getName())
                                .group(permission.getGroupName())
                                .isActive(permission.getIsActive())
                                .build());
            }

            roleDto.setId(role.getId());
            roleDto.setName(role.getName());
            roleDto.setPermissions(permissions);

            roles.add(roleDto);
        }
        return roles;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> list = new ArrayList<>();
        for (Role role : getRoles()) {
            for (Permission permission : role.getPermissions()) {
                list.add(new SimpleGrantedAuthority(permission.getName()));
            }
        }
        return list;
    }

    @Override
    public String getUsername() {
        return username != null ? username : email; // prefer username, fallback to email
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return Boolean.TRUE.equals(isActive);
    }
}
