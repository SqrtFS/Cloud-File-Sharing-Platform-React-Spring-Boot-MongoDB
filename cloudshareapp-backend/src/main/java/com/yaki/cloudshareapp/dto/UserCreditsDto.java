package com.yaki.cloudshareapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCreditsDto {
    private Integer credits;
    private String plan;
}
