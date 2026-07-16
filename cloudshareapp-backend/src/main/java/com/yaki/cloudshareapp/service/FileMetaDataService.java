package com.yaki.cloudshareapp.service;

import com.yaki.cloudshareapp.document.FileMetaDataDocument;
import com.yaki.cloudshareapp.document.ProfileDocument;
import com.yaki.cloudshareapp.dto.FileMetaDataDto;
import com.yaki.cloudshareapp.mapper.FileMetaDataMapper;
import com.yaki.cloudshareapp.repository.FileMetaDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileMetaDataService {
    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    private final FileMetaDataRepository fileMetaDataRepository;
    private final FileMetaDataMapper fileMetaDataMapper;
    public List<FileMetaDataDto> uploadFiles(MultipartFile[] files) throws IOException {
        ProfileDocument currentProfile = profileService.getCurrentProfile().orElseThrow(() -> new RuntimeException("Unable to upload files: user profile missing") );
        List<FileMetaDataDocument> savedFiles = new ArrayList<>();

        if(!userCreditsService.hasEnoughCredits(files.length)){
            throw new RuntimeException("Not Enough Credits To Upload Files. Please Purchase More Credits!");
        }
        Path uploadPath = Paths.get("upload").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        for (MultipartFile file: files) {
            String fileName = UUID.randomUUID()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation , StandardCopyOption.REPLACE_EXISTING);

            FileMetaDataDocument fileMetaDataDocument = FileMetaDataDocument.builder()
                    .fileLocation(targetLocation.toString())
                    .name(file.getOriginalFilename())
                    .fileSize(file.getSize())
                    .type(file.getContentType())
                    .clerkId(currentProfile.getClerkId())
                    .isPublic(false)
                    .uploadedAt(LocalDateTime.now())
                    .build();


            userCreditsService.consumeCredit();

            savedFiles.add(fileMetaDataRepository.save(fileMetaDataDocument));
        }

       return savedFiles.stream().map(fileMetaDataMapper::toDto).toList();
    }

    public List<FileMetaDataDto> getFiles(){
        ProfileDocument currentProfile = profileService.getCurrentProfile().orElseThrow(() -> new RuntimeException("Unable to upload files: user profile missing") );
        List<FileMetaDataDocument> files = fileMetaDataRepository.findByClerkId(currentProfile.getClerkId());
        return files.stream().map(fileMetaDataMapper::toDto).toList();
    }
    public FileMetaDataDto getPublicFile(String id){
        Optional<FileMetaDataDocument> fileOptional = fileMetaDataRepository.findById(id);
        if(fileOptional.isEmpty() || !fileOptional.get().getIsPublic()){
            throw new RuntimeException("Unable to get the file");
        }
        FileMetaDataDocument document = fileOptional.get();
        return fileMetaDataMapper.toDto(document);
    }

    public FileMetaDataDto getDownloadableFile(String id){
       FileMetaDataDocument file= fileMetaDataRepository.findById(id).orElseThrow(()-> new RuntimeException("File not found"));
       return fileMetaDataMapper.toDto(file);
    }
    public void deleteFile(String id) {
            ProfileDocument currentProfile = profileService.getCurrentProfile()
                    .orElseThrow(() -> new RuntimeException("Unable to delete files: user profile missing"));

            FileMetaDataDocument file = fileMetaDataRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("File not found"));

            if (!file.getClerkId().equals(currentProfile.getClerkId())) {
                throw new RuntimeException("File does not belong to current user");
            }

            try {
                Path path = Paths.get(file.getFileLocation());
                Files.deleteIfExists(path);
            } catch (IOException e) {
                throw new RuntimeException("Error deleting the file from disk", e);
            }

            fileMetaDataRepository.delete(file);
        }

        public FileMetaDataDto togglePublic(String id){
            FileMetaDataDocument file= fileMetaDataRepository.findById(id).orElseThrow(()-> new RuntimeException("File not found"));
            file.setIsPublic(!file.getIsPublic());
            fileMetaDataRepository.save(file);
            return fileMetaDataMapper.toDto(file);
        }
}
