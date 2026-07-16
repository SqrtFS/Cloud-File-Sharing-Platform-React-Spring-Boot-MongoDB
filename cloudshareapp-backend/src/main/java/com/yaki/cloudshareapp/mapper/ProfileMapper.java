package com.yaki.cloudshareapp.mapper;


import com.yaki.cloudshareapp.document.ProfileDocument;
import com.yaki.cloudshareapp.dto.ProfileRequestDto;
import com.yaki.cloudshareapp.dto.ProfileResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileResponseDto toDto(ProfileDocument entity);
    @Mapping(target = "credits" , constant = "5")
    ProfileDocument toEntity(ProfileRequestDto request);
    List<ProfileResponseDto> toDtoList(List<ProfileDocument> entities);
}
