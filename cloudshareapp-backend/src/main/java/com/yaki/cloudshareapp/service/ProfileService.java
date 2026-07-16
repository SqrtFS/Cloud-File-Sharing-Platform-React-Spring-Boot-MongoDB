package com.yaki.cloudshareapp.service;

import com.yaki.cloudshareapp.exception.ProfileNotFoundException;
import org.springframework.dao.DuplicateKeyException;
import com.yaki.cloudshareapp.document.ProfileDocument;
import com.yaki.cloudshareapp.dto.ProfileRequestDto;
import com.yaki.cloudshareapp.dto.ProfileResponseDto;
import com.yaki.cloudshareapp.exception.EmailExistsException;
import com.yaki.cloudshareapp.mapper.ProfileMapper;
import com.yaki.cloudshareapp.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    public List<ProfileResponseDto> getAll (){
        return profileMapper.toDtoList(profileRepository.findAll());
    }
    public ProfileResponseDto createProfile(ProfileRequestDto profileDTO){
        try {
            ProfileDocument profile = profileRepository.save(profileMapper.toEntity(profileDTO));
            return profileMapper.toDto(profile);
        } catch (DuplicateKeyException e) {
            throw new EmailExistsException("Profile with this email already exists : "+profileDTO.getEmail());
        }
    }
    public ProfileResponseDto updateProfile(String clerkId , ProfileRequestDto profileDTO){
        ProfileDocument profile = profileRepository.findByClerkId(clerkId).orElseThrow(() -> new ProfileNotFoundException("Profile not found with clerkId: " + clerkId));

        profile.setFirstName(profileDTO.getFirstName());
        profile.setLastName(profileDTO.getLastName());
        profile.setPhotoUrl(profileDTO.getPhotoUrl());

        ProfileDocument savedProfile = profileRepository.save(profile);

        return profileMapper.toDto(savedProfile);
    }
    public void deleteProfile(String clerkId){
        long deleted = profileRepository.deleteByClerkId(clerkId);
        if (deleted == 0) {
            throw new ProfileNotFoundException(
                    "Profile not found with clerkId: " + clerkId
            );
        }
    }
    public Optional<ProfileDocument> getCurrentProfile (){
        if(SecurityContextHolder.getContext().getAuthentication() == null){
            throw new UsernameNotFoundException("User not authenticated");
        }
        String clerkId = SecurityContextHolder.getContext().getAuthentication().getName();
        
        return profileRepository.findByClerkId(clerkId);
    }
}
