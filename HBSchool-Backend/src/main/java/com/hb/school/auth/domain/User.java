package com.hb.school.auth.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import com.hb.school.auth.data.PermissionDto;
import com.hb.school.auth.data.RoleDto;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


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

    @Column(name = "first_address")
    private String firstAddress;

    @Column(name = "second_address")
    private String secondAddress;

    @Column(name = "mobile_number")
    private Long mobileNumber;

    @Column(name = "work_number")
    private Long workNumber;

    @Column(name = "home_number")
    private Long homeNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "postal_code")
    private Long postalCode;

    @Column(name = "marital_status")
    private String maritalStatus;

    @JsonIgnore
    @Column(name = "password")
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private Boolean isActive;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
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

            // uncomment below code to switch to roles
            // list.add(new SimpleGrantedAuthority(role.getName()));

            // uncomment below code to switch to permissions
            for (Permission permission : role.getPermissions()) {
                list.add(new SimpleGrantedAuthority(permission.getName()));
            }
        }
        return list;
    }

    @Override
    public String getUsername() {
        return getEmail();
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
        return true;
    }




}
