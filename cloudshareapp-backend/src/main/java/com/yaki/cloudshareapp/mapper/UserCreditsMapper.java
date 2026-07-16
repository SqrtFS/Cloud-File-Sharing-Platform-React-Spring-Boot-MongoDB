package com.yaki.cloudshareapp.mapper;

import com.yaki.cloudshareapp.document.UserCredits;
import com.yaki.cloudshareapp.dto.UserCreditsDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserCreditsMapper {
    UserCreditsDto toDto(UserCredits userCredits);
}
