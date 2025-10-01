package com.ask.basic.auth.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoleRequest {

    Boolean isActive;

    @NotNull(message = "يجب أن يتم تحديد الأسم")
    @NotBlank(message = "الأسم لا يمكن ان يكون فارغا")
    @Length(min = 4, message = "الأسم لا يمكن ان يكون اقل من 4 حروف")
    String name;

    @NotNull(message = "يجب أن يتم تحديد الصلاحيات")
    List<TreeNodeDTO> permissions;
}
