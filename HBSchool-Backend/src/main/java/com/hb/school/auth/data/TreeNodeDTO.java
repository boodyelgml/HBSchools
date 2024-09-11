package com.hb.school.auth.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TreeNodeDTO {
    private String id;
    private String key;
    private String label;
    private String data;
    private String icon;
    private Boolean isPermission;
    private List<TreeNodeDTO> children;

}
