package com.hb.school.auth.data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;


@Data
public class UpdateRoleRequest {
    @NotNull(message = "يجب أن يتم تحديد الرقم")
    long id;

    @NotNull(message = "يجب أن يتم تحديد الأسم")
    @NotBlank(message = "الأسم لا يمكن ان يكون فارغا")
    @Length(min = 4, message = "الأسم لا يمكن ان يكون اقل من 4 حروف")
    String name;
}
