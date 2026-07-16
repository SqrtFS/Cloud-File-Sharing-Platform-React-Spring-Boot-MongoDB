package com.yaki.cloudshareapp.mapper;


import com.yaki.cloudshareapp.document.FileMetaDataDocument;
import com.yaki.cloudshareapp.dto.FileMetaDataDto;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface FileMetaDataMapper {
    FileMetaDataDto toDto(FileMetaDataDocument document);
}
