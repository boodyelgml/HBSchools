package com.ask.basic.auth.data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRoleRequest {
    @NotNull(message = "يجب أن يتم تحديد الرقم")
    long id;

    @NotNull(message = "يجب أن يتم تحديد الأسم")
    @NotBlank(message = "الأسم لا يمكن ان يكون فارغا")
    @Length(min = 4, message = "الأسم لا يمكن ان يكون اقل من 4 حروف")
    String name;
}
